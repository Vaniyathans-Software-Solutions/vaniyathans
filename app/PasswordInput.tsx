'use client';

import { useId, useState, type ComponentProps } from 'react';
import { useLocale } from './i18n/LocaleProvider';

export default function PasswordInput({ id, disabled, ...props }: Omit<ComponentProps<'input'>, 'type'>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  const { t } = useLocale();
  const action = t(visible ? 'Hide password' : 'Show password');

  return <span className="passwordInput">
    <input {...props} id={inputId} disabled={disabled} type={visible ? 'text' : 'password'} />
    <button className="passwordToggle" type="button" disabled={disabled} aria-label={action} title={action} aria-controls={inputId} onClick={() => setVisible(current => !current)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
        {visible && <path d="m3 3 18 18" />}
      </svg>
    </button>
  </span>;
}
