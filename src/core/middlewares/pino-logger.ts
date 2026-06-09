import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import { env } from "@/env";

const isDev = env.NODE_ENV === "development";

const baseLogger = pino({
	name: "app-logger",
	level: env.LOG_LEVEL,
	browser: { asObject: true },

	transport: isDev
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname,name",
				},
			}
		: undefined,
});

export const pinoLogger = logger({
	pino: baseLogger,
	http: {
		reqId: () => crypto.randomUUID(),
	},
});
