'use client';

import { useState } from 'react';
import { CONTACT, LINE_OPTIONS } from '@/lib/site';
import { trackLineClick, trackPhoneClick, trackCTAClick } from '@/analytics/events';
import { PhoneIcon } from './icons';

export function LineConsultBox() {
  const [selected, setSelected] = useState<string | null>(null);

  const lineHref = selected
    ? `${CONTACT.lineOaMessage}${encodeURIComponent('【ご相談内容】' + selected)}`
    : CONTACT.lineUrl;

  return (
    <div className="cta-box">
      <div className="cta-box-title">まずはお気軽にご連絡ください</div>
      <p className="line-hint">現在のご状況に近いものをお選びください</p>

      <div className="line-opts">
        {LINE_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`line-opt${selected === opt ? ' selected' : ''}`}
            aria-pressed={selected === opt}
            onClick={() => {
              setSelected(opt);
              trackCTAClick('line_option', opt);
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="line-cta-wrap">
        <a
          href={lineHref}
          target="_blank"
          rel="noopener noreferrer"
          className="line-cta"
          onClick={() => trackLineClick(selected ? `home_cta_${selected}` : 'home_cta')}
        >
          LINEで相談する
        </a>
        {/* 本番の文言を保持。返信日数の表記ゆれ（他ページは2営業日）は次ラウンドで統一する */}
        <p className="line-cta-note">通常1営業日以内にご返信いたします。</p>
      </div>

      <div className="cta-or">
        <span>またはお電話でもどうぞ</span>
      </div>

      <a className="cta-phone" href={CONTACT.telHref} onClick={() => trackPhoneClick('home_cta')}>
        <PhoneIcon size={22} />
        {CONTACT.tel}
      </a>
    </div>
  );
}
