import { OpenAPIHono } from "@hono/zod-openapi";
import configureOpenAPI from "@/core/lib/configure-openapi";
import type { AppBindings } from "@/core/lib/types";
import authRouter from "@/modules/auth/auth.router";
import newsletterRouter from "@/modules/newsletter/newsletter.router";

export function getV1Routes() {
	const router = new OpenAPIHono<AppBindings>();

	router.route("/auth", authRouter);
	router.route("/", newsletterRouter);

	configureOpenAPI(router, "v1");

	return router;
}
