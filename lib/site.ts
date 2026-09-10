/* ============================================================
   サイト共通データ
   （確定済みの情報のみ。未確定の料金・プラン内容は追加しない）
   ============================================================ */

export const SITE = {
  name: 'AI集客ドットコム',
  company: '株式会社Gratitude',
  companyKana: 'グラティテュード',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-marketing-japan.jp',
  officialUrl: 'https://gratitude-japan.com',
  description:
    '全国・全業種対応。最新AIを活用した集客支援、Googleビジネスプロフィール運用代行、AIO・LLMO・AEO・MEO対策、コンサルティングまで一括対応。株式会社Gratitudeが支援します。',
  ogImage: '/ogp_meo.png',
} as const;

export const CONTACT = {
  tel: '098-975-5682',
  telHref: 'tel:0989755682',
  telHours: '平日 10:00〜18:00',
  email: 'gratitude00000000@gmail.com',
  replyTime: '通常2営業日以内にご返信いたします。',
  address: {
    zip: '〒900-0013',
    line: '沖縄県那覇市牧志2-18-4 パレットマキシ2-C',
  },
  lineUrl: 'https://lin.ee/oJUbunU',
  lineOaMessage: 'https://line.me/R/oaMessage/@681dddkj/?',
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: 'サービス', href: '/#services' },
  { label: '料金プラン', href: '/#plans' },
  { label: 'よくある質問', href: '/#faq' },
  { label: 'ブログ', href: '/blog/' },
  { label: '会社概要', href: '/about/' },
  { label: 'お問い合わせ', href: '/contact/' },
];

/* トップページ 料金プラン
   確定事項：
   - Proプランは「今は不要」→ 掲載しない（お試し／スタンダードのみ）
   - 「月X回投稿」は残す／「月X回まで編集・修正可能」の行は削除
   - グロースプラン ¥39,800 は提供終了 → どこにも出さない
   ※ Web集客セットプランの正式料金は未確定のため掲載しない
*/
export type Plan = {
  name: string;
  price: string;
  priceSmall?: string;
  tax?: string;
  desc: string;
  feats: string[];
  featured?: boolean;
  icon: string;
};

export const PLANS: Plan[] = [
  {
    name: 'お試しプラン',
    price: '¥14,980',
    priceSmall: '/ 月',
    tax: '税込 ¥16,478',
    desc: 'まずは基本運用を整えたい方向けのスタートプラン。',
    feats: ['月3回投稿', 'メニュー・GBP全体の編集対応', '口コミ返信'],
    icon: '/plan-a-.jpg',
  },
  {
    name: 'スタンダードプラン',
    price: '¥19,800',
    priceSmall: '/ 月',
    tax: '税込 ¥21,780',
    desc: '運用だけでなく、全体的なシナジー創出まで見据えた主力プラン。',
    feats: [
      '月4回投稿',
      '口コミ返信',
      'GBPと他プラットフォームによる全体シナジー創出',
      'コンサルティング対応',
      '多言語化',
      '投稿時の画像SEO',
    ],
    featured: true,
    icon: '/plan-b.jpg',
  },
];

export type Faq = { q: string; a: string };

/* 本番の6問から「費用感はどのくらいですか？」を削除（回答が旧グロースプラン¥39,800を
   含んでおり、確定情報ではないため）。残り5問は本番の文言を変更せず移植。 */
export const HOME_FAQ: Faq[] = [
  {
    q: 'AI検索対策（AIO・LLMO）とは何ですか？',
    a: 'AIO（AI Overview）やLLMO（Large Language Model Optimization）とは、ChatGPTやGoogleのAI検索に自社情報を引用・表示させるための最適化です。従来のSEOと組み合わせることで、AI時代の集客に対応できます。',
  },
  {
    q: 'SEOとAIOの違いは何ですか？',
    a: 'SEOはGoogleの検索結果ページへの表示最適化ですが、AIOはAIが生成する回答に自社情報を引用させる最適化です。AI集客ドットコムではSEO・AIO・LLMO・MEOを組み合わせた総合的な集客設計を行います。',
  },
  {
    q: 'どの業種・エリアに対応していますか？',
    a: '全国・全業種に対応しています。飲食店・美容サロン・クリニック・士業・ナイト業界・小売店など、業種やエリアを問わずご支援可能です。',
  },
  {
    q: 'GBP（Googleビジネスプロフィール）の運用代行だけお願いできますか？',
    a: 'はい、Googleビジネスプロフィールの最適化・運用代行のみのご依頼も承っています。ご状況に合わせて最適なプランをご提案します。',
  },
  {
    q: 'AIO・LLMO・AEO・MEOの違いがよく分かりません。',
    a: '問題ありません。AI時代の集客に必要な考え方を丁寧に整理しながら、実務に落とし込める形でサポートします。専門知識がなくてもご安心ください。',
  },
];

export const LINE_OPTIONS = [
  'AIを活用した集客に興味がある',
  '他社サービスと比較・検討している',
  '自社に合うか相談・提案を受けたい',
  '料金プランについて詳しく聞きたい',
];
