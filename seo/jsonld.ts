import { SITE, CONTACT } from '@/lib/site';
import type { Faq } from '@/lib/site';

const abs = (path = '') => `${SITE.url}${path}`;

/**
 * 運営会社。株式会社Gratitude は来店型の営業所ではなく、全国対応の
 * Web集客支援サービスのため LocalBusiness ではなく Organization を使う。
 * 住所は E-E-A-T（実在性）のために記載するが、店舗営業時間や priceRange など
 * 来店型ビジネスの属性・根拠のない値は入れない。
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.company,
    alternateName: SITE.name,
    url: abs('/'),
    logo: abs('/images/logo.png'),
    email: CONTACT.email,
    telephone: CONTACT.tel,
    address: {
      '@type': 'PostalAddress',
      postalCode: CONTACT.address.zip.replace('〒', ''),
      addressCountry: 'JP',
      addressRegion: '沖縄県',
      addressLocality: '那覇市',
      streetAddress: '牧志2-18-4 パレットマキシ2-C',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: CONTACT.tel,
      email: CONTACT.email,
      areaServed: 'JP',
      availableLanguage: ['ja'],
    },
    areaServed: { '@type': 'Country', name: '日本' },
    sameAs: [SITE.officialUrl],
    description:
      'AI時代のSEO・MEO・AIO・LLMO対策、Googleビジネスプロフィール運用代行を全国・全業種に提供する株式会社Gratitude。',
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: abs('/'),
    inLanguage: 'ja',
    publisher: { '@type': 'Organization', name: SITE.company, url: abs('/') },
  };
}

/**
 * FAQ。Google の FAQ リッチリザルトは 2026年5月に一般サイト向けで終了しているため、
 * 検索結果での表示効果は想定しない。掲載目的は AI検索（AIO/LLMO）が Q&A を
 * 構造として理解しやすくすること。表示している FAQ 本文と 1:1 で一致させる。
 */
export function faqSchema(items: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function articleSchema(a: {
  title: string;
  description?: string;
  path: string;
  image?: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    ...(a.description ? { description: a.description } : {}),
    image: a.image ? [a.image] : [abs(SITE.ogImage)],
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    inLanguage: 'ja',
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(a.path) },
    author: { '@type': 'Organization', name: SITE.company, url: abs('/') },
    publisher: {
      '@type': 'Organization',
      name: SITE.company,
      logo: { '@type': 'ImageObject', url: abs('/images/logo.png') },
    },
  };
}

/** <script type="application/ld+json"> 用のヘルパー props */
export function jsonLd(data: unknown) {
  return {
    type: 'application/ld+json' as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
