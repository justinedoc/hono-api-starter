import { Scalar } from "@scalar/hono-api-reference";
import type { AppOpenAPI } from "@/core/lib/types";
import packageJSON from "../../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
	app.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
		type: "http",
		scheme: "bearer",
	});

	app.doc("/v1/hono-doc", {
		openapi: "3.1.1",
		info: {
			version: packageJSON.version,
			title: "Project API",
		},
	});

	app.get(
		"/v1/reference",
		Scalar(() => {
			return {
				theme: "kepler",
				pageTitle: "Project Documentation",
				sources: [
					{
						title: "Application API",
						url: "/api/v1/hono-doc",
					},
					{
						title: "Authentication API",
						url: "/api/v1/auth/open-api/generate-schema",
					},
				],
				defaultHttpClient: {
					targetKey: "node",
					clientKey: "fetch",
				},
			};
		}),
	);
}
