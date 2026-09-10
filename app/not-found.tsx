import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main>
      <section className="sec-72">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 560 }}>
          <span className="ey ey-b">404</span>
          <h1 className="sec-h2">ページが見つかりません</h1>
          <p className="sec-lead" style={{ margin: '0 auto 24px' }}>
            お探しのページは移動または削除された可能性があります。
          </p>
          <Link className="btn btn-primary" href="/">
            トップページへ
          </Link>
        </div>
      </section>
      </main>

      <SiteFooter />
    </>
  );
}
