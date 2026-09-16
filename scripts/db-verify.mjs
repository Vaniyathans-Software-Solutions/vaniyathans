import assert from "node:assert/strict";
import { createMigrationClient } from "./db-connection.mjs";

const expected = ["account_profiles", "client_profiles", "client_project_intakes", "workforce_profiles"];
let client;
try {
  client = createMigrationClient();
  await client.connect();
  const { rows } = await client.query(`
    SELECT c.relname AS name, c.relrowsecurity AS rls,
      (SELECT count(*)::int FROM pg_constraint k WHERE k.conrelid = c.oid AND k.contype = 'f') AS foreign_keys
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'vss' AND c.relkind = 'r' ORDER BY c.relname
  `);
  assert.deepEqual(rows.map(row => row.name), expected);
  for (const row of rows) {
    assert.equal(row.rls, true, `${row.name}: row-level security`);
    assert.equal(row.foreign_keys, 1, `${row.name}: parent reference`);
  }
  const policies = await client.query("SELECT count(*)::int AS count FROM pg_policies WHERE schemaname = 'vss'");
  assert.equal(policies.rows[0].count, 0, "Initial tables must not expose client access policies");
  const auth = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'neon_auth' AND table_name IN ('user','account','session','verification') ORDER BY table_name");
  assert.deepEqual(auth.rows.map(row => row.table_name), ["account", "session", "user", "verification"]);
  console.table(rows);
  console.log("Verified application tables, RLS, foreign keys, and existing Neon Auth tables.");
} catch (error) {
  console.error("Database verification failed:", error.code ?? "configuration/connection error");
  process.exitCode = 1;
} finally {
  if (client) await client.end();
}
