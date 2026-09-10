import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CONTACT } from '@/lib/site';
import { organizationSchema, breadcrumbSchema, jsonLd } from '@/seo/jsonld';

export const metadata: Metadata = {
  title: '会社概要',
  description:
    '株式会社Gratitude（グラティテュード）の会社概要。AI集客・AIO・LLMO・MEO・GBP運用代行を全国・全業種に提供。',
  alternates: { canonical: '/about/' },
  openGraph: {
    title: '会社概要 | AI集客ドットコム',
    description:
      '株式会社Gratitude（グラティテュード）の会社概要。AI集客・AIO・LLMO・MEO・GBP運用代行を全国・全業種に提供。',
    url: '/about/',
    images: ['/ai-search-google-trend-.jpg'],
  },
};

const SERVICES = [
  {
    icon: '🤖',
    title: 'AI集客支援（AIO・LLMO・AEO）',
    desc: 'ChatGPT・Google AI検索に引用されるための情報設計・コンテンツ最適化',
  },
  {
    icon: '📍',
    title: 'Googleビジネスプロフィール運用代行',
    desc: '定期投稿・口コミ返信・GBP全体の最適化を代行',
  },
  {
    icon: '🌐',
    title: 'MEO対策・ローカル検索最適化',
    desc: 'Googleマップ上での上位表示・来店誘導の強化',
  },
  {
    icon: '🌍',
    title: '多言語対応・インバウンド集客',
    desc: '英語・中国語など多言語化でインバウンド需要を取り込む',
  },
  {
    icon: '🔗',
    title: 'プラットフォーム連携・シナジー創出',
    desc: 'GBP・SNS・食べログ等の連携で集客全体を最大化',
  },
  {
    icon: '💻',
    title: 'HP制作・SEO対策・保守管理',
    desc: '集客に強いWebサイト制作から運用・保守まで一括対応',
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        id="ld-about"
        {...jsonLd([
          organizationSchema(),
          breadcrumbSchema([
            { name: 'トップ', path: '/' },
            { name: '会社概要', path: '/about/' },
          ]),
        ])}
      />

      <SiteHeader active="/about/" />

      <main>
      <div className="page-hero">
        <div className="wrap">
          <span className="ey ey-w">株式会社Gratitude</span>
          <h1>会社概要</h1>
          <p>AI時代の集客支援を、全国・全業種に提供しています。</p>
        </div>
      </div>

      <section className="sec-72">
        <div className="wrap">
          <span className="ey ey-b">Company Profile</span>
          <h2 className="sec-h2">会社情報</h2>

          <table className="about-table">
            <tbody>
              <tr>
                <th>会社名</th>
                <td>株式会社Gratitude（グラティテュード）</td>
              </tr>
              <tr>
                <th>代表取締役</th>
                <td>諸見里 楓摩</td>
              </tr>
              <tr>
                <th>所在地</th>
                <td>
                  {CONTACT.address.zip}
                  <br />
                  {CONTACT.address.line}
                </td>
              </tr>
              <tr>
                <th>電話番号</th>
                <td>
                  <a href={CONTACT.telHref} style={{ fontWeight: 700 }}>
                    {CONTACT.tel}
                  </a>
                </td>
              </tr>
              <tr>
                <th>メール</th>
                <td>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </td>
              </tr>
              <tr>
                <th>公式サイト</th>
                <td>
                  <a href="https://gratitude-japan.com" target="_blank" rel="noopener noreferrer">
                    https://gratitude-japan.com
                  </a>
                </td>
              </tr>
              <tr>
                <th>事業内容</th>
                <td>
                  <ul>
                    <li>飲食事業・パーティー会場運営</li>
                    <li>グルメサイト運営</li>
                    <li>Webマーケティング（AI集客・SEO・MEO・GBP運用代行）</li>
                    <li>人材採用コンサルティング</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mission-box">
            <span className="ey ey-w">Mission</span>
            <h2>
              AI時代の集客を、
              <br />
              すべての事業者に届ける。
            </h2>
            <p>
              AIO・LLMO・AEO・MEOといった言葉は難しく聞こえますが、要は「AIに選ばれるお店・サービスになること」です。株式会社Gratitudeは、日々変わるAI時代の集客トレンドをわかりやすく、実務に落とし込める形で全国の事業者に届けます。
            </p>
          </div>

          <div style={{ marginTop: 56 }}>
            <span className="ey ey-b">Services</span>
            <h2 className="sec-h2">提供サービス</h2>
            <div className="svc-list">
              {SERVICES.map((s) => (
                <div className="svc-item" key={s.title}>
                  <div className="svc-icon" aria-hidden="true">
                    {s.icon}
                  </div>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cta-banner">
            <h3>まずはお気軽にご相談ください</h3>
            <p>業種・エリアを問わず全国対応。無料相談から始められます。</p>
            <Link href="/contact/">お問い合わせ・無料相談 →</Link>
          </div>
        </div>
      </section>

      </main>

      <SiteFooter />
    </>
  );
}
