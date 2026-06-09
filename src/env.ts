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

	DATABASE_URL: z.string(),

	BETTER_AUTH_URL: z.url(),
	BETTER_AUTH_SECRET: z.string(),

	RESEND_API_KEY: z.string(),

	SUPER_ADMIN_EMAIL: z.email(),
	SUPER_ADMIN_PASSWORD: z.string(),
});

const s3Schema = z.object({
	STORAGE_PROVIDER: z.literal("s3"),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_REGION: z.string(),
	AWS_S3_BUCKET_NAME: z.string(),
	AWS_ENDPOINT_URL_S3: z.url(),
	AWS_ENDPOINT_URL_IAM: z.url(),
});

// const r2Schema = z.object({
// 	STORAGE_PROVIDER: z.literal("cloudflare_r2"),
// 	CLOUDFLARE_ACCOUNT_ID: z.string(),
// 	R2_ACCESS_KEY_ID: z.string(),
// 	R2_SECRET_ACCESS_KEY: z.string(),
// 	R2_BUCKET_NAME: z.string(),
// 	R2_PUBLIC_URL: z.url(),
// });

const storageSchema = z.discriminatedUnion("STORAGE_PROVIDER", [
	s3Schema,
	// r2Schema,
]);

export const envSchema = baseEnvSchema.and(storageSchema);

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("Environment Validation Failed!");
	console.error(prettifyError(parsedEnv.error));

	process.exit(1);
}

console.log("✅ ENVs validated successfully.");

export type Env = z.infer<typeof envSchema>;
export const env = parsedEnv.data;
