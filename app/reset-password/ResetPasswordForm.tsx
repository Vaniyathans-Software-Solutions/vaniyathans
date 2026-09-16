'use client';
import { useState, type FormEvent } from 'react';
import PasswordInput from "@/app/PasswordInput";
import { authClient } from '@/lib/auth/client';
import { passwordSchema } from '@/lib/auth/validation';
import { useLocale } from '@/app/i18n/LocaleProvider';
import Link from '@/app/i18n/LocalizedLink';
export default function ResetPasswordForm({ initialEmail }: { initialEmail: string }) {
  const { t } = useLocale();
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [notice, setNotice] = useState(initialEmail ? 'If this address is eligible, a reset code is on its way. Check your inbox and spam folder.' : '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!passwordSchema.safeParse(password).success) { setError('Use 8–128 characters with uppercase, lowercase, and a number.'); return; }
    if (password !== confirm) { setError('The passwords do not match.'); return; }
    setBusy(true); setError('');
    try {
      const { error } = await authClient.emailOtp.resetPassword({ email: email.trim(), otp, password });
      if (error) { setError('Invalid or expired reset code. Request a new code and try again.'); return; }
      setPassword(''); setConfirm(''); setDone(true);
    } catch { setError('Could not reach the server. Please try again.'); }
    finally { setBusy(false); }
  }
  async function resend() {
    if (busy || !/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Enter a valid email address.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const { error } = await authClient.emailOtp.requestPasswordReset({ email: email.trim() });
      if (error) { setError('Could not send the email. Please try again shortly.'); return; }
      setNotice('If this address is eligible, a reset code is on its way. Check your inbox and spam folder.');
    } catch { setError('Could not reach the server. Please try again.'); }
    finally { setBusy(false); }
  }
  return <main className="authPage"><section className="authPanel"><form className="authForm" onSubmit={submit}>
    <h1>{t('Reset your password')}</h1>
    {done ? <p role="status">{t('Your password has been updated. Sign in with your new password.')}</p> : <>
      {notice && <p role="status">{t(notice)}</p>}
      <div className="authFields">
        <label className="fieldWide"><span>{t('Email address')}</span><input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
        <label className="fieldWide"><span>{t('Email reset code')}</span><input inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={e => setOtp(e.target.value)} required /></label>
        <label className="fieldWide"><span>{t('Password')}</span><PasswordInput autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
        <label className="fieldWide"><span>{t('Confirm password')}</span><PasswordInput autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required /></label>
      </div>
      {error && <p className="authError" role="alert">{t(error)}</p>}
      <button type="button" disabled={busy} onClick={resend}>{t('Send reset code')}</button>
      <button className="authPrimary" disabled={busy}>{t(busy ? 'Saving…' : 'Reset password')}</button>
    </>}
    <Link href="/signin">{t('Sign in')}</Link>
  </form></section></main>;
}
