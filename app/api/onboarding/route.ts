import { getAuth } from '@/lib/auth/server';
import { onboardingSchema } from '@/lib/auth/validation';
import { saveProfile } from '@/lib/auth/profile';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return Response.json({ error: 'Invalid request origin.' }, { status: 403 });
  }
  try {
    const { data: session, error } = await getAuth().getSession({ query: { disableCookieCache: "true" } });
    if (error || !session?.user) return Response.json({ error: 'Please sign in to finish your account.' }, { status: 401 });
    const body = await request.text();
    if (body.length > 20_000) return Response.json({ error: 'Profile is too large.' }, { status: 413 });
    let json: unknown;
    try { json = JSON.parse(body); } catch { return Response.json({ error: 'Invalid profile.' }, { status: 400 }); }
    const parsed = onboardingSchema.safeParse(json);
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
    if (!session.user.emailVerified || !session.user.phoneNumberVerified || session.user.phoneNumber !== parsed.data.phone) {
      return Response.json({ error: 'Verify your email and this mobile number before finishing your profile.' }, { status: 403 });
    }
    await saveProfile(session.user.id, parsed.data);
    return Response.json({ ok: true });
  } catch (error) {
    const cause = error instanceof Error && error.cause ? error.cause : error;
    if (typeof cause === 'object' && cause !== null && 'code' in cause && cause.code === '23505') {
      return Response.json({ error: 'This mobile number is already in use. Use another number or contact support.' }, { status: 409 });
    }
    return Response.json({ error: 'Could not save your profile. Your sign-in is retained; please try again.' }, { status: 503 });
  }
}
