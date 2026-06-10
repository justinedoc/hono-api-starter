import { z } from "zod";

export const updateProfileSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").optional(),
	avatarUrl: z.url("Must be a valid URL").optional(),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
