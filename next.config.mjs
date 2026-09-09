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
    return [
      // 旧ブログ記事URL（クエリ方式）→ ブログ一覧へ。
      // 個別記事の 1:1 リダイレクトは記事slug確定後に追記する。
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
