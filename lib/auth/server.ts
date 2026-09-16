import 'server-only';
import { createNeonAuth } from '@neondatabase/auth/next/server';
import { createAuthServer, extractNeonAuthCookies } from '@neondatabase/auth/server';
import { headers } from 'next/headers';

let instance: ReturnType<typeof createNeonAuth> | undefined;
export function getAuth() {
  if (!instance) {
    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    const secret = process.env.NEON_AUTH_COOKIE_SECRET;
    if (!baseUrl || !secret) throw new Error('Neon Auth environment is not configured.');
    instance = createNeonAuth({ baseUrl, cookies: { secret, sessionDataTtl: 60 } });
  }
  return instance;
}

// Server Components cannot write cookies. Read fresh provider state through a
// read-only adapter; sign-in, refresh, and logout cookies use the API handler.
export async function getServerSession() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const secret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !secret) throw new Error('Neon Auth environment is not configured.');
  const reader = createAuthServer({ baseUrl, cookieSecret: secret, context: async () => {
    const incoming = await headers();
    return {
      getCookies: () => extractNeonAuthCookies(incoming),
      setCookie: () => {},
      getHeader: name => incoming.get(name),
      getOrigin: () => incoming.get('origin') ?? '',
      getFramework: () => 'nextjs',
    };
  } });
  return reader.getSession({ query: { disableCookieCache: 'true' } });
}
