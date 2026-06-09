import { desc, eq, sql } from "drizzle-orm";
import * as httpStatusCodes from "stoker/http-status-codes";
import { db } from "@/core/db";
import { emailQueue } from "@/core/jobs/email.job";
import { AppError } from "@/core/lib/errors";
import {
	type SubscriberStatus,
	subscriber,
} from "@/modules/newsletter/newsletter.schema";

export const subscribeToNewsletter = async (payload: { email: string }) => {
	const [existing] = await db
		.select({ status: subscriber.status })
		.from(subscriber)
		.where(eq(subscriber.email, payload.email))
		.limit(1);

	const [newSubscriber] = await db
		.insert(subscriber)
		.values(payload)
		.onConflictDoUpdate({
			target: subscriber.email,
			set: { status: "subscribed" },
		})
		.returning();

	if (existing?.status !== "subscribed") {
		await emailQueue.add(
			"newsletter-welcome-email",
			{ email: payload.email },
			{ attempts: 3, backoff: { type: "exponential", delay: 1000 } },
		);
	}

	return newSubscriber;
};

export const listSubscribers = async (payload: {
	page: number;
	limit: number;
	status?: SubscriberStatus;
}) => {
	const { page, limit, status } = payload;
	const offset = (page - 1) * limit;

	const whereClause = status ? eq(subscriber.status, status) : undefined;

	const [data, [count]] = await Promise.all([
		db
			.select()
			.from(subscriber)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(desc(subscriber.createdAt)),
		db
			.select({ count: sql<number>`count(*)` })
			.from(subscriber)
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

export const unsubscribe = async (payload: { id: string }) => {
	const [updated] = await db
		.update(subscriber)
		.set({ status: "unsubscribed" })
		.where(eq(subscriber.id, payload.id))
		.returning();

	if (!updated) {
		throw new AppError("Subscriber not found", httpStatusCodes.NOT_FOUND);
	}

	return updated;
};
