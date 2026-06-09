import type { AppOpenAPI } from "@/core/lib/types";
import authRouter from "@/modules/auth/auth.router";

export function getV1Routes(app: AppOpenAPI) {
	app.route("/auth", authRouter);

	return app;
}
