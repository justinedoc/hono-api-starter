import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import { db } from "@/core/db";
import * as schema from "@/core/db/schema";
import { env } from "@/env";

const appOrigin = new URL(env.APP_URL).origin;
const apiOrigin = new URL(env.SERVER_URL).origin;

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	secret: env.BETTER_AUTH_SECRET,
	baseURL: `${env.SERVER_URL}/api/v1/auth`,

	trustedOrigins: [appOrigin, apiOrigin],

	user: {
		additionalFields: {
			permissions: {
				type: "string[]",
				required: false,
				defaultValue: [],
			},
		},
	},
	plugins: [
		openAPI({
			disableDefaultReference: true,
		}),
		admin(),
	],

	// appName: "Project name",

	// advanced: {
	// 	crossSubDomainCookies: {
	// 		enabled: true,
	// 	},
	// },
});
