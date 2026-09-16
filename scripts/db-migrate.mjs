import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createMigrationClient } from "./db-connection.mjs";

let client;
try {
  client = createMigrationClient();
  await client.connect();
  await client.query("SET lock_timeout = '5s'");
  const { rows } = await client.query("SELECT to_regclass('neon_auth.user') IS NOT NULL AS ready");
  if (!rows[0].ready) throw new Error("Enable Neon Auth on this branch before applying the application schema.");
  // Serializes migration runners; Drizzle records and applies each migration once.
  await client.query("SELECT pg_advisory_lock(746773210)");
  await migrate(drizzle(client), { migrationsFolder: "./db/migrations" });
  console.log("Auth application migrations applied successfully.");
} catch (error) {
  // Do not print driver errors or connection objects containing credentials.
  console.error("Migration failed:", error.code ?? "configuration/connection error", error.code ? "Check database permissions and migration SQL." : "Check the direct URL and Neon Auth setup.");
  process.exitCode = 1;
} finally {
  if (client) await client.end();
}
