import Link from 'next/link';
import Image from 'next/image';
import { CONTACT } from '@/lib/site';
import { MobileNav } from './MobileNav';
import { HeaderCtas } from './HeaderCtas';

type Props = { active?: string };

const NAV_LINKS = [
  { label: 'サービス', href: '/#services' },
  { label: '料金プラン', href: '/#plans' },
  { label: 'よくある質問', href: '/#faq' },
  { label: 'ブログ', href: '/blog/' },
  { label: '会社概要', href: '/about/' },
  { label: 'お問い合わせ', href: '/contact/' },
];

export function SiteHeader({ active }: Props) {
  return (
    <>
      <header className="site-header">
        <div className="wrap hd-inner">
          <Link href="/" className="hd-logo" aria-label="AI集客ドットコム トップ">
            <span className="hd-logo-icon">
              <Image src="/images/logo.png" alt="AI集客ドットコム ロゴ" width={38} height={38} />
            </span>
            <span>
              <span className="hd-logo-name">AI集客ドットコム</span>
              <span className="hd-logo-sub" style={{ display: 'block' }}>
                by 株式会社Gratitude
              </span>
            </span>
          </Link>

          <nav className="hd-nav" aria-label="メインナビゲーション">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={active === l.href ? 'active' : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hd-cta">
            <HeaderCtas />
          </div>

          <MobileNav active={active} links={NAV_LINKS} tel={CONTACT.tel} telHref={CONTACT.telHref} />
        </div>
      </header>
    </>
  );
}
