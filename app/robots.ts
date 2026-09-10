import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /_next/ はブロックしない（Google のレンダリングに必要な CSS/JS が含まれる）。
        // /thanks/ もブロックしない（ページ内 noindex を Google がクロールして確認できるようにする）。
        // /api/ は公開 API を持たないが、将来の追加に備えて残す。
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
