import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';
import { readProfile } from '@/lib/auth/profile';
import { isLocale, localizePath } from '@/app/i18n/shared';
import SignupFlow from '@/app/signup/SignupFlow';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const value = (await headers()).get('x-site-locale');
  const locale = value && isLocale(value) ? value : 'en';
  const { data: session, error } = await getServerSession();
  if (error || !session?.user) redirect(localizePath('/signin', locale));
  if (await readProfile(session.user.id)) redirect(localizePath('/workspace', locale));
  const { type } = await searchParams;
  if (type === 'client' || type === 'workforce') {
    return <SignupFlow accountType={type} existingUser={{ name: session.user.name, email: session.user.email }} />;
  }
  return <main className="authPage"><section className="authPanel"><div className="authForm">
    <h1>Finish your account</h1><p>Your sign-in is ready. Choose your account type to complete your profile.</p>
    <Link className="authPrimary" href={localizePath('/onboarding?type=client', locale)}>Client account</Link>
    <Link className="authPrimary" href={localizePath('/onboarding?type=workforce', locale)}>Workforce account</Link>
  </div></section></main>;
}
