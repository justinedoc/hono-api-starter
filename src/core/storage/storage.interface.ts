export interface IStorageService {
	/**
	 * Generates a secure, time-limited URL for the frontend to upload a file directly
	 */
	getPresignedUploadUrl(
		key: string,
		contentType: string,
		size: number,
		metadata?: Record<string, string>,
	): Promise<string>;

	/**
	 * Generates a secure, time-limited URL for the frontend to download a file directly
	 */
	getPresignedDownloadUrl(key: string): Promise<string>;

	/**
	 * Gets the public URL to view/download the file
	 */
	getFileUrl(key: string): string;

	/**
	 * Deletes a file from the bucket
	 */
	deleteFile(key: string): Promise<void>;
}
