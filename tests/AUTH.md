# Authentication verification

The application uses Neon Auth email/password accounts. Signup verifies the email
and links a mobile number with an SMS code before saving the client or workforce
profile. Mobile OTP sign-in then opens the same account. Existing profiles with
unverified contacts finish verification before entering the workspace.

The profile API checks the current Neon session, both verification flags, and an
exact match between the verified phone and the submitted phone. Profile writes
run in a transaction. Server-rendered pages use a read-only SDK adapter because
Next.js Server Components cannot update or clear session cookies.

Run `node tests/auth-flow.mjs` with a development server running on port 3000
(override with `AUTH_TEST_BASE_URL`). `.env.local` must contain `NEON_BRANCH=dev-*`
and `DATABASE_URL_UNPOOLED` with `sslmode=verify-full`. The server must use the
same branch's `NEON_AUTH_BASE_URL` and a `NEON_AUTH_COOKIE_SECRET` of at least 32
characters.

The integration suite creates disposable `example.invalid` users. It seeds
short-lived verification challenges only for those users to exercise Neon's real
verification and session endpoints without sending messages. Email challenges
use SHA-256/base64url hashes; phone challenges use the provider's OTP format.
All fixture users and challenges are removed in `finally`. Never run this test
against production.

Coverage includes both account types, verification requirements, phone linking,
mobile sign-in resolving the same identity, OTP replay rejection, profile
validation and isolation, idempotent saves, password recovery, logout, session
cookie lifetime, localized redirects, and revocation with cached session cookies.

Real delivery still needs a manual check: complete either signup with an inbox
and mobile number you control, enter both received codes, finish the profile,
sign out, and sign back in using Mobile OTP. Also request a password reset and
confirm the email arrives. No browser or SMS provider delivery is simulated by
the automated suite.

Validation commands: `npx tsc --noEmit`, ESLint on changed files, and
`npm run build -- --webpack` (the webpack option avoids the environment's
Turbopack worker-port restriction).
