import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import * as httpStatusCodes from "stoker/http-status-codes";
import type z from "zod";
import { db } from "@/core/db";
import { emailQueue } from "@/core/jobs/email.job";
import { auth } from "@/core/lib/auth";
import { AppError } from "@/core/lib/errors";
import { env } from "@/env";
import {
	invitation,
	type selectAdminInvitation,
} from "@/modules/admin/admin.schema";
import { user } from "@/modules/auth/auth.schema";

export const sendAdminInvite = async (payload: {
	userId: string;
	name: string;
	email: string;
	permissions: string[];
}) => {
	const { email, permissions, userId, name } = payload;

	const [existingUser] = await db
		.select()
		.from(user)
		.where(eq(user.email, email));

	if (existingUser) {
		throw new AppError(
			"User with this email already exists.",
			httpStatusCodes.CONFLICT,
		);
	}

	const [existingInvite] = await db
		.select()
		.from(invitation)
		.where(eq(invitation.email, email));

	const now = new Date();

	if (existingInvite) {
		if (existingInvite.status === "pending" && existingInvite.expiresAt > now) {
			throw new AppError(
				"A valid, pending invitation already exists for this email.",
				httpStatusCodes.CONFLICT,
			);
		}
		if (existingInvite.status === "accepted") {
			throw new AppError(
				"This email has already accepted an invitation.",
				httpStatusCodes.CONFLICT,
			);
		}
	}

	const token = randomBytes(32).toString("hex");
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 48);

	let newInvite: z.infer<typeof selectAdminInvitation>;

	if (existingInvite) {
		const [updatedInvite] = await db
			.update(invitation)
			.set({
				name,
				permissions,
				token,
				expiresAt,
				status: "pending",
				invitedBy: userId,
			})
			.where(eq(invitation.email, email))
			.returning();
		newInvite = updatedInvite;
	} else {
		const [insertedInvite] = await db
			.insert(invitation)
			.values({
				name,
				email,
				permissions,
				token,
				expiresAt,
				invitedBy: userId,
			})
			.returning();
		newInvite = insertedInvite;
	}

	const inviteLink = `${env.APP_URL}/admin/accept-invite?token=${token}`;

	await emailQueue.add(
		"admin-invite-email",
		{ email, name, inviteLink },
		{ attempts: 3, backoff: { type: "exponential", delay: 1000 } },
	);

	return newInvite;
};

export const acceptAdminInvite = async (payload: {
	token: string;
	name: string;
	password: string;
}) => {
	const [invite] = await db
		.select()
		.from(invitation)
		.where(eq(invitation.token, payload.token));

	if (invite?.status !== "pending") {
		throw new AppError(
			"Invalid or expired invitation.",
			httpStatusCodes.NOT_FOUND,
		);
	}

	if (new Date() > invite.expiresAt) {
		throw new AppError("Invitation has expired.", httpStatusCodes.BAD_REQUEST);
	}

	const newSession = await auth.api.signUpEmail({
		body: {
			email: invite.email,
			password: payload.password,
			name: payload.name,
		},
	});

	if (!newSession?.user?.id) {
		throw new AppError(
			"Failed to create user account from invitation.",
			httpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}

	await Promise.all([
		db
			.update(user)
			.set({
				role: invite.role,
				permissions: invite.permissions,
				emailVerified: true,
			})
			.where(eq(user.id, newSession.user.id)),

		db
			.update(invitation)
			.set({ status: "accepted" })
			.where(eq(invitation.id, invite.id)),
	]);

	return newSession;
};
