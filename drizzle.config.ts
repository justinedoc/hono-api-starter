import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <db url is always present>
		url: process.env.DATABASE_URL!,
	},
});
