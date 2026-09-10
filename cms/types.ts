/* microCMS 共通型（既存スキーマに合わせる） */

export type MicroCMSDate = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};

export type MicroCMSImage = {
  url: string;
  width?: number;
  height?: number;
};

export type Category = {
  id: string;
  name: string;
  slug?: string;
} & Partial<MicroCMSDate>;

/** microCMS 側の SEO フィールド（任意グループ） */
export type BlogSeo = {
  seoTitle?: string;
  metaDescription?: string;
  ogpDescription?: string;
  ogpImage?: MicroCMSImage;
  keywords?: string;
  slug?: string;
  /** 既存スキーマのスペル揺れ（"slug" ではなく "slag" で登録されている） */
  slag?: string;
};

/**
 * 移行対象の既存記事 → 確定 URL スラッグ（ユーザー承認済み）。
 * URL の恒久性を CMS フィールドの記入漏れに依存させないため、コード側を正とする。
 * next.config.mjs の LEGACY_ARTICLES と対で維持すること。
 */
export const LEGACY_SLUGS: Record<string, string> = {
  qln47wv3gx: 'ai-era-seo-meo-guide',
  yk421h0dsqw: 'what-is-ai-marketing',
};

export type Blog = {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  /** リッチエディタは content、テキストエリア運用時は body に入る場合がある */
  content?: string;
  body?: string;
  eyecatch?: MicroCMSImage;
  category?: Category;
  seo?: BlogSeo;
} & MicroCMSDate;

export type MicroCMSList<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

/** 記事の URL スラッグを決める（確定マップ → seo.slug → seo.slag → slug → id の順） */
export function blogSlug(b: Pick<Blog, 'id' | 'slug' | 'seo'>): string {
  return LEGACY_SLUGS[b.id] || b.seo?.slug || b.seo?.slag || b.slug || b.id;
}

/** 本文 HTML を取り出す */
export function blogHtml(b: Pick<Blog, 'content' | 'body'>): string {
  return b.content || b.body || '';
}
