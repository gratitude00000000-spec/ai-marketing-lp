import 'server-only';
import { createClient } from 'microcms-js-sdk';
import type { Blog, Category, MicroCMSList } from '@/cms/types';

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

/** 記事一覧。未設定・失敗時は空リストを返す（ページは落とさない） */
export async function getBlogList(
  queries?: ListQuery,
): Promise<MicroCMSList<Blog>> {
  if (!client) return EMPTY_LIST<Blog>();
  try {
    return await client.getList<Blog>({ endpoint: BLOG_ENDPOINT, queries });
  } catch (e) {
    console.error('[microcms] getBlogList failed:', e);
    return EMPTY_LIST<Blog>();
  }
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
 * slug から記事を引く。
 * seo.slug / slug フィールドで絞り込み、無ければ id 直引きにフォールバック。
 */
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!client) return null;
  try {
    for (const field of ['seo.slug', 'slug']) {
      const res = await client
        .getList<Blog>({
          endpoint: BLOG_ENDPOINT,
          queries: { filters: `${field}[equals]${slug}`, limit: 1 },
        })
        .catch(() => null);
      if (res && res.contents.length > 0) return res.contents[0];
    }
  } catch (e) {
    console.error(`[microcms] getBlogBySlug(${slug}) query failed:`, e);
  }
  return getBlogById(slug);
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
