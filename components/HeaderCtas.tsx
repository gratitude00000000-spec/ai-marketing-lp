'use client';

import { CONTACT } from '@/lib/site';
import { trackLineClick, trackPhoneClick } from '@/analytics/events';

export function HeaderCtas() {
  return (
    <>
      <a
        className="btn btn-sm btn-line"
        href={CONTACT.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackLineClick('header')}
      >
        LINEで相談する
      </a>
      <a
        className="btn btn-gold btn-sm"
        href={CONTACT.telHref}
        onClick={() => trackPhoneClick('header')}
      >
        📞 {CONTACT.tel}
      </a>
    </>
  );
}
