import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getAllBlogs, getBlogBySlug, cmsConfigured } from '@/lib/microcms';
import { blogSlug, blogHtml } from '@/cms/types';
import { SITE } from '@/lib/site';
import { articleSchema, breadcrumbSchema, jsonLd } from '@/seo/jsonld';

export const revalidate = 600;
export const dynamicParams = true;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  if (!cmsConfigured) return [];
  const contents = await getAllBlogs('id,slug,seo');
  return contents.map((b) => ({ slug: blogSlug(b) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: '記事が見つかりません', robots: { index: false } };

  const title = post.seo?.seoTitle || post.title;
  const description =
    post.seo?.metaDescription || post.description || `${post.title} | AI集客ドットコム`;
  const image = post.seo?.ogpImage?.url || post.eyecatch?.url || `${SITE.url}${SITE.ogImage}`;
  const path = `/blog/${blogSlug(post)}/`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: `${title} | AI集客ドットコム`,
      description: post.seo?.ogpDescription || description,
      url: path,
      images: [image],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | AI集客ドットコム`,
      description: post.seo?.ogpDescription || description,
      images: [image],
    },
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function BlogArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const html = blogHtml(post);
  const path = `/blog/${blogSlug(post)}/`;
  const image = post.seo?.ogpImage?.url || post.eyecatch?.url;

  return (
    <>
      <Script
        id="ld-article"
        {...jsonLd([
          articleSchema({
            // headline は画面の H1（post.title）と一致させる。SEO用の別タイトルは <title> のみ。
            title: post.title,
            description: post.seo?.metaDescription || post.description,
            path,
            image,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
          }),
          breadcrumbSchema([
            { name: 'トップ', path: '/' },
            { name: 'ブログ', path: '/blog/' },
            { name: post.title, path },
          ]),
        ])}
      />

      <SiteHeader active="/blog/" />

      <main>
      <div className="wrap breadcrumb">
        <Link href="/">トップ</Link>
        <span>›</span>
        <Link href="/blog/">ブログ</Link>
        <span>›</span>
        <span>{post.title}</span>
      </div>

      <div className="wrap">
        <article className="article-wrap">
          <Link href="/blog/" className="back-link">
            ← ブログ一覧に戻る
          </Link>
          {post.category?.name && <div className="article-cat">{post.category.name}</div>}
          <h1 className="article-title">{post.title}</h1>
          <div className="article-meta">
            <span>📅 {formatDate(post.publishedAt)}</span>
            {post.updatedAt !== post.publishedAt && (
              <span>🔄 更新: {formatDate(post.updatedAt)}</span>
            )}
          </div>
          {post.eyecatch && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img className="article-eyecatch" src={post.eyecatch.url} alt={post.title} />
          )}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="cta-banner">
            <h3>AI集客について、まずはご相談ください</h3>
            <p>
              AIO・LLMO・MEO対策、GBP運用代行まで、株式会社Gratitudeが全国対応でサポートします。
            </p>
            <Link href="/contact/">無料相談を申し込む →</Link>
          </div>
        </article>
      </div>

      </main>

      <SiteFooter />
    </>
  );
}
