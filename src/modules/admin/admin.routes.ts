import { createRoute, z } from "@hono/zod-openapi";
import * as httpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import createMessageSchema from "@/core/lib/create-message-schema";
import { defaultErrorResponses } from "@/core/lib/openapi-utils";
import { PERMISSIONS } from "@/core/lib/permissions";
import {
	authMiddleware,
	requirePermission,
} from "@/core/middlewares/auth-middleware";
import { insertAdminInvitation } from "@/modules/admin/admin.schema";

const tags = ["Admin Management"];

export const sendInvite = createRoute({
	method: "post",
	path: "/admin/invite",
	tags,
	description: "Send an invitation to a new admin user.",
	middleware: [authMiddleware, requirePermission(PERMISSIONS.MANAGE_ADMINS)],
	request: {
		body: jsonContentRequired(insertAdminInvitation, "Invitation details"),
	},
	responses: {
		[httpStatusCodes.CREATED]: jsonContent(
			createMessageSchema("Invitation sent successfully", true),
			"Success response",
		),
		...defaultErrorResponses,
	},
});

export const acceptInvite = createRoute({
	method: "post",
	path: "/admin/accept-invite",
	tags,
	description: "Accept an admin invitation and create an account.",

	request: {
		body: jsonContentRequired(
			z.object({
				token: z.string(),
				name: z.string().min(2, "Name must be at least 2 characters"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
			"Account creation details",
		),
	},
	responses: {
		[httpStatusCodes.CREATED]: jsonContent(
			createMessageSchema("Account created successfully", true).extend({
				token: z
					.string()
					.openapi({ description: "Session token for automatic login" })
					.nullish(),
			}),
			"Account successfully created",
		),
		...defaultErrorResponses,
	},
});

export type AcceptInviteRoute = typeof acceptInvite;
export type SendInviteRoute = typeof sendInvite;
