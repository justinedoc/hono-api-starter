import { createRoute, z } from "@hono/zod-openapi";
import * as httpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import createMessageSchema from "@/core/lib/create-message-schema";
import { defaultErrorResponses } from "@/core/lib/openapi-utils";
import { authMiddleware } from "@/core/middlewares/auth-middleware";
import { selectUserSchema } from "@/modules/auth/auth.schema";
import { updateProfileSchema } from "./user.schema";

const tags = ["User Profile"];

export const getProfileRoute = createRoute({
	method: "get",
	path: "/me",
	summary: "Get current user profile",
	tags,
	middleware: [authMiddleware],
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("Profile retrieved successfully", true).extend({
				data: selectUserSchema,
			}),
			"Current user profile",
		),
		...defaultErrorResponses,
	},
});

export const updateProfileRoute = createRoute({
	method: "patch",
	path: "/me",
	summary: "Update current user profile",
	tags,
	middleware: [authMiddleware],
	request: {
		body: jsonContentRequired(updateProfileSchema, "Profile update details"),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("Profile updated successfully", true).extend({
				data: z.any(),
			}),
			"Updated user profile",
		),
		...defaultErrorResponses,
	},
});

export const deleteAccountRoute = createRoute({
	method: "delete",
	path: "/me",
	summary: "Delete user account",
	description: "Permanently deletes the current user and all associated data.",
	tags,
	middleware: [authMiddleware],
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("Account deleted successfully", true),
			"Account deleted",
		),
		...defaultErrorResponses,
	},
});

export type GetProfileRoute = typeof getProfileRoute;
export type UpdateProfileRoute = typeof updateProfileRoute;
export type DeleteAccountRoute = typeof deleteAccountRoute;
