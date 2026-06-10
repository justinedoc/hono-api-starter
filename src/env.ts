import { config } from "dotenv";
import { prettifyError, z } from "zod";

config();

const baseEnvSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	LOG_LEVEL: z
		.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
		.default("info"),

	SERVER_URL: z.url().default("http://localhost:3000"),
	APP_URL: z.url().default("http://localhost:4321"),

	REDIS_URL: z.string(),
	DATABASE_URL: z.string(),

	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_SECRET: z.string(),

	RESEND_API_KEY: z.string(),

	SENDER_EMAIL: z.email(),
	SUPER_ADMIN_EMAIL: z.email(),
	SUPER_ADMIN_PASSWORD: z.string(),
});

const parsedEnv = baseEnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("Environment Validation Failed!");
	console.error(prettifyError(parsedEnv.error));

	process.exit(1);
}

console.log("✅ ENVs validated successfully.");

export type Env = z.infer<typeof baseEnvSchema>;
export const env = parsedEnv.data;
