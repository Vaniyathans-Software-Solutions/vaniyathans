'use client';
import ContactVerification from './ContactVerification';
import { useLocalizedRouter, useLocale } from './i18n/LocaleProvider';
import { authClient } from '@/lib/auth/client';
import { useState } from 'react';

export default function VerifyAccount({ email, phone }: { email: string; phone?: string }) {
  const router = useLocalizedRouter();
  const { t } = useLocale();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <main className="authPage"><section className="authPanel"><div className="authForm">
    <h1>{t('Verify your account')}</h1>
    <ContactVerification email={email} initialPhone={phone} onVerified={() => router.refresh()} />
    {error && <p className="authError" role="alert">{t(error)}</p>}
    <button type="button" disabled={busy} onClick={async () => {
      setBusy(true); setError('');
      try {
        const result = await authClient.signOut();
        if (result.error) { setError('Could not sign out. Please try again.'); return; }
        router.replace('/signin'); router.refresh();
      } catch { setError('Could not reach the server. Please try again.'); }
      finally { setBusy(false); }
    }}>{t('Sign out')}</button>
  </div></section></main>;
}
