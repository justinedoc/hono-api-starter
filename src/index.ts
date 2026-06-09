import { serve } from "@hono/node-server";
import { activeWorkers } from "@/core/jobs/registry";
import createApp from "@/core/lib/create-app";
import { redis } from "@/core/redis";
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

async function gracefulShutdown(signal: string) {
	console.log(`\nReceived ${signal}. Initiating graceful shutdown...`);

	const timeoutId = setTimeout(() => {
		console.error("Shutdown timeout exceeded. Forcing exit.");
		process.exit(1);
	}, 10000);

	server.close(async (err) => {
		if (err) {
			console.error("Error closing HTTP server:", err);
		} else {
			console.log("HTTP server closed.");
		}

		try {
			if (activeWorkers.length > 0) {
				console.log(`Closing ${activeWorkers.length} BullMQ workers...`);

				const results = await Promise.allSettled(
					activeWorkers.map((worker) => worker.close()),
				);

				for (const result of results) {
					if (result.status === "rejected") {
						console.error("A worker failed to close cleanly:", result.reason);
					}
				}
			}

			if (redis) {
				console.log("Closing Redis connection...");
				await redis.quit();
			}

			clearTimeout(timeoutId);
			console.log("Graceful shutdown complete.");
			process.exit(0);
		} catch (cleanupError) {
			console.error("Error during background cleanup:", cleanupError);
			clearTimeout(timeoutId);
			process.exit(1);
		}
	});
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export default app;
