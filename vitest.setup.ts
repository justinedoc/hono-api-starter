import { vi } from "vitest";

vi.mock("@/core/jobs/email.job", () => ({
	emailQueue: {
		add: vi.fn(),
	},
}));

vi.mock("@/core/storage/storage.factory", () => ({
	createStorageService: vi.fn().mockReturnValue({
		getPresignedUploadUrl: vi
			.fn()
			.mockResolvedValue("https://mock-s3-url.com/upload"),
		getFileUrl: vi.fn().mockReturnValue("https://mock-s3-url.com/file.jpg"),
		deleteFile: vi.fn().mockResolvedValue(true),
	}),
}));
