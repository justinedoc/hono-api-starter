import { desc, eq, sql } from "drizzle-orm";
import * as httpStatusCodes from "stoker/http-status-codes";
import type z from "zod";
import { db } from "@/core/db";
import { emailQueue } from "@/core/jobs/email.job";
import { AppError } from "@/core/lib/errors";
import {
	contact,
	type insertContactSchema,
	type TUpdateContact,
} from "@/modules/contact/contact.schema";

export const processContactSubmission = async (
	payload: z.infer<typeof insertContactSchema>,
) => {
	const [newContact] = await db.insert(contact).values(payload).returning();

	await emailQueue.add("contact-notification-email", payload, {
		attempts: 3,
		backoff: { type: "exponential", delay: 1000 },
	});

	return newContact;
};

export const getContact = async (payload: { id: string }) => {
	const [con] = await db
		.select()
		.from(contact)
		.where(eq(contact.id, payload.id));

	if (!con) {
		throw new AppError(
			`Contact record with id ${payload.id} not found`,
			httpStatusCodes.NOT_FOUND,
		);
	}

	return con;
};

export const listContacts = async (payload: {
	page: number;
	limit: number;
	status?: TUpdateContact["status"];
}) => {
	const { page, limit, status } = payload;
	const offset = (page - 1) * limit;

	const whereClause = status ? eq(contact.status, status) : undefined;

	const [data, [count]] = await Promise.all([
		db
			.select()
			.from(contact)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(desc(contact.createdAt)),
		db
			.select({ count: sql<number>`count(*)` })
			.from(contact)
			.where(whereClause),
	]);

	return {
		data,
		meta: {
			total: Number(count.count),
			page,
			limit,
			totalPages: Math.ceil(Number(count.count) / limit),
		},
	};
};

export const updateContact = async (
	payload: { id: string } & TUpdateContact,
) => {
	const { id, ...updateData } = payload;

	if (Object.keys(updateData).length === 0) {
		throw new AppError(
			"No data provided to update",
			httpStatusCodes.BAD_REQUEST,
		);
	}

	const [updated] = await db
		.update(contact)
		.set(updateData)
		.where(eq(contact.id, id))
		.returning();

	if (!updated) {
		throw new AppError("Contact record not found", httpStatusCodes.NOT_FOUND);
	}

	return updated;
};

export const removeContact = async (payload: { id: string }) => {
	const [deleted] = await db
		.delete(contact)
		.where(eq(contact.id, payload.id))
		.returning();

	if (!deleted) {
		throw new AppError("Record not found", httpStatusCodes.NOT_FOUND);
	}

	return deleted;
};
