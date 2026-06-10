// import {
// 	GetObjectCommand,
// 	PutObjectCommand,
// 	S3Client,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import type { Logger } from "pino";
// import * as httpStatusCodes from "stoker/http-status-codes";
// import type { IStorageService } from "@/core/infrastructure/storage.interface";
// import { AppError } from "@/core/lib/errors";
// import type { Env } from "@/env";

// export class R2StorageAdapter implements IStorageService {
// 	private client: S3Client;
// 	private bucket: R2Bucket;
// 	private bucketName: string;
// 	private publicUrl: string;
// 	private logger: Logger;

// 	constructor(env: Env, logger: Logger) {
// 		if (env.STORAGE_PROVIDER !== "cloudflare_r2") {
// 			throw new Error(
// 				"R2StorageAdapter requires STORAGE_PROVIDER to be cloudflare_r2",
// 			);
// 		}

// 		this.logger = logger;
// 		this.bucket = env.BUCKET;
// 		this.bucketName = env.R2_BUCKET_NAME;
// 		this.publicUrl = env.R2_PUBLIC_URL;

// 		// Initialize S3 SDK specifically for Cloudflare's compatibility layer
// 		this.client = new S3Client({
// 			region: "auto", // Cloudflare R2 always uses "auto" for region
// 			endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
// 			credentials: {
// 				accessKeyId: env.R2_ACCESS_KEY_ID,
// 				secretAccessKey: env.R2_SECRET_ACCESS_KEY,
// 			},
// 		});
// 	}

// 	async getPresignedUploadUrl(
// 		key: string,
// 		contentType: string,
// 		size: number,
// 		metadata?: Record<string, string>,
// 	): Promise<string> {
// 		try {
// 			const command = new PutObjectCommand({
// 				Bucket: this.bucketName,
// 				Key: key,
// 				ContentType: contentType,
// 				ContentLength: size,
// 				Metadata: metadata,
// 			});

// 			// expires in 15 minutes
// 			return await getSignedUrl(this.client, command, { expiresIn: 900 });
// 		} catch (error) {
// 			this.logger.error(
// 				{ error, key, bucket: this.bucketName },
// 				"R2 Adapter: Failed to generate pre-signed upload URL",
// 			);
// 			throw new AppError(
// 				"Failed to generate upload URL",
// 				httpStatusCodes.INTERNAL_SERVER_ERROR,
// 			);
// 		}
// 	}

// 	async getPresignedDownloadUrl(key: string): Promise<string> {
// 		try {
// 			const command = new GetObjectCommand({
// 				Bucket: this.bucketName,
// 				Key: key,
// 			});
// 			// Download link expires in 1 hour
// 			return await getSignedUrl(this.client, command, { expiresIn: 3600 });
// 		} catch (error) {
// 			this.logger.error(
// 				{ error, key, bucket: this.bucketName },
// 				"R2 Adapter: Failed to generate pre-signed download URL",
// 			);
// 			throw new AppError(
// 				"Failed to generate download URL",
// 				httpStatusCodes.INTERNAL_SERVER_ERROR,
// 			);
// 		}
// 	}

// 	getFileUrl(key: string): string {
// 		// R2 public buckets usually have a custom domain attached
// 		// e.g., https://media.immortalconzults.com/filename.png
// 		return `${this.publicUrl}/${key}`;
// 	}

// 	async deleteFile(key: string): Promise<void> {
// 		try {
// 			// Using the ultra-fast native binding instead of the S3 client!
// 			await this.bucket.delete(key);
// 			this.logger.info(
// 				{ key },
// 				"R2 Adapter: Successfully deleted file natively",
// 			);
// 		} catch (error) {
// 			this.logger.error({ error, key }, "R2 Adapter: Failed to delete file");
// 			throw new AppError(
// 				"Failed to delete file from storage provider",
// 				httpStatusCodes.INTERNAL_SERVER_ERROR,
// 			);
// 		}
// 	}
// }
