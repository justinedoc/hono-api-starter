import * as httpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import z from "zod";
import createMessageSchema from "@/core/lib/create-message-schema";

/**
 * Standardized error responses used across most OpenAPI routes.
 */
export const defaultErrorResponses = {
	[httpStatusCodes.BAD_REQUEST]: jsonContent(
		createMessageSchema("The request was invalid.", false),
		"Bad Request",
	),
	[httpStatusCodes.UNAUTHORIZED]: jsonContent(
		createMessageSchema("Unauthorized access.", false),
		"Unauthorized",
	),
	[httpStatusCodes.FORBIDDEN]: jsonContent(
		createMessageSchema(
			"You do not have permission to perform this action.",
			false,
		),
		"Forbidden",
	),
	[httpStatusCodes.NOT_FOUND]: jsonContent(
		createMessageSchema("The requested resource was not found.", false),
		"Not Found",
	),
	[httpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
		createMessageSchema("Validation failed. Please check your inputs.", false),
		"Validation Error",
	),
	[httpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
		createMessageSchema("An unexpected error occurred.", false),
		"Internal Server Error",
	),
};

export const paginationQuerySchema = z.object({
	page: z.coerce.number().default(1),
	limit: z.coerce.number().default(10),
});

export const paginationResultSchema = <T extends z.core.$ZodObject>(
	schema: T,
) =>
	z.object({
		data: z.array(schema),
		meta: z.object({
			total: z.number().openapi({ example: 100 }),
			page: z.number().openapi({ example: 1 }),
			limit: z.number().openapi({ example: 10 }),
			totalPages: z.number().openapi({ example: 10 }),
		}),
	});
