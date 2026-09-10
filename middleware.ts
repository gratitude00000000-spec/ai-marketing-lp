import { NextResponse, type NextRequest } from 'next/server';

/**
 * 旧ブログURL → 新slug の 1:1 恒久リダイレクト（308）。
 *
 * next.config.mjs の redirects() は middleware より前（ルーティング step 2）で実行され、
 * かつ未使用のクエリ文字列を転送先へ引き継いでしまう
 * （例: /blog/post.html?id=xxx → /blog/<slug>/?id=xxx）。
 * ここで NextResponse.redirect にクリーンな URL を渡し、308・クエリ除去・1ホップを保証する。
 *
 * cms/types.ts の LEGACY_SLUGS と対で維持すること。
 */
const LEGACY_ARTICLES: Record<string, string> = {
  qln47wv3gx: 'ai-era-seo-meo-guide',
  yk421h0dsqw: 'what-is-ai-marketing',
};

const redirect = (path: string, req: NextRequest) =>
  NextResponse.redirect(new URL(path, req.url), 308);

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const p = pathname.replace(/\/+$/, ''); // 末尾スラッシュを無視

  // 旧クエリ方式: /blog/post.html?id=xxx ・ /blog/post?id=xxx
  if (p === '/blog/post.html' || p === '/blog/post') {
    const slug = LEGACY_ARTICLES[searchParams.get('id') ?? ''];
    return redirect(slug ? `/blog/${slug}/` : '/blog/', req);
  }

  // 旧id方式: /blog/<id> ・ /blog/<id>/
  const m = p.match(/^\/blog\/([^/]+)$/);
  if (m && LEGACY_ARTICLES[m[1]]) {
    return redirect(`/blog/${LEGACY_ARTICLES[m[1]]}/`, req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/post', '/blog/post.html', '/blog/:path*'],
};
