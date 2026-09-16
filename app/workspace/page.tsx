import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/server';
import { readProfile } from '@/lib/auth/profile';
import { isLocale, localizePath } from '@/app/i18n/shared';
import WorkspaceStudio from './WorkspaceStudio';
import VerifyAccount from '@/app/VerifyAccount';
export const dynamic = 'force-dynamic';
export default async function WorkspacePage() {
  const value = (await headers()).get('x-site-locale');
  const locale = value && isLocale(value) ? value : 'en';
  const { data: session, error } = await getServerSession();
  if (error || !session?.user) redirect(localizePath('/signin', locale));
  const profile = await readProfile(session.user.id);
  if (!profile) redirect(localizePath('/onboarding', locale));
  if (!session.user.emailVerified || !session.user.phoneNumberVerified) {
    return <VerifyAccount email={session.user.email} phone={profile.phone} />;
  }
  return <WorkspaceStudio profile={{ ...profile, fullName: session.user.name, email: session.user.email }} />;
}
