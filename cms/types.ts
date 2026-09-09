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
  slug?: string;
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

/** 記事の URL スラッグを決める（seo.slug → slug → id の順） */
export function blogSlug(b: Pick<Blog, 'id' | 'slug' | 'seo'>): string {
  return b.seo?.slug || b.slug || b.id;
}

/** 本文 HTML を取り出す */
export function blogHtml(b: Pick<Blog, 'content' | 'body'>): string {
  return b.content || b.body || '';
}
