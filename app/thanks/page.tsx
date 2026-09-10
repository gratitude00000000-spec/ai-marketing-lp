import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '送信完了',
  robots: { index: false, follow: false },
  alternates: { canonical: '/thanks/' },
};

export default function ThanksPage() {
  return (
    <main className="thanks-body">
      <div className="thanks-card">
        <div className="icon" aria-hidden="true">
          ✅
        </div>
        <h1>送信が完了しました</h1>
        <p>お問い合わせありがとうございます。</p>
        <p>
          通常2営業日以内に
          <br />
          ご入力いただいたメールアドレスへご返信いたします。
        </p>
        <Link className="thanks-back" href="/">
          トップページに戻る
        </Link>
      </div>
    </main>
  );
}
