import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getBlogList, cmsConfigured } from '@/lib/microcms';
import { blogSlug } from '@/cms/types';
import { breadcrumbSchema, jsonLd } from '@/seo/jsonld';

export const metadata: Metadata = {
  title: 'ブログ',
  description:
    'AI集客・AIO・LLMO・MEO・GBP運用代行に関する最新情報をお届けするブログ。株式会社Gratitudeが運営。',
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'ブログ | AI集客ドットコム',
    description:
      'AI集客・AIO・LLMO・MEO・GBP運用に関する最新情報をお届けするブログ。株式会社Gratitude運営。',
    url: '/blog/',
    images: ['/ai-search-google-trend-.jpg'],
  },
};

// microCMS が更新されたら再生成（ISR）
export const revalidate = 600;

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function BlogListPage() {
  const { contents } = await getBlogList({ orders: '-publishedAt', limit: 100 });

  return (
    <>
      <Script
        id="ld-blog"
        {...jsonLd(
          breadcrumbSchema([
            { name: 'トップ', path: '/' },
            { name: 'ブログ', path: '/blog/' },
          ]),
        )}
      />

      <SiteHeader active="/blog/" />

      <div className="page-hero">
        <div className="wrap">
          <span className="ey ey-w">AI集客ドットコム</span>
          <h1>ブログ</h1>
          <p>AI集客・AIO・LLMO・MEO・GBP運用に関する最新情報をお届けします。</p>
        </div>
      </div>

      <section className="sec-72">
        <div className="wrap">
          {contents.length === 0 ? (
            <div className="blog-empty">
              {cmsConfigured
                ? '📭 まだ記事がありません。'
                : '📝 ブログは準備中です。近日公開します。'}
            </div>
          ) : (
            <div className="blog-grid">
              {contents.map((b) => {
                const slug = blogSlug(b);
                return (
                  <Link href={`/blog/${slug}/`} className="blog-card" key={b.id}>
                    {b.eyecatch ? (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <img className="blog-thumb" src={b.eyecatch.url} alt={b.title} loading="lazy" />
                    ) : (
                      <div className="blog-thumb-ph" aria-hidden="true">
                        📝
                      </div>
                    )}
                    <div className="blog-body">
                      {b.category?.name && <span className="blog-cat">{b.category.name}</span>}
                      <h3>{b.title}</h3>
                      <div className="blog-date">📅 {formatDate(b.publishedAt)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
