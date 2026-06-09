import type { ErrorHandler } from "hono";
import { env } from "hono/adapter";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { INTERNAL_SERVER_ERROR } from "stoker/http-status-codes";
import { AppError } from "@/core/lib/errors";
import type { AppBindings } from "@/core/lib/types";

export const onError: ErrorHandler<AppBindings> = (err, c) => {
	const currentStatus =
		"status" in err ? err.status : c.newResponse(null).status;
	const statusCode =
		currentStatus !== "OK"
			? (currentStatus as ContentfulStatusCode)
			: INTERNAL_SERVER_ERROR;

	const { NODE_ENV } = env(c);

	if (c.var.logger) {
		c.var.logger.error(
			{
				err,
				url: c.req.url,
				method: c.req.method,
			},
			err.message || "Unhandled exception in route",
		);
	} else {
		console.error("Unhandled exception:", err);
	}

	let clientMessage = "An unexpected error occurred, please try again later";

	if (err instanceof AppError) {
		clientMessage = err.message;
	} else if (NODE_ENV !== "production") {
		clientMessage = err.message;
	}

	const errorResponse = {
		success: false,
		message: clientMessage,
		stack: NODE_ENV === "production" ? undefined : err.stack,
	};

	return c.json(errorResponse, statusCode);
};
