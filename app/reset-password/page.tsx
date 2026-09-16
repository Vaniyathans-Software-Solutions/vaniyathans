import ResetPasswordForm from './ResetPasswordForm';
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { email } = await searchParams;
  return <ResetPasswordForm initialEmail={typeof email === 'string' ? email : ''} />;
}
