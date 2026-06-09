import { OpenAPIHono } from "@hono/zod-openapi";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { secureHeaders } from "hono/secure-headers";
import * as httpStatusCodes from "stoker/http-status-codes";
import { notFound, serveEmojiFavicon } from "stoker/middlewares";
import { prettifyError } from "zod";
import type { AppBindings } from "@/core/lib/types.js";
import { onError } from "@/core/middlewares/on-error";
import { pinoLogger } from "@/core/middlewares/pino-logger";
import { env } from "@/env";

export function createRouter() {
	return new OpenAPIHono<AppBindings>({
		strict: false,
		defaultHook: (result, c) => {
			if (!result.success) {
				return c.json(
					{
						success: false,
						message: prettifyError(result.error),
					},
					httpStatusCodes.UNPROCESSABLE_ENTITY,
				);
			}
		},
	});
}

export default function createApp() {
	const app = createRouter().basePath("/api");

	app.use("*", etag());
	app.use("*", serveEmojiFavicon("🔥"));

	app.use(
		"*",
		secureHeaders({
			crossOriginResourcePolicy: "cross-origin",
		}),
	);

	app.use(
		"*",
		bodyLimit({
			maxSize: 2 * 1024 * 1024,
			onError: (c) => {
				return c.json(
					{ message: "Payload too large" },
					httpStatusCodes.REQUEST_TOO_LONG,
				);
			},
		}),
	);

	app.use(
		"*",
		cors({
			origin: (origin) => {
				if (env.NODE_ENV === "development" && origin?.includes("localhost")) {
					return origin;
				}
				return env.APP_URL;
			},
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
			allowHeaders: ["Content-Type", "Authorization", "Accept"],
		}),
	);

	app.use("*", pinoLogger);

	// TODO: add ratelimiting middleware

	app.notFound(notFound);
	app.onError(onError);

	return app;
}
