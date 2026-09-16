import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./db/migrations",
  schemaFilter: ["vss"],
  // Schema generation is offline; the migrate script requires a direct URL.
  ...(process.env.DATABASE_URL_UNPOOLED ? { dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED } } : {}),
  strict: true,
});
