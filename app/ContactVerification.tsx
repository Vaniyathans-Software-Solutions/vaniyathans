'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { phoneSchema } from '@/lib/auth/validation';
import { useLocale } from '@/app/i18n/LocaleProvider';

// This component only handles the challenge UI. The server checks Neon again
// before accepting a profile or rendering a workspace.
export default function ContactVerification({ email, initialPhone = '', onVerified }: {
  email: string; initialPhone?: string; onVerified: (phone: string) => void;
}) {
  const { t } = useLocale();
  const [phone, setPhone] = useState(initialPhone);
  const [code, setCode] = useState('');
  const [kind, setKind] = useState<'email' | 'phone'>('email');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retryAt, setRetryAt] = useState(0);

  async function send() {
    if (busy) return;
    if (Date.now() < retryAt) { setError('Please wait a minute before requesting another code.'); return; }
    setBusy(true); setError('');
    try {
      const { data: session } = await authClient.getSession({ query: { disableCookieCache: true } });
      const nextKind = session?.user.emailVerified ? 'phone' : 'email';
      setKind(nextKind);
      if (nextKind === 'phone') {
        const parsed = phoneSchema.safeParse(phone);
        if (!parsed.success) { setError('Enter a valid mobile number with country code.'); return; }
        if (session?.user.phoneNumberVerified && session.user.phoneNumber === parsed.data) { onVerified(parsed.data); return; }
        const result = await authClient.phoneNumber.sendOtp({ phoneNumber: parsed.data });
        if (result.error) { setError(result.error.message || 'Could not send the code. Please try again shortly.'); return; }
        setPhone(parsed.data);
      } else {
        const result = await authClient.emailOtp.sendVerificationOtp({ email, type: 'email-verification' });
        if (result.error) { setError('Could not send the email. Please try again shortly.'); return; }
      }
      setCode(''); setSent(true); setRetryAt(Date.now() + 60_000);
    } catch { setError('Could not reach the server. Please try again.'); }
    finally { setBusy(false); }
  }

  async function verify() {
    if (busy) return;
    if (!/^\d{6}$/.test(code)) { setError('Enter the six-digit verification code.'); return; }
    setBusy(true); setError('');
    try {
      const result = kind === 'email'
        ? await authClient.emailOtp.verifyEmail({ email, otp: code })
        : await authClient.phoneNumber.verify({ phoneNumber: phone, code, updatePhoneNumber: true });
      if (result.error) { setError(result.error.message || 'Invalid or expired verification code. Please try again.'); return; }
      setSent(false); setCode(''); setRetryAt(0);
      if (kind === 'email') setKind('phone');
      else onVerified(phone);
    } catch { setError('Could not reach the server. Please try again.'); }
    finally { setBusy(false); }
  }

  return <section className="authFields" aria-label={t('Verify your contact details')}>
    <p className="fieldWide">{t('Verify your email and mobile number to secure your account.')}</p>
    <p className="fieldWide">{email}</p>
    <label className="fieldWide"><span>{t('Mobile number')}</span><input type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={phone} disabled={busy || sent} onChange={e => setPhone(e.target.value)} /></label>
    {sent && <>
      <p className="fieldWide" role="status">{t(kind === 'email' ? 'Check your email for a verification code.' : 'Check your phone for a verification code.')}</p>
      <label className="fieldWide"><span>{t('Verification code')}</span><input className="otpInput" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} disabled={busy} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} /></label>
      <button className="authPrimary" type="button" disabled={busy} onClick={verify}>{t('Verify code')}</button>
      <button type="button" disabled={busy} onClick={() => { setSent(false); setCode(''); setError(''); }}>{t('Change details')}</button>
    </>}
    <button type="button" disabled={busy} onClick={send}>{t(busy ? 'Please wait…' : sent ? 'Resend code' : 'Send verification code')}</button>
    {error && <p className="authError fieldWide" role="alert">{t(error)}</p>}
  </section>;
}
