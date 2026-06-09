import { createMiddleware } from "hono/factory";
import * as httpStatusCodes from "stoker/http-status-codes";
import { auth } from "@/core/lib/auth";
import type { Permission } from "@/core/lib/permissions";
import type { AppBindings } from "@/core/lib/types";

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		return c.json(
			{
				success: false,
				message: "Unauthorized",
			},
			httpStatusCodes.UNAUTHORIZED,
		);
	}

	c.set("user", session.user);
	c.set("session", session.session);

	c.var.logger.info(
		{ userId: session.user.id },
		"User accessed protected route",
	);
	await next();
});

export const requirePermission = (...requiredPermissions: Permission[]) =>
	createMiddleware<AppBindings>(async (c, next) => {
		const user = c.var.user;

		if (!user) {
			c.var.logger.warn(
				{},
				"Auth middleware not chained before requirePermission?",
			);
			return c.json(
				{ success: false, message: "Unauthorized" },
				httpStatusCodes.UNAUTHORIZED,
			);
		}

		const { role, permissions } = user;

		if (role === "super_admin") {
			return next();
		}

		if (
			role === "admin" &&
			requiredPermissions.every((requiredParam) =>
				permissions?.includes(requiredParam),
			)
		) {
			return next();
		}

		c.var.logger.warn(
			{
				userId: user.id,
				role,
				requiredPermissions,
				userPermissions: permissions,
			},
			"Forbidden access attempt",
		);

		return c.json(
			{ success: false, message: "Forbidden: Insufficient permissions" },
			httpStatusCodes.FORBIDDEN,
		);
	});
