// src/index.ts
import { serve } from "@hono/node-server";
import createApp from "@/core/lib/create-app";
import { getV1Routes } from "@/versions";

const app = createApp();

app.route("/v1", getV1Routes());

const server = serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})

process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})

export default app;
