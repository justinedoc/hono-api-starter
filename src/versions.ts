import configureOpenAPI from "@/core/lib/configure-openapi";
import { createRouter } from "@/core/lib/create-app";
import adminRouter from "@/modules/admin/admin.router";
import authRouter from "@/modules/auth/auth.router";
import contactRouter from "@/modules/contact/contact.router";
import healthRouter from "@/modules/health/health.router";
import newsletterRouter from "@/modules/newsletter/newsletter.router";
import usersRouter from "@/modules/user/user.router";

export function getV1Routes() {
	const router = createRouter();

	router.route("/system", healthRouter);
	router.route("/", newsletterRouter);
	router.route("/", adminRouter);
	router.route("/", contactRouter);
	router.route("/users", usersRouter);
	router.route("/auth", authRouter);

	configureOpenAPI(router, "v1");

	return router;
}
