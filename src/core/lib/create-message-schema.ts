import { z } from "@hono/zod-openapi";

const createMessageSchema = (
	exampleMessage: string = "Operation successful",
	success: boolean = true,
) => {
	return z
		.object({
			success: z.boolean().openapi({ example: success }),
			message: z.string().openapi({ example: exampleMessage }),
		})
		.openapi({
			example: {
				success,
				message: exampleMessage,
			},
		});
};

export default createMessageSchema;
