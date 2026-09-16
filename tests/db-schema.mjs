// Integration test: supply only an isolated branch URL through TEST_DATABASE_URL_UNPOOLED.
// All synthetic identities and profile writes are rolled back, including on failure.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import pg from "pg";

const connectionString = process.env.TEST_DATABASE_URL_UNPOOLED;
assert.ok(connectionString, "Set TEST_DATABASE_URL_UNPOOLED to an isolated branch URL");
const url = new URL(connectionString);
assert.ok(!url.hostname.includes("-pooler") && url.searchParams.get("sslmode") === "verify-full");
const db = new pg.Client({ connectionString, connectionTimeoutMillis: 15000, statement_timeout: 15000 });
try {
  await db.connect();
  await db.query("BEGIN");
  const clientId = randomUUID(), workforceId = randomUUID(), extraId = randomUUID();
  for (const id of [clientId, workforceId, extraId]) {
    // Synthetic identity fixture only; the application must use Neon Auth APIs for real users.
    await db.query('INSERT INTO neon_auth."user" (id,name,email,"emailVerified","createdAt","updatedAt") VALUES ($1,$2,$3,false,now(),now())', [id, "Schema test", `${id}@example.invalid`]);
  }
  const insertAccount = (id, type, phone) => db.query("INSERT INTO vss.account_profiles (user_id,account_type,phone,terms_accepted_at,terms_version) VALUES ($1,$2,$3,now(),'test-only')", [id, type, phone]);
  const rejected = async (code, callback) => {
    await db.query("SAVEPOINT invalid_input");
    try { await assert.rejects(callback, error => error.code === code); }
    finally { await db.query("ROLLBACK TO SAVEPOINT invalid_input"); }
  };
  // Unique random synthetic numbers avoid depending on branch data.
  const digits = BigInt(`0x${randomUUID().replaceAll("-", "").slice(0, 10)}`).toString().padStart(13, "0");
  const phone = `+1${digits}`;
  await insertAccount(clientId, "client", phone);
  await insertAccount(workforceId, "workforce", `+2${digits}`);
  await rejected("23505", () => insertAccount(extraId, "client", phone));
  await rejected("23514", () => insertAccount(extraId, "client", "98765 43210"));
  await rejected("23503", () => insertAccount(randomUUID(), "client", `+3${digits}`));
  await rejected("23502", () => db.query("INSERT INTO vss.account_profiles (user_id,account_type,phone,terms_version) VALUES ($1,'client',$2,'test-only')", [extraId, `+3${digits}`]));
  await db.query("INSERT INTO vss.client_profiles (user_id,company,company_role) VALUES ($1,'Test company','Founder')", [clientId]);
  await rejected("23503", () => db.query("INSERT INTO vss.client_profiles (user_id,company,company_role) VALUES ($1,'Test company','Founder')", [workforceId]));
  await db.query("INSERT INTO vss.client_project_intakes (user_id,project_name,epic,outcome,target_users,timeline,budget) VALUES ($1,'Test project','First epic','Launch','Customers','1 month','Test budget')", [clientId]);
  const workforceSql = "INSERT INTO vss.workforce_profiles (user_id,primary_role,experience,skills,timezone,location,availability,portfolio) VALUES ($1,'Engineer','3 years','TypeScript','Asia/Kolkata','India','Full time',$2)";
  await rejected("23514", () => db.query(workforceSql, [workforceId, "javascript:alert(1)"]));
  await rejected("23503", () => db.query(workforceSql, [clientId, null]));
  await db.query(workforceSql, [workforceId, "https://example.com/portfolio"]);
  const { rows } = await db.query("SELECT phone_verified_at FROM vss.account_profiles WHERE user_id = $1", [clientId]);
  assert.equal(rows[0].phone_verified_at, null, "Signup must not automatically verify a phone");
  // Test both identity deletion and profile deletion cascades.
  await db.query('DELETE FROM neon_auth."user" WHERE id = $1', [clientId]);
  for (const table of ["account_profiles", "client_profiles", "client_project_intakes"]) {
    const result = await db.query(`SELECT count(*)::int AS count FROM vss.${table} WHERE user_id = $1`, [clientId]);
    assert.equal(result.rows[0].count, 0);
  }
  await db.query("DELETE FROM vss.account_profiles WHERE user_id = $1", [workforceId]);
  assert.equal((await db.query("SELECT count(*)::int AS count FROM vss.workforce_profiles WHERE user_id = $1", [workforceId])).rows[0].count, 0);
  console.log("Passed: both signup profiles, unique phones, phone format, required consent, user references, account type isolation, portfolio URL, unverified phone default, and deletion cascades.");
} finally {
  await db.query("ROLLBACK").catch(() => {});
  await db.end();
}
