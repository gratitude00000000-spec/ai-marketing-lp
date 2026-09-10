'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackFormSubmit } from '@/analytics/events';

const FORM_NAME = 'contact';

const PURPOSES = [
  { value: 'ai_interest', label: 'AIを活用した集客に興味がある' },
  { value: 'comparison', label: '他社サービスと比較・検討している' },
  { value: 'consultation', label: '自社に合うか相談・提案を受けたい' },
];

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');
}

export function ContactForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, string> = { 'form-name': FORM_NAME };
    fd.forEach((v, k) => {
      payload[k] = typeof v === 'string' ? v : '';
    });

    // ハニーポットが埋まっていたら送信しない（bot）
    if (payload['bot-field']) return;

    // 同意チェックは送信前の確認用。Netlify Forms へは送らない。
    delete payload['privacy-agree'];

    setSubmitting(true);
    try {
      // POST 先は静的HTML（public/__forms.html）。Next.js の SSR 関数が
      // ルートの POST を横取りすると Netlify Forms に届かないため、
      // Netlify のフォームハンドラが確実に処理する静的パスへ送る。
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackFormSubmit(FORM_NAME);
      router.push('/thanks/');
    } catch {
      setError('送信に失敗しました。お手数ですが、お電話またはLINEでお問い合わせください。');
      setSubmitting(false);
    }
  }

  return (
    <div className="form-card">
      <div className="form-card-title">まずはお気軽にご連絡ください</div>
      <p className="f-note" style={{ marginTop: 0, marginBottom: 20, lineHeight: 1.7 }}>
        ご入力内容は、お問い合わせ・ご相談への回答のために利用し、送信処理は Netlify Forms
        を通じて行われます。詳しくは{' '}
        <a
          href="/privacy/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#93c5fd', textDecoration: 'underline' }}
        >
          プライバシーポリシー
        </a>
        {' '}をご確認ください。
      </p>

      <form
        name={FORM_NAME}
        method="POST"
        action="/__forms.html"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
      >
        <input type="hidden" name="form-name" value={FORM_NAME} />
        {/* JS無効時のリダイレクト先（Netlify Forms が honor する） */}
        <input type="hidden" name="redirect" value="/thanks/" />
        <p hidden>
          <label>
            Do not fill this out: <input name="bot-field" />
          </label>
        </p>

        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="f-label">
            現在のご状況に近いものをお選びください<span className="f-req">必須</span>
          </legend>
          <div className="radio-group">
            {PURPOSES.map((p, i) => (
              <div className="radio-card" key={p.value}>
                <input
                  type="radio"
                  id={`purpose-${p.value}`}
                  name="purpose"
                  value={p.value}
                  required={i === 0}
                />
                <label htmlFor={`purpose-${p.value}`}>
                  <span className="radio-dot" />
                  {p.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="f-field">
          <label htmlFor="f-name" className="f-label">
            お名前<span className="f-req">必須</span>
          </label>
          <input id="f-name" type="text" name="name" required placeholder="山田 太郎" className="f-input" />
        </div>

        <div className="f-field">
          <label htmlFor="f-company" className="f-label">
            会社名・屋号
          </label>
          <input
            id="f-company"
            type="text"
            name="company"
            placeholder="株式会社〇〇 / 個人でも可"
            className="f-input"
          />
        </div>

        <div className="f-field">
          <label htmlFor="f-email" className="f-label">
            メールアドレス<span className="f-req">必須</span>
          </label>
          <input
            id="f-email"
            type="email"
            name="email"
            required
            placeholder="example@gmail.com"
            className="f-input"
          />
        </div>

        <div className="f-field">
          <label htmlFor="f-phone" className="f-label">
            電話番号
          </label>
          <input id="f-phone" type="tel" name="phone" placeholder="090-0000-0000" className="f-input" />
        </div>

        <div className="f-field">
          <label htmlFor="f-message" className="f-label">
            ご相談内容
          </label>
          <textarea
            id="f-message"
            name="message"
            rows={4}
            placeholder="お気軽にご記入ください"
            className="f-textarea"
          />
        </div>

        <div className="f-consent">
          <input type="checkbox" id="f-consent" name="privacy-agree" required />
          <label htmlFor="f-consent">
            <a
              href="/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#93c5fd', textDecoration: 'underline' }}
            >
              プライバシーポリシー
            </a>
            に同意して送信します
            <span className="f-req">必須</span>
          </label>
        </div>

        <button type="submit" className="f-submit" disabled={submitting}>
          {submitting ? '送信中…' : '無料相談を申し込む →'}
        </button>
        {error && (
          <p className="f-note" role="alert" style={{ color: '#fca5a5' }}>
            {error}
          </p>
        )}
        <p className="f-note">通常2営業日以内にご返信いたします。</p>
      </form>
    </div>
  );
}
