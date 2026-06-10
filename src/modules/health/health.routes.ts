import { createRoute, z } from "@hono/zod-openapi";
import * as httpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

export const checkRoute = createRoute({
	path: "/health",
	method: "get",
	tags: ["System"],
	summary: "System Health Check",
	description:
		"Verify the operational status of the API, Database, and Redis cache.",
	responses: {
		[httpStatusCodes.OK]: jsonContent(
			z.object({
				status: z.literal("ok"),
				timestamp: z.string(),
				services: z.object({
					database: z.enum(["up", "down"]),
					redis: z.enum(["up", "down"]),
				}),
			}),
			"System is fully operational",
		),

		[httpStatusCodes.SERVICE_UNAVAILABLE]: jsonContent(
			z.object({
				status: z.literal("error"),
				timestamp: z.string(),
				services: z.object({
					database: z.enum(["up", "down"]),
					redis: z.enum(["up", "down"]),
				}),
			}),
			"One or more dependencies are down",
		),
	},
});

export type CheckRoute = typeof checkRoute;
