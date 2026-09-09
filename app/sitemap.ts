import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { getAllBlogs, cmsConfigured } from '@/lib/microcms';
import { blogSlug } from '@/cms/types';

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE.url}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  if (!cmsConfigured) return staticPages;

  const contents = await getAllBlogs('id,slug,seo,updatedAt');

  const blogPages: MetadataRoute.Sitemap = contents.map((b) => ({
    url: `${SITE.url}/blog/${blogSlug(b)}/`,
    lastModified: new Date(b.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
