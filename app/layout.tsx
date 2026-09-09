import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GA4 } from '@/analytics/GA4';
import { SITE } from '@/lib/site';

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@700;800&family=Noto+Sans+JP:wght@400;700&display=swap';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'AI集客ドットコム | AI時代の集客支援・GBP運用代行・AIO/LLMO/AEO/MEO対策',
    template: '%s | AI集客ドットコム',
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.company }],
  creator: SITE.company,
  publisher: SITE.company,
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: SITE.url,
    siteName: SITE.name,
    title: 'AI集客ドットコム｜AI時代のSEO・MEO・AIO・LLMO対策',
    description:
      'AI検索・Google検索で選ばれる時代へ。AIO・LLMO・MEO・GBP運用代行まで、最新の集客設計を一括支援。',
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI集客ドットコム｜AI時代の集客支援',
    description: 'SEO・MEO・AIO・LLMO対策でAIに選ばれる集客へ。株式会社Gratitudeが支援します。',
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d1f3c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_HREF} />
        <GA4 />
      </head>
      <body>{children}</body>
    </html>
  );
}
