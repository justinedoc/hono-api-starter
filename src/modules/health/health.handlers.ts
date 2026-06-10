import * as httpStatusCodes from "stoker/http-status-codes";
import type { AppRouteHandler } from "@/core/lib/types";
import type { CheckRoute } from "./health.routes";
import { getSystemHealth } from "./health.service";

export const check: AppRouteHandler<CheckRoute> = async (c) => {
	const services = await getSystemHealth();

	const isHealthy = services.database === "up" && services.redis === "up";
	const status = isHealthy ? "ok" : "error";

	const statusCode = isHealthy
		? httpStatusCodes.OK
		: httpStatusCodes.SERVICE_UNAVAILABLE;

	if (!isHealthy) {
		c.var.logger.error({ services }, "System health check failed");
	}

	return c.json(
		{
			// biome-ignore lint/suspicious/noExplicitAny: <status is a literal>
			status: status as any,
			timestamp: new Date().toISOString(),
			services,
		},
		statusCode,
	);
};
