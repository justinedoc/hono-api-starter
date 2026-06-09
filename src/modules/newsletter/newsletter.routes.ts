import { createRoute, z } from "@hono/zod-openapi";
import * as httpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import createMessageSchema from "@/core/lib/create-message-schema";
import {
	defaultErrorResponses,
	paginationQuerySchema,
} from "@/core/lib/openapi-utils";
import { PERMISSIONS } from "@/core/lib/permissions";
import {
	authMiddleware,
	requirePermission,
} from "@/core/middlewares/auth-middleware";
import {
	insertSubscriberSchema,
	paginatedSubscriberSchema,
	selectSubscriberSchema,
	subscriberStatusEnum,
} from "@/modules/newsletter/newsletter.schema";

const tags = ["Newsletter"];

export const subscribe = createRoute({
	method: "post",
	path: "/newsletter",
	tags,
	description: "Subscribe to the newsletter",
	request: {
		body: jsonContentRequired(insertSubscriberSchema, "Email payload"),
	},
	responses: {
		[httpStatusCodes.CREATED]: jsonContent(
			createMessageSchema("Subscribed successfully", true).extend({
				data: selectSubscriberSchema,
			}),
			"Success",
		),
		...defaultErrorResponses,
	},
});

export const list = createRoute({
	method: "get",
	path: "/newsletter",
	tags,
	description: "List all subscribers",
	middleware: [
		authMiddleware,
		requirePermission(PERMISSIONS.MANAGE_NEWSLETTER),
	],
	security: [{ BearerAuth: [] }],

	request: {
		query: paginationQuerySchema.extend({
			status: z.enum(subscriberStatusEnum.enumValues).optional(),
		}),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			paginatedSubscriberSchema.extend({
				success: z.boolean(),
				message: z.string(),
			}),
			"List of subscribers",
		),
		...defaultErrorResponses,
	},
});

export const remove = createRoute({
	method: "delete",
	path: "/newsletter/{id}",
	tags,
	description: "Unsubscribe an email address",
	middleware: [
		authMiddleware,
		requirePermission(PERMISSIONS.MANAGE_NEWSLETTER),
	],
	security: [{ BearerAuth: [] }],

	request: {
		params: z.object({ id: z.string() }),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("Unsubscribed successfully", true),
			"Success",
		),
		...defaultErrorResponses,
	},
});

export type SubscribeRoute = typeof subscribe;
export type ListRoute = typeof list;
export type RemoveRoute = typeof remove;
