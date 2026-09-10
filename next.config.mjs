import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // 本番の既存URL（/about/ 等・末尾スラッシュあり）をそのまま維持
  trailingSlash: true,
  // 親ディレクトリの別 package-lock.json を誤検出しないよう明示
  outputFileTracingRoot: __dirname,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.microcms-assets.io' },
    ],
  },

  async redirects() {
    // 旧URL → 新slug の 1:1 恒久リダイレクト（Next.js の permanent:true は 308）。
    // 記事別リダイレクトを、下の一般転送（/blog/post.html → /blog/）より必ず先に評価する。
    const LEGACY_ARTICLES = [
      { id: 'qln47wv3gx', slug: 'ai-era-seo-meo-guide' },
      { id: 'yk421h0dsqw', slug: 'what-is-ai-marketing' },
    ];

    const articleRedirects = LEGACY_ARTICLES.flatMap(({ id, slug }) => [
      // 旧静的サイトのクエリ方式 URL。URL文字列にクエリを書かず has(type:'query') で判定。
      // 名前付きキャプチャ (?<id>...) で値を「消費」し、?id= を転送先へ残さない。
      {
        source: '/blog/post.html',
        has: [{ type: 'query', key: 'id', value: `(?<id>${id})` }],
        destination: `/blog/${slug}/`,
        permanent: true,
      },
      // 移行直後の id ベース URL（末尾スラッシュ有無の両方）
      { source: `/blog/${id}`, destination: `/blog/${slug}/`, permanent: true },
      { source: `/blog/${id}/`, destination: `/blog/${slug}/`, permanent: true },
    ]);

    return [
      ...articleRedirects,
      // 一般転送（個別に該当しない旧ブログURL）→ ブログ一覧へ。
      { source: '/blog/post.html', destination: '/blog/', permanent: true },
      { source: '/blog/post', destination: '/blog/', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
