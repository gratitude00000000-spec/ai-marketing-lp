import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllBlogs, cmsConfigured } from '@/lib/microcms';
import { blogSlug } from '@/cms/types';

export const revalidate = 600;

/**
 * 静的ページは lastModified を出さない。
 * ビルド／再デプロイのたびに日付が動くと「更新していないのに更新扱い」になるため、
 * 正確な重要更新日を継続管理できるようになるまで省略する。
 * changefreq / priority も Google は使用しないため付けない。
 * ブログ記事だけ、microCMS の updatedAt を lastModified に使う。
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/` },
    { url: `${SITE.url}/about/` },
    { url: `${SITE.url}/blog/` },
    { url: `${SITE.url}/contact/` },
    { url: `${SITE.url}/privacy/` },
  ];

  if (!cmsConfigured) return staticPages;

  const contents = await getAllBlogs('id,slug,seo,updatedAt');

  const blogPages: MetadataRoute.Sitemap = contents.map((b) => ({
    url: `${SITE.url}/blog/${blogSlug(b)}/`,
    lastModified: new Date(b.updatedAt),
  }));

  return [...staticPages, ...blogPages];
}
