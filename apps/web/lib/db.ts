import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema";

const url = process.env.NEON_DB_URL;
if (!url) throw new Error("NEON_DB_URL is missing from the root .env");

export const db = drizzle(url, { schema });
