import { NextResponse, type NextRequest } from 'next/server';

/**
 * 旧ブログURL → 新slug の 1:1 恒久リダイレクト。
 *
 * next.config.mjs の redirects() は未使用のクエリ文字列を転送先へ引き継いでしまう
 * （例: /blog/post.html?id=xxx → /blog/<slug>/?id=xxx）。ここで NextResponse.redirect に
 * クリーンな URL を渡すことで、308・クエリ除去・1ホップを保証する。
 *
 * cms/types.ts の LEGACY_SLUGS と対で維持すること。
 */
const LEGACY_ARTICLES: Record<string, string> = {
  qln47wv3gx: 'ai-era-seo-meo-guide',
  yk421h0dsqw: 'what-is-ai-marketing',
};

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 旧クエリ方式: /blog/post.html?id=xxx / /blog/post?id=xxx
  if (pathname === '/blog/post.html' || pathname === '/blog/post') {
    const id = searchParams.get('id') ?? '';
    const slug = LEGACY_ARTICLES[id];
    return NextResponse.redirect(new URL(slug ? `/blog/${slug}/` : '/blog/', req.url), 308);
  }

  // 旧id方式: /blog/<id> または /blog/<id>/
  const m = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (m && LEGACY_ARTICLES[m[1]]) {
    return NextResponse.redirect(new URL(`/blog/${LEGACY_ARTICLES[m[1]]}/`, req.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/post', '/blog/post.html', '/blog/:path*'],
};
