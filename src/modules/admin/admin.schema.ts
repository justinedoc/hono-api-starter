import { z } from "@hono/zod-openapi";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import generateId from "@/core/lib/generate-id";
import { user } from "@/modules/auth/auth.schema";

export const adminStatusEnum = pgEnum("admin_status", [
	"pending",
	"accepted",
	"revoked",
	"rejected",
]);

export const adminRole = pgEnum("admin_role", ["admin", "super_admin"]);

export const invitation = pgTable("invitation", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId("ivt")),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	role: adminRole("role").notNull().default("admin"),
	permissions: text("permissions").array().notNull(),

	token: text("token").notNull().unique(),

	status: adminStatusEnum("status").notNull().default("pending"),
	expiresAt: timestamp("expires_at", {
		precision: 6,
		withTimezone: true,
	}).notNull(),

	invitedBy: text("invited_by")
		.notNull()
		.references(() => user.id),

	createdAt: timestamp("created_at", { precision: 6, withTimezone: true })
		.defaultNow()
		.notNull(),
});

const { createInsertSchema, createSelectSchema } = createSchemaFactory({
	zodInstance: z,
});

export const selectAdminInvitation = createSelectSchema(invitation);

export const insertAdminInvitation = createInsertSchema(invitation).pick({
	email: true,
	name: true,
	permissions: true,
});
