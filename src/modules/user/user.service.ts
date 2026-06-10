import { eq } from "drizzle-orm";
import * as httpStatusCodes from "stoker/http-status-codes";
import { db } from "@/core/db";
import { AppError } from "@/core/lib/errors";
import { user } from "@/modules/auth/auth.schema";
import type { UpdateProfilePayload } from "./user.schema";

export const getProfile = async (userId: string) => {
	const [profile] = await db.select().from(user).where(eq(user.id, userId));

	if (!profile) {
		throw new AppError("User not found", httpStatusCodes.NOT_FOUND);
	}

	return profile;
};

export const updateProfile = async (
	userId: string,
	payload: UpdateProfilePayload,
) => {
	if (Object.keys(payload).length === 0) {
		throw new AppError(
			"No data provided to update",
			httpStatusCodes.BAD_REQUEST,
		);
	}

	const [updated] = await db
		.update(user)
		.set(payload)
		.where(eq(user.id, userId))
		.returning();

	if (!updated) {
		throw new AppError("User not found", httpStatusCodes.NOT_FOUND);
	}

	return updated;
};

export const deleteAccount = async (userId: string) => {
	const [deleted] = await db
		.delete(user)
		.where(eq(user.id, userId))
		.returning();

	if (!deleted) {
		throw new AppError("User not found", httpStatusCodes.NOT_FOUND);
	}

	return deleted;
};
