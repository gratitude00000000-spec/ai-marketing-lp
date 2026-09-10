import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FaqAccordion } from '@/components/FaqAccordion';
import { LineConsultBox } from '@/components/LineConsultBox';
import { PLANS, HOME_FAQ } from '@/lib/site';
import { organizationSchema, webSiteSchema, faqSchema, jsonLd } from '@/seo/jsonld';

export const metadata: Metadata = {
  title: 'AI集客ドットコム | AI時代の集客支援・GBP運用代行・AIO/LLMO/AEO/MEO対策',
  description:
    '全国・全業種対応。最新AIを活用した集客支援、Googleビジネスプロフィール運用代行、AIO・LLMO・AEO・MEO対策、コンサルティングまで一括対応。株式会社Gratitudeが支援します。',
  alternates: { canonical: '/' },
};

const SERVICES = [
  {
    img: '/ai-search-google-trend-.jpg',
    title: '最新AIを活用した集客支援',
    desc: 'AIに選ばれる時代を見据え、AIO・LLMO・AEO・MEOまで考慮した集客導線を設計します。',
    points: ['最新トレンドを踏まえた改善提案', 'AI検索時代に合わせた情報設計', '継続的なコンサルティング対応'],
  },
  {
    img: '/googlebusinessprofile-meo-aio-.jpg',
    title: 'Googleビジネスプロフィール運用',
    desc: '投稿、口コミ返信、メニューやページ全体の編集など、日常運用をまとめてサポートします。',
    points: ['定期投稿による鮮度維持', '口コミ返信による信頼感向上', 'GBP全体の整備と最適化'],
  },
  {
    img: '/ai-synergy-global-.jpg',
    title: 'シナジー創出と多言語対応',
    desc: 'GBP単体ではなく、他プラットフォームとの連携や多言語化で、より広い接点づくりを支援します。',
    points: ['各媒体との連携による相乗効果', '多言語化による対応範囲の拡張', '投稿時の画像SEOも考慮'],
  },
];

const INDUSTRIES = [
  { img: '/14.jpg', title: '飲食店・カフェ・居酒屋', desc: 'Googleマップからの来店数・予約数を最大化' },
  { img: '/15.jpg', title: '美容・クリニック', desc: 'ローカル検索・AI検索で新規客を強化' },
  { img: '/16.jpg', title: 'ナイト・エンタメ・観光', desc: 'SNS連携・多言語対応でインバウンド集客を拡大' },
  { img: '/17.jpg', title: '整体・ジム', desc: 'リピート集客・新規獲得をAI時代の検索で強化' },
  { img: '/18.jpg', title: '小売・実店舗販売全般', desc: '来店数・購買につながる集客導線を整えます' },
  { img: '/19.jpg', title: 'その他・全業種対応', desc: 'エリア・業種を問わず全国対応。まずはご相談ください' },
];

