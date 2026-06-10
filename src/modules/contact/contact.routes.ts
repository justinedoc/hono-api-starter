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
	contactStatusEnum,
	insertContactSchema,
	paginatedContactSchema,
	selectContactSchema,
	updateContactSchema,
} from "@/modules/contact/contact.schema";

const tags = ["Contact"];

export const create = createRoute({
	method: "post",
	path: "/contact",
	tags,
	description: "Submit a new contact or inquiry form.",
	request: {
		body: jsonContentRequired(insertContactSchema, "The contact form details"),
	},
	responses: {
		[httpStatusCodes.CREATED]: jsonContent(
			createMessageSchema("Submitted successfully.", true).extend({
				data: selectContactSchema,
			}),
			"Success",
		),
		...defaultErrorResponses,
	},
});

export const getById = createRoute({
	method: "get",
	path: "/contact/{id}",
	tags,
	description: "Retrieving a contact record by ID.",
	middleware: [authMiddleware, requirePermission(PERMISSIONS.READ_CONTACT)],
	security: [{ BearerAuth: [] }],

	request: {
		params: z.object({ id: z.string().openapi({ example: "con_123" }) }),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("Retrieved successfully.", true).extend({
				data: selectContactSchema,
			}),
			"Success",
		),
		...defaultErrorResponses,
	},
});

export const list = createRoute({
	method: "get",
	path: "/contact",
	tags,
	description: "List all contact requests with pagination.",
	middleware: [authMiddleware, requirePermission(PERMISSIONS.READ_CONTACT)],
	security: [{ BearerAuth: [] }],

	request: {
		query: paginationQuerySchema.extend({
			status: z.enum(contactStatusEnum.enumValues).optional(),
		}),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			paginatedContactSchema.extend({
				success: z.boolean(),
				message: z.string(),
			}),
			"Paginated list of contacts",
		),
		...defaultErrorResponses,
	},
});

export const update = createRoute({
	method: "patch",
	path: "/contact/{id}",
	tags,
	description: "Update a contact request.",
	middleware: [authMiddleware, requirePermission(PERMISSIONS.UPDATE_CONTACT)],
	security: [{ BearerAuth: [] }],

	request: {
		params: z.object({ id: z.string().openapi({ example: "con_123" }) }),
		body: jsonContentRequired(updateContactSchema, "The new status"),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("Contact updated successfully", true).extend({
				data: selectContactSchema,
			}),
			"The updated contact record",
		),
		...defaultErrorResponses,
	},
});

export const remove = createRoute({
	method: "delete",
	path: "/contact/{id}",
	tags,
	description: "Delete a contact record permanently.",
	middleware: [authMiddleware, requirePermission(PERMISSIONS.DELETE_CONTACT)],
	security: [{ BearerAuth: [] }],

	request: {
		params: z.object({ id: z.string().openapi({ example: "con_123" }) }),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("Record deleted.", true),
			"Success",
		),
		...defaultErrorResponses,
	},
});

export type CreateRoute = typeof create;
export type GetByIdRoute = typeof getById;
export type ListRoute = typeof list;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
