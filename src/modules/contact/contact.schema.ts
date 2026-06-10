import { z } from "@hono/zod-openapi";
import * as t from "drizzle-orm/pg-core";
import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import generateId from "@/core/lib/generate-id";
import { paginationResultSchema } from "@/core/lib/openapi-utils";

export const contactStatusEnum = pgEnum("contact_status", [
	"pending",
	"replied",
	"archived",
]);

export const contact = pgTable("contact", {
	id: t
		.text("id")
		.primaryKey()
		.$defaultFn(() => generateId("con")),
	firstName: t.text("first_name").notNull(),
	lastName: t.text("last_name").notNull(),
	email: t.text("email").notNull(),
	subject: t.text("subject"),
	message: t.text("message").notNull(),
	status: contactStatusEnum("status").default("pending").notNull(),
	createdAt: t.timestamp("created_at").defaultNow().notNull(),
	updatedAt: t
		.timestamp("updated_at")
		.defaultNow()
		.$defaultFn(() => new Date())
		.notNull(),
});

const { createInsertSchema, createSelectSchema, createUpdateSchema } =
	createSchemaFactory({
		zodInstance: z,
	});

export const insertContactSchema = createInsertSchema(contact, {
	firstName: (s) => s.min(2).openapi({ example: "Justin" }),
	lastName: (s) => s.min(2).openapi({ example: "Onyiriuka" }),
	email: () => z.email().openapi({ example: "justin@example.com" }),
	message: (s) =>
		s.min(5).openapi({ example: "I need a CRM integration built." }),
}).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	status: true,
});

export const selectContactSchema = createSelectSchema(contact);

export const updateContactSchema = createUpdateSchema(contact, {
	status: (schema) => schema.openapi({ example: "replied" }),
}).pick({ status: true });

export type TUpdateContact = z.infer<typeof updateContactSchema>;

export const paginatedContactSchema =
	paginationResultSchema(selectContactSchema);
