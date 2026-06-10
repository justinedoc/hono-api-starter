import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

	return {
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},

		test: {
			environment: "node",
			setupFiles: ["./vitest.setup.ts"],
			globals: true,
			fileParallelism: false,
		},
	};
});
