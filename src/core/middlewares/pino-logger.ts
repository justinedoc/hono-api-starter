import type { MiddlewareHandler } from "hono";
import { env } from "hono/adapter";
import { pinoLogger as logger } from "hono-pino";
import pino, { type Level } from "pino";

const baseLogger = pino({
	level: "info",
	browser: { asObject: true },
});

const pinoMiddleware = logger({
	pino: baseLogger,
	http: {
		reqId: () => crypto.randomUUID(),
	},
});

export function pinoLogger(): MiddlewareHandler {
	return async (c, next) => {
		const { LOG_LEVEL } = env<{ LOG_LEVEL: Level }>(c);

		if (LOG_LEVEL) baseLogger.level = LOG_LEVEL;

		return pinoMiddleware(c, next);
	};
}
