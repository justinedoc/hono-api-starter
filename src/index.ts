import { serve } from "@hono/node-server";
import configureOpenAPI from "@/core/lib/configure-openapi";
import createApp from "@/core/lib/create-app";
import { getV1Routes } from "@/versions";

const app = createApp();

configureOpenAPI(app);

app.route("/v1", getV1Routes(app));

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

export default app;
