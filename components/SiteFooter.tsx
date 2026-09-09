import Link from 'next/link';
import { SITE } from '@/lib/site';

const FOOTER_LINKS = [
  { label: 'サービス', href: '/#services' },
  { label: '料金プラン', href: '/#plans' },
  { label: 'よくある質問', href: '/#faq' },
  { label: 'ブログ', href: '/blog/' },
  { label: '会社概要', href: '/about/' },
  { label: 'お問い合わせ', href: '/contact/' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-nav">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <p>
          © {SITE.company} All Rights Reserved. |{' '}
          <a href={SITE.officialUrl} target="_blank" rel="noopener noreferrer">
            {SITE.company} 公式サイト
          </a>
        </p>
      </div>
    </footer>
  );
}
