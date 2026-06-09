import { z } from "@hono/zod-openapi";
import * as t from "drizzle-orm/pg-core";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import generateId from "@/core/lib/generate-id";
import { paginationResultSchema } from "@/core/lib/openapi-utils";

export const subscriberStatusEnum = pgEnum("subscriber_status", [
	"subscribed",
	"unsubscribed",
]);

export const subscriber = pgTable("subscriber", {
	id: t
		.text("id")
		.primaryKey()
		.$defaultFn(() => generateId("sub")),
	email: t.text("email").notNull().unique(),
	status: subscriberStatusEnum("status").default("subscribed").notNull(),
	createdAt: t.timestamp("created_at").defaultNow().notNull(),
});

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
	zodInstance: z,
});

export const insertSubscriberSchema = createInsertSchema(subscriber, {
	email: () => z.email().openapi({ example: "user@example.com" }),
}).omit({
	id: true,
	status: true,
	createdAt: true,
});

export const selectSubscriberSchema = createSelectSchema(subscriber);

export type SubscriberStatus = z.infer<
	ReturnType<typeof selectSubscriberSchema.partial>
>["status"];

export const paginatedSubscriberSchema = paginationResultSchema(
	selectSubscriberSchema,
);
