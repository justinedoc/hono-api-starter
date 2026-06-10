import { sql } from "drizzle-orm";
import { db } from "@/core/db";
import { redis } from "@/core/redis";

export const getSystemHealth = async () => {
	let database: "up" | "down" = "down";
	let redisStatus: "up" | "down" = "down";

	try {
		await db.execute(sql`SELECT 1`);
		database = "up";
	} catch {
		database = "down";
	}

	try {
		if (redis.status === "ready" || redis.status === "connect") {
			await redis.ping();
			redisStatus = "up";
		}
	} catch {
		redisStatus = "down";
	}

	return { database, redis: redisStatus };
};
