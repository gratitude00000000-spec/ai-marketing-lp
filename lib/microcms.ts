import 'server-only';
import { createClient } from 'microcms-js-sdk';
import type { Blog, Category, MicroCMSList } from '@/cms/types';
import { LEGACY_SLUGS, blogSlug } from '@/cms/types';

/* ============================================================
   microCMS クライアント（サーバー専用）
   - APIキーは MICROCMS_API_KEY（NEXT_PUBLIC_ を付けない）
   - 'server-only' により誤ってクライアントバンドルに入るとビルドエラーになる
   - 環境変数が未設定でも throw せず null を返す（ブログは「準備中」表示）
   ============================================================ */

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

export const BLOG_ENDPOINT = process.env.MICROCMS_BLOG_ENDPOINT || 'blogs';
export const CATEGORY_ENDPOINT = process.env.MICROCMS_CATEGORY_ENDPOINT || 'categories';

export const cmsConfigured = Boolean(serviceDomain && apiKey);

const client =
  serviceDomain && apiKey ? createClient({ serviceDomain, apiKey }) : null;

type ListQuery = {
  limit?: number;
  offset?: number;
  orders?: string;
  fields?: string;
  filters?: string;
  q?: string;
};

const EMPTY_LIST = <T,>(): MicroCMSList<T> => ({
  contents: [],
  totalCount: 0,
  offset: 0,
  limit: 0,
});

/** microCMS の limit 上限 */
const MAX_LIMIT = 100;

/** 記事一覧（1ページ）。未設定・失敗時は空リストを返す（ページは落とさない） */
export async function getBlogList(
  queries?: ListQuery,
): Promise<MicroCMSList<Blog>> {
  if (!client) return EMPTY_LIST<Blog>();
  try {
    const limit = Math.min(queries?.limit ?? MAX_LIMIT, MAX_LIMIT);
    return await client.getList<Blog>({
      endpoint: BLOG_ENDPOINT,
      queries: { ...queries, limit },
    });
  } catch (e) {
    console.error('[microcms] getBlogList failed:', e);
    return EMPTY_LIST<Blog>();
  }
}

/** 全記事をページングして取得（sitemap / generateStaticParams 用） */
export async function getAllBlogs(fields?: string): Promise<Blog[]> {
  if (!client) return [];
  const out: Blog[] = [];
  try {
    for (let offset = 0; offset < 5000; offset += MAX_LIMIT) {
      const res = await client.getList<Blog>({
        endpoint: BLOG_ENDPOINT,
        queries: { limit: MAX_LIMIT, offset, orders: '-publishedAt', fields },
      });
      out.push(...res.contents);
      if (offset + MAX_LIMIT >= res.totalCount) break;
    }
  } catch (e) {
    console.error('[microcms] getAllBlogs failed:', e);
  }
  return out;
}

/** 記事詳細。未設定・失敗時は null */
export async function getBlogById(contentId: string): Promise<Blog | null> {
  if (!client) return null;
  try {
    return await client.getListDetail<Blog>({
      endpoint: BLOG_ENDPOINT,
      contentId,
    });
  } catch (e) {
    console.error(`[microcms] getBlogById(${contentId}) failed:`, e);
    return null;
  }
}

/**
 * URL スラッグから記事を引く。正規スラッグ（blogSlug()）に一致する記事だけを返す。
 * 非正規のスラッグ／生 id でのアクセスは null（= 404 or リダイレクト）とし、重複URLを防ぐ。
 */
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!client) return null;

  const canonical = (post: Blog | null): Blog | null =>
    post && blogSlug(post) === slug ? post : null;

  // 確定スラッグ（コード側が正）は id 直引きへ
  const legacyId = Object.keys(LEGACY_SLUGS).find((id) => LEGACY_SLUGS[id] === slug);
  if (legacyId) {
    const hit = canonical(await getBlogById(legacyId));
    if (hit) return hit;
  }

  try {
    for (const field of ['seo.slug', 'seo.slag', 'slug']) {
      const res = await client
        .getList<Blog>({
          endpoint: BLOG_ENDPOINT,
          queries: { filters: `${field}[equals]${slug}`, limit: 1 },
        })
        .catch(() => null);
      const hit = res && res.contents.length > 0 ? canonical(res.contents[0]) : null;
      if (hit) return hit;
    }
  } catch (e) {
    console.error(`[microcms] getBlogBySlug(${slug}) query failed:`, e);
  }
  return canonical(await getBlogById(slug));
}

export async function getCategoryList(): Promise<MicroCMSList<Category>> {
  if (!client) return EMPTY_LIST<Category>();
  try {
    return await client.getList<Category>({
      endpoint: CATEGORY_ENDPOINT,
      queries: { limit: 100 },
    });
  } catch (e) {
    console.error('[microcms] getCategoryList failed:', e);
    return EMPTY_LIST<Category>();
  }
}
