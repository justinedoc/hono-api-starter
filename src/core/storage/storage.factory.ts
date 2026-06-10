import type { Logger } from "pino";
import { env } from "@/env";
// import { R2StorageAdapter } from "./adapters/r2.adapter";
import { S3StorageAdapter } from "./adapters/s3.adapter";
import type { IStorageService } from "./storage.interface";

export const createStorageService = (logger: Logger): IStorageService => {
	const provider = env.STORAGE_PROVIDER || "s3";

	if (provider === "s3") {
		return new S3StorageAdapter(env, logger);
	}

	// if (provider === "cloudflare_r2") {
	// 	return new R2StorageAdapter(env, logger);
	// }

	throw new Error(`Unsupported storage provider: ${provider}`);
};
