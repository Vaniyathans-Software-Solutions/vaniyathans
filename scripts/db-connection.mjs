import { config } from "dotenv";
import pg from "pg";

export function createMigrationClient() {
  config({ path: ".env.local", quiet: true });
  config({ path: ".env", quiet: true });
  const connectionString = process.env.DATABASE_URL_UNPOOLED;
  if (!connectionString) throw new Error("Set DATABASE_URL_UNPOOLED to the target branch's direct Postgres URL.");
  const url = new URL(connectionString);
  if (url.hostname.includes("-pooler")) throw new Error("Migrations require a direct connection, not a pooled URL.");
  if (url.searchParams.get("sslmode") !== "verify-full") throw new Error("Use sslmode=verify-full for the migration connection.");
  return new pg.Client({ connectionString, connectionTimeoutMillis: 15000, statement_timeout: 30000 });
}
