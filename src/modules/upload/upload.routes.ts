import { createRoute, z } from "@hono/zod-openapi";
import * as httpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import createMessageSchema from "@/core/lib/create-message-schema";
import { defaultErrorResponses } from "@/core/lib/openapi-utils";
import { authMiddleware } from "@/core/middlewares/auth-middleware";
import { deleteFileSchema, uploadInitSchema } from "./upload.utils";

const tags = ["File Upload"];

export const initUploadRoute = createRoute({
	method: "post",
	path: "/init",
	summary: "Initialize a direct-to-storage file upload",
	tags,
	middleware: [authMiddleware],

	request: {
		body: jsonContentRequired(
			uploadInitSchema,
			"File upload initialization details",
		),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("Pre-signed URL generated successfully", true).extend(
				{
					data: z.object({
						uploadUrl: z.url(),
						publicUrl: z.url(),
						key: z.string(),
					}),
				},
			),
			"Pre-signed URL details",
		),

		...defaultErrorResponses,
	},
});

export const deleteFileRoute = createRoute({
	method: "delete",
	path: "/remove",
	summary: "Delete a file from storage",
	tags,
	middleware: [authMiddleware],

	request: {
		body: jsonContentRequired(deleteFileSchema, "File deletion details"),
	},
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			createMessageSchema("File deleted successfully", true),
			"File deleted successfully",
		),

		...defaultErrorResponses,
	},
});

export type InitUploadRoute = typeof initUploadRoute;
export type DeleteFileRoute = typeof deleteFileRoute;
