import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/core/db/schema";
import { env } from "@/env";

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });