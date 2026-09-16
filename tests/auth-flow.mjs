import assert from 'node:assert/strict';
import { randomUUID, randomBytes, createHash } from 'node:crypto';
import { createMigrationClient } from '../scripts/db-connection.mjs';

// Integration test against a running Next.js server and an explicit development branch.
// Creates only synthetic users, then removes those exact users in finally.
const base = process.env.AUTH_TEST_BASE_URL || 'http://localhost:3000';
const db = createMigrationClient();
if (!process.env.NEON_BRANCH?.startsWith('dev-')) throw new Error('Auth tests require NEON_BRANCH=dev-* in .env.local.');
const users = [];
const challenges = [];
async function challenge(identifier) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const id = randomUUID();
  challenges.push(id);
  await db.query(`INSERT INTO neon_auth.verification (id,identifier,value,"expiresAt","createdAt","updatedAt") VALUES ($1,$2,$3,now()+interval '5 minutes',now(),now())`, [id, identifier, `${identifier.includes('-otp-') ? createHash('sha256').update(code).digest('base64url') : code}:0`]);
  return code;
}
const prefix = randomUUID();
const password = `Test9${randomBytes(20).toString('hex')}`;
function client() {
  const jar = new Map();
  return async (path, body, options = {}) => {
    const response = await fetch(base + path, {
      method: body === undefined ? 'GET' : 'POST', redirect: 'manual',
      headers: { Origin: base, 'Content-Type': 'application/json', Cookie: [...jar].map(([k,v]) => `${k}=${v}`).join('; '), ...options.headers },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    for (const cookie of response.headers.getSetCookie()) {
      const pair = cookie.split(';')[0]; const index = pair.indexOf('=');
      jar.set(pair.slice(0,index), pair.slice(index+1));
    }
    return response;
  };
}
try {
  await db.connect();
  const anon = client();
  for (const [path, target] of [['/workspace','/signin'], ['/ta/workspace','/ta/signin'], ['/onboarding','/signin']]) {
    const r = await anon(path); assert.equal(r.status, 307, path); assert.equal(r.headers.get('location'), target);
  }
  assert.equal((await anon('/api/onboarding', {})).status, 401);
  assert.equal((await anon('/api/onboarding', {}, { headers: { Origin: 'https://evil.example' } })).status, 403);
  const phone = '+1555' + Date.now().toString().slice(-7);
  for (const [index, accountType] of ['client', 'workforce'].entries()) {
    const request = client();
    const email = `auth-test-${prefix}-${index}@example.invalid`;
    const signup = await request('/api/auth/sign-up/email', { name: `Auth test ${index}`, email, password });
    const signupBody = await signup.json();
    assert.equal(signup.status, 200, `signup: ${signupBody.code || signupBody.message || signup.status}`);
    assert.ok(signupBody.user?.id, 'signup returns user'); users.push(signupBody.user.id);
    const input = accountType === 'client'
      ? { accountType, phone, agreed: true, locale: 'en', company: `Company-${prefix}`, role: 'Founder', projectName: `Project-${prefix}`, epic: 'Test epic', outcome: 'Launch', users: 'Customers', timeline: '1 month', budget: 'Test budget' }
      : { accountType, phone, agreed: true, locale: 'ta', primaryRole: 'Engineer', experience: '3–5 years', skills: 'TypeScript', timezone: 'IST', location: 'India', availability: 'Full time', portfolio: 'https://example.com' };
    assert.ok([401, 403].includes((await request('/api/onboarding', input)).status), 'unverified contacts rejected');
    // Challenge fixtures test real provider verification without sending SMS/email.
    // Only isolated synthetic users and identifiers are ever seeded.
    const emailCode = await challenge(`email-verification-otp-${email}`);
    const verifyEmail = await request('/api/auth/email-otp/verify-email', { email, otp: emailCode });
    assert.equal(verifyEmail.status, 200, `email verification: ${JSON.stringify(await verifyEmail.json())}`);
    assert.equal((await request('/workspace')).headers.get('location'), '/onboarding');
    assert.equal((await request('/api/onboarding', { ...input, agreed: false })).status, 400);
    assert.equal((await request('/api/onboarding', { ...input, phone: 'abc' })).status, 400);
    assert.equal((await request('/api/onboarding', input)).status, 403, 'phone verification also required');
    if (accountType === 'workforce') input.phone = '+1556' + Date.now().toString().slice(-7);
    const phoneCode = await challenge(input.phone);
    const verifyPhone = await request('/api/auth/phone-number/verify', { phoneNumber: input.phone, code: phoneCode, updatePhoneNumber: true });
    assert.equal(verifyPhone.status, 200, `phone verification: ${JSON.stringify(await verifyPhone.json())}`);
    assert.equal((await request('/api/onboarding', { ...input, phone: '+15550000000', phoneVerifiedAt: new Date().toISOString() })).status, 403, 'cannot forge verified phone');
    const save = await request('/api/onboarding', { ...input, userId: users[0], phoneVerifiedAt: new Date().toISOString() });
    assert.equal(save.status, 200, `profile: ${JSON.stringify(await save.json())}`);
    assert.equal((await request('/api/onboarding', input)).status, 200, 'retry idempotent');
    const profile = await db.query('SELECT account_type, phone_verified_at FROM vss.account_profiles WHERE user_id=$1', [signupBody.user.id]);
    assert.equal(profile.rows[0].account_type, accountType);
    assert.ok(profile.rows[0].phone_verified_at, 'verified phone timestamp is saved by the server');
    const workspace = await request('/workspace'); assert.equal(workspace.status, 200);
    const html = await workspace.text(); assert.ok(html.includes(`Auth test ${index}`) || html.includes('Auth'), 'workspace renders authenticated identity');
    if (index === 1) assert.ok(!html.includes(`Company-${prefix}`), 'other user profile is not exposed');
    const cachedSession = await request('/api/auth/get-session'); assert.equal(cachedSession.status, 200);
    assert.equal((await request('/api/auth/sign-out', {})).status, 200);
    assert.equal((await request('/workspace')).status, 307, 'logout blocks workspace');
    const loginCode = await challenge(input.phone);
    const phoneLogin = await request('/api/auth/phone-number/verify', { phoneNumber: input.phone, code: loginCode });
    assert.equal(phoneLogin.status, 200, `mobile OTP login: ${JSON.stringify(await phoneLogin.json())}`);
    const phoneSession = await (await request('/api/auth/get-session')).json();
    assert.equal(phoneSession.user.id, signupBody.user.id, 'phone login resolves the same email account');
    await request('/api/auth/sign-out', {});
    assert.ok((await request('/api/auth/phone-number/verify', { phoneNumber: input.phone, code: loginCode })).status >= 400, 'OTP cannot be replayed');
    const wrong = await request('/api/auth/sign-in/email', { email, password: 'WrongPassword9' });
    assert.ok(wrong.status >= 400, 'wrong password rejected');
    const login = await request('/api/auth/sign-in/email', { email, password, rememberMe: false });
    assert.equal(login.status, 200, 'password sign-in succeeds');
    assert.ok(!login.headers.getSetCookie().some(value => value.includes('session_token=') && /Max-Age=/i.test(value)), 'rememberMe=false uses session cookie');
    const afterLogin = await request('/workspace'); assert.equal(afterLogin.status, 200);
    if (index === 0) {
      const recovery = client();
      const resetCode = await challenge(`forget-password-otp-${email}`);
      const nextPassword = `Reset9${randomBytes(20).toString('hex')}`;
      const reset = await recovery('/api/auth/email-otp/reset-password', { email, otp: resetCode, password: nextPassword });
      assert.equal(reset.status, 200, `password reset: ${JSON.stringify(await reset.json())}`);
      assert.ok((await recovery('/api/auth/email-otp/reset-password', { email, otp: resetCode, password })).status >= 400, 'reset OTP cannot be replayed');
      assert.ok((await recovery('/api/auth/sign-in/email', { email, password })).status >= 400, 'old password rejected after reset');
      assert.equal((await recovery('/api/auth/sign-in/email', { email, password: nextPassword })).status, 200, 'new password accepted');
    }
    await db.query('DELETE FROM neon_auth.session WHERE "userId"=$1', [signupBody.user.id]);
    assert.equal((await request('/workspace')).status, 307, 'revoked sessions rejected even with cached cookies');
  }
  const intakeCount = await db.query('SELECT count(*)::int AS count FROM vss.client_project_intakes WHERE user_id=$1', [users[0]]);
  assert.equal(intakeCount.rows[0].count, 1, 'retry does not duplicate intake');
  const invalidReset = await anon('/api/auth/email-otp/reset-password', { email: `auth-test-${prefix}-0@example.invalid`, otp: '000000', password });
  assert.ok(invalidReset.status >= 400, 'invalid reset code rejected');
  console.log('PASS: signup for both roles, email/phone verification, OTP sign-in and replay rejection, profile transactions, validation, identity isolation, localized guards, password checks, session cookies, logout, revocation, and invalid reset codes.');
} finally {
  for (const id of challenges) await db.query('DELETE FROM neon_auth.verification WHERE id=$1', [id]);
  for (const id of users) await db.query('DELETE FROM neon_auth."user" WHERE id=$1 AND email LIKE $2', [id, `auth-test-${prefix}-%@example.invalid`]);
  await db.end();
}
