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

  // 旧ブログURL（/blog/post.html?id= ・ /blog/<id>）→ 新slug の 1:1 恒久リダイレクトは
  // middleware.ts で処理する。next.config の redirects() は step 2（middleware より前）で
  // 実行されるうえ未使用クエリを転送先へ引き継ぐため、ここでは扱わない。

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
