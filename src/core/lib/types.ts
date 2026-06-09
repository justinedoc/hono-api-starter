import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Logger } from "pino";
import type { auth } from "@/core/lib/auth";

type AuthType = typeof auth;

export type AuthSession = AuthType["$Infer"]["Session"];

export type AppBindings = {
	Variables: {
		logger: Logger;

		user: AuthSession["user"] | null;
		session: AuthSession["session"] | null;
	};
};

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;

export type ServiceContext = {
	logger: Logger;
	user?: AuthSession["user"] | null;
	session?: AuthSession["session"] | null;
};

export type ProtectedServiceContext = {
	logger: Logger;
	user: AuthSession["user"];
	session: AuthSession["session"];
};
