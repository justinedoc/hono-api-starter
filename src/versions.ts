import configureOpenAPI from "@/core/lib/configure-openapi";
import { createRouter } from "@/core/lib/create-app";
import adminRouter from "@/modules/admin/admin.router";
import authRouter from "@/modules/auth/auth.router";
import newsletterRouter from "@/modules/newsletter/newsletter.router";

export function getV1Routes() {
	const router = createRouter();

	router.route("/", newsletterRouter);
	router.route("/", adminRouter);

	router.route("/auth", authRouter);

	configureOpenAPI(router, "v1");

	return router;
}
