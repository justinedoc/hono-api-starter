import * as httpStatusCodes from "stoker/http-status-codes";
import type { z } from "zod";
import { AppError } from "@/core/lib/errors";
import { PERMISSIONS } from "@/core/lib/permissions";
import type { ProtectedServiceContext } from "@/core/lib/types";
import { createStorageService } from "@/core/storage/storage.factory";
import { sanitizeFileName, type uploadInitSchema } from "./upload.utils";

export const initializeUpload = async (
	{ user, logger }: Pick<ProtectedServiceContext, "logger" | "user">,
	payload: z.infer<typeof uploadInitSchema>,
) => {
	const sanitizedName = sanitizeFileName(payload.filename);
	const uniqueKey = `${payload.folder}/${user.id}/${Date.now()}-${sanitizedName}`;

	const metadata = {
		userId: user.id,
		originalName: payload.filename,
	};

	const storage = createStorageService(logger);

	const uploadUrl = await storage.getPresignedUploadUrl(
		uniqueKey,
		payload.contentType,
		payload.size,
		metadata,
	);

	const publicUrl = storage.getFileUrl(uniqueKey);

	return {
		uploadUrl,
		publicUrl,
		key: uniqueKey,
	};
};

export const removeFile = async (
	{ user, logger }: Pick<ProtectedServiceContext, "logger" | "user">,
	payload: { key: string },
) => {
	// structure: folder/userId/timestamp-filename.ext
	const pathSegments = payload.key.split("/");

	if (pathSegments.length < 3 || pathSegments[1] !== user.id) {
		if (!user.permissions?.includes(PERMISSIONS.MANAGE_UPLOADS)) {
			throw new AppError(
				"Unauthorized to delete this file",
				httpStatusCodes.FORBIDDEN,
			);
		}
	}

	const storage = createStorageService(logger);

	await storage.deleteFile(payload.key);

	return { success: true };
};
