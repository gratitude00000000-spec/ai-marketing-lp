import { SITE, CONTACT } from '@/lib/site';
import type { Faq } from '@/lib/site';

const abs = (path = '') => `${SITE.url}${path}`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.company,
    alternateName: SITE.name,
    url: abs('/'),
    logo: abs('/images/logo.png'),
    telephone: CONTACT.tel,
    email: CONTACT.email,
    address: {
      '@type': 'PostalAddress',
      postalCode: CONTACT.address.zip.replace('〒', ''),
      addressCountry: 'JP',
      addressRegion: '沖縄県',
      streetAddress: CONTACT.address.line,
    },
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

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    image: abs(SITE.ogImage),
    url: abs('/'),
    telephone: CONTACT.tel,
    email: CONTACT.email,
    priceRange: '¥¥',
    address: {
      '@type': 'PostalAddress',
      postalCode: CONTACT.address.zip.replace('〒', ''),
      addressCountry: 'JP',
      addressRegion: '沖縄県',
      addressLocality: '那覇市',
      streetAddress: '牧志2-18-4 パレットマキシ2-C',
    },
    areaServed: { '@type': 'Country', name: '日本' },
    parentOrganization: { '@type': 'Organization', name: SITE.company, url: SITE.officialUrl },
  };
}

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
    description: a.description,
    image: a.image ? [a.image] : [abs(SITE.ogImage)],
    datePublished: a.datePublished,
    dateModified: a.dateModified,
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
