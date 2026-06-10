import * as httpStatusCodes from "stoker/http-status-codes";
import { AppError } from "@/core/lib/errors";
import type { AppRouteHandler } from "@/core/lib/types";
import type { DeleteFileRoute, InitUploadRoute } from "./upload.routes";
import { initializeUpload, removeFile } from "./upload.service";

export const initUpload: AppRouteHandler<InitUploadRoute> = async (c) => {
	const payload = c.req.valid("json");
	const user = c.get("user");

	if (!user) {
		throw new AppError("Unauthorized", httpStatusCodes.UNAUTHORIZED);
	}

	const result = await initializeUpload({ user, logger: c.var.logger }, payload);

	return c.json(
		{
			success: true,
			message: "Upload URL generated successfully",
			data: result,
		},
		httpStatusCodes.OK,
	);
};

export const deleteFile: AppRouteHandler<DeleteFileRoute> = async (c) => {
	const payload = c.req.valid("json");
	const user = c.get("user");

	if (!user) {
		throw new AppError("Unauthorized", httpStatusCodes.UNAUTHORIZED);
	}

	await removeFile({ user, logger: c.var.logger }, payload);

	return c.json(
		{ success: true, message: "File deleted successfully" },
		httpStatusCodes.OK,
	);
};