export default function HomePage() {
  return (
    <>
      <script id="ld-org" {...jsonLd([organizationSchema(), webSiteSchema(), faqSchema(HOME_FAQ)])} />

      <SiteHeader active="/" />

      <main>
      {/* ═══ HERO ═══ */}
      <section className="hero" id="top">
        <div className="wrap hero-grid">
          <div className="hero-left-flex">
            <div className="hero-left-text">
              <div className="hero-logo-sm">
                <span className="hero-logo-icon">
                  <img src="/images/logo.png" alt="AI集客ドットコム ロゴ" />
                </span>
                <div>
                  <div className="hero-logo-text">AI集客ドットコム</div>
                  <div className="hero-logo-by">by 株式会社Gratitude</div>
                </div>
              </div>
              <span className="ey ey-w">全国・全業種対応 / AI時代の集客支援</span>
              <h1>
                <span className="nowrap">
                  <span className="ac">AI</span>に選ばれる時代の
                </span>
                <br />
                集客設計を、
                <br />
                <span className="nowrap">
                  <span className="brand">AI集客ドットコム</span>が
                </span>
                <br />
                支援します。
              </h1>
              <p className="lead">
                GoogleのAI検索（AIO）やChatGPT（LLMO）に引用される時代、ただ検索に出るだけでは集客できません。GBPの最適化はもちろん、AIO・LLMO・AEO・MEOまで見据えた情報設計で、「見つかり方」と「選ばれ方」を根本から整えます。
              </p>
              <div className="btn-row">
                <a
                  className="btn btn-line"
                  href="https://lin.ee/oJUbunU"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LINEで相談する
                </a>
                <a className="btn btn-gold" href="tel:0989755682">
                  電話で相談する
                </a>
              </div>
              <div className="hero-badges" />
            </div>
            <div className="hero-left-logo">
              <img src="/images/logo.png" alt="AI集客ドットコム" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <div className="stats-bar">
        <div className="wrap stats-inner">
          <div className="st-item">
            <div className="st-num">全国</div>
            <div className="st-txt">エリア・業種を問わず対応</div>
          </div>
          <div className="st-item">
            <div className="st-num">AI対応</div>
            <div className="st-txt">AIO / LLMO / AEO / MEO 総合支援</div>
          </div>
          <div className="st-item">
            <div className="st-num">継続率</div>
            <div className="st-txt">90%以上の高い継続率</div>
          </div>
          <div className="st-item">
            <div className="st-num">安心</div>
            <div className="st-txt">充実のサポート体制</div>
          </div>
        </div>
      </div>

      {/* ═══ SERVICES ═══ */}
      <section className="sec svc-section" id="services">
        <div className="wrap">
          <span className="ey ey-b">サービス内容</span>
          <h2 className="sec-h2">
            投稿代行ではなく、
            <br />
            <span className="accent">集客全体のシナジー</span>まで設計します。
          </h2>
          <p className="sec-lead">GBP運用、HP、SNS連携による相乗効果UPを支援。</p>
          <div className="svc-grid">
            {SERVICES.map((s) => (
              <div className="svc-card" key={s.title}>
                <div className="svc-img">
                  <img loading="lazy" src={s.img} alt={s.title} />
                </div>
                <div className="svc-body">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <ul className="ck">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INDUSTRIES ═══ */}
      <section className="sec" id="industries" style={{ background: '#fff' }}>
        <div className="wrap">
          <span className="ey ey-b">対応業種・利用シーン</span>
          <h2 className="sec-h2">
            飲食・美容・医療・ナイト業界など、
            <br />
            全業種に対応しています。
          </h2>
          <p className="sec-lead">
            AI検索・MEO対策は特定の業種だけのものではありません。どの業種でも集客に直結します。
          </p>
          <div className="ind-grid">
            {INDUSTRIES.map((ind) => (
              <div className="ind-card" key={ind.title}>
                <img loading="lazy" src={ind.img} alt={ind.title} />
                <div className="ind-ov" />
                <div className="ind-ct">
                  <h3>{ind.title}</h3>
                  <p>{ind.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section className="sec pricing-sec" id="plans">
        <div className="wrap">
          <span className="ey ey-b">料金プラン</span>
          <h2 className="sec-h2">事業フェーズに合わせて選べるプラン</h2>
          <p className="sec-lead">
            まずは運用を整えたい方から、AI時代を見据えて全体最適を進めたい方まで対応します。
          </p>
          <div className="plan-note">
            ※「月〇回投稿」とは、Googleビジネスプロフィールの最新情報・イベント更新など、日々の集客最適化のための更新回数です。
          </div>
          <div className="plans">
            {PLANS.map((plan) => (
              <div className={`plan${plan.featured ? ' feat' : ''}`} key={plan.name}>
                {plan.featured && <div className="plan-badge">おすすめ</div>}
                <div className="plan-ico">
                  <img loading="lazy" src={plan.icon} alt={plan.name} />
                </div>
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  {plan.price} {plan.priceSmall && <small>{plan.priceSmall}</small>}
                </div>
                <div className="plan-tax">{plan.tax ?? ' '}</div>
                <p className="plan-desc">{plan.desc}</p>
                <ul className="plan-feats">
                  {plan.feats.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="sec" id="faq" style={{ background: '#fff' }}>
        <div className="wrap">
          <span className="ey ey-b">Q&amp;A</span>
          <h2 className="sec-h2 tight">よくある質問</h2>
          <FaqAccordion items={HOME_FAQ} />
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="cta-sec" id="contact">
        <div className="wrap cta-grid">
          <div className="cta-left">
            <span className="ey ey-w">お問い合わせ</span>
            <h2>
              AIに選ばれる時代の集客を、
              <br />
              今のうちに整えませんか？
            </h2>
            <p>
              現在AIに選ばれる時代に突入しています。目まぐるしく変わるこの時代を追い続けるのは簡単ではありません。だからこそ、株式会社Gratitudeにお任せください。
            </p>
            <div className="trust-grid">
              <div className="trust-item">
                <div className="trust-ico">
                  <img loading="lazy" src="/11.jpg" alt="全国対応" />
                </div>
                <div className="trust-txt">全国対応</div>
              </div>
              <div className="trust-item">
                <div className="trust-ico">
                  <img loading="lazy" src="/12.jpg" alt="継続率" />
                </div>
                <div className="trust-txt">
                  継続率
                  <br />
                  90%以上
                </div>
              </div>
              <div className="trust-item">
                <div className="trust-ico">
                  <img loading="lazy" src="/13.jpg" alt="安心のサポート体制" />
                </div>
                <div className="trust-txt">
                  安心の
                  <br />
                  サポート体制
                </div>
              </div>
            </div>
          </div>

          <div>
            <LineConsultBox />
          </div>
        </div>
      </section>

      </main>

      <SiteFooter />
    </>
  );
}
