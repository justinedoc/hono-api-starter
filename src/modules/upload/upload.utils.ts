import { z } from "zod";

export const uploadFolders = ["avatars"] as const;

export type UploadFolder = (typeof uploadFolders)[number];

export const uploadInitSchema = z.object({
	filename: z.string().min(1, "Filename is required"),
	contentType: z.string().min(1, "Content type is required"),
	size: z
		.number()
		.positive("Size must be greater than 0")
		.max(4 * 1024 * 1024, "File size must not exceed 4MB"),
	folder: z.enum(uploadFolders),
});

export const deleteFileSchema = z.object({
	key: z.string().min(1, "File key is required"),
});

export function sanitizeFileName(originalName: string): string {
	const lastDotIndex = originalName.lastIndexOf(".");
	const hasExtension = lastDotIndex !== -1;

	const extension = hasExtension
		? originalName.substring(lastDotIndex).toLowerCase()
		: "";
	const nameWithoutExt = hasExtension
		? originalName.substring(0, lastDotIndex)
		: originalName;

	const cleanName = nameWithoutExt
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-") // Replace non-alphanumeric with dash
		.replace(/-+/g, "-") // Replace multiple dashes with single dash
		.replace(/^-|-$/g, ""); // Remove leading/trailing dashes

	const finalName = cleanName.length > 0 ? cleanName : "file";
	return `${finalName}${extension}`;
}

export function extractKeyFromUrl(url: string): string | null {
	try {
		const parsed = new URL(url);
		let path = parsed.pathname;
		if (path.startsWith("/")) path = path.substring(1);
		return decodeURIComponent(path);
	} catch {
		return null;
	}
}
