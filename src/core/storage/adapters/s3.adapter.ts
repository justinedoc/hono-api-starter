import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Logger } from "pino";
import * as httpStatusCodes from "stoker/http-status-codes";
import { AppError } from "@/core/lib/errors";
import type { IStorageService } from "@/core/storage/storage.interface";
import type { Env } from "@/env";

export class S3StorageAdapter implements IStorageService {
	private client: S3Client;
	private bucketName: string;
	private endpointUrl: string;
	private logger: Logger;

	constructor(env: Env, logger: Logger) {
		if (env.STORAGE_PROVIDER !== "s3") {
			throw new Error("S3StorageAdapter requires STORAGE_PROVIDER to be s3");
		}

		this.logger = logger;
		this.client = new S3Client({
			region: env.AWS_REGION,
			endpoint: env.AWS_ENDPOINT_URL_S3,
			forcePathStyle: false,
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
			},
		});

		this.bucketName = env.AWS_S3_BUCKET_NAME;
		this.endpointUrl = env.AWS_ENDPOINT_URL_S3;
	}

	async getPresignedUploadUrl(
		key: string,
		contentType: string,
		size: number,
		metadata?: Record<string, string>,
	): Promise<string> {
		try {
			const command = new PutObjectCommand({
				Bucket: this.bucketName,
				Key: key,
				ContentType: contentType,
				ContentLength: size,
				Metadata: metadata,
			});

			// expires in 15 minutes (900 seconds)
			return await getSignedUrl(this.client, command, { expiresIn: 900 });
		} catch (error) {
			this.logger.error(
				{ error, key, bucket: this.bucketName },
				"S3 Adapter: Failed to generate pre-signed upload URL",
			);
			throw new AppError(
				"Failed to generate upload URL",
				httpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getPresignedDownloadUrl(key: string): Promise<string> {
		try {
			const command = new GetObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			});
			//expires in 1 hour
			return await getSignedUrl(this.client, command, { expiresIn: 3600 });
		} catch (error) {
			this.logger.error(
				{ error, key, bucket: this.bucketName },
				"S3 Adapter: Failed to generate pre-signed download URL",
			);
			throw new AppError(
				"Failed to generate download URL",
				httpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	getFileUrl(key: string): string {
		try {
			const endpoint = new URL(this.endpointUrl);
			endpoint.hostname = `${this.bucketName}.${endpoint.hostname}`;
			return `${endpoint.origin}/${key}`;
		} catch (error) {
			this.logger.warn(
				{ error, endpointUrl: this.endpointUrl },
				"S3 Adapter: Failed to parse endpoint URL, falling back to path-style",
			);
			return `${this.endpointUrl}/${this.bucketName}/${key}`;
		}
	}

	async deleteFile(key: string): Promise<void> {
		try {
			await this.client.send(
				new DeleteObjectCommand({
					Bucket: this.bucketName,
					Key: key,
				}),
			);
			this.logger.info({ key }, "S3 Adapter: Successfully deleted file");
		} catch (error) {
			this.logger.error(
				{ error, key, bucket: this.bucketName },
				"S3 Adapter: Failed to delete file",
			);
			throw new AppError(
				"Failed to delete file from storage provider",
				httpStatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
