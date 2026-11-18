import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Same root .env as the app (see next.config.ts).
if (existsSync("../../.env")) process.loadEnvFile("../../.env");

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dbCredentials: { url: process.env.NEON_DB_URL ?? "" },
});
