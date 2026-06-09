import type { ContentfulStatusCode } from "hono/utils/http-status";
import * as httpStatusCodes from "stoker/http-status-codes";

export class AppError extends Error {
	public status: ContentfulStatusCode;

	constructor(
		message: string,
		status: ContentfulStatusCode = httpStatusCodes.INTERNAL_SERVER_ERROR,
	) {
		super(message);
		this.name = this.constructor.name;
		this.status = status;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
