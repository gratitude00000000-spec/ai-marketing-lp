import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CONTACT, SITE } from '@/lib/site';
import { breadcrumbSchema, organizationSchema, jsonLd } from '@/seo/jsonld';

/** 制定・最終改定日（内容を実際に見直したときだけ更新する） */
const POLICY_DATE = '2026年9月10日';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description:
    '株式会社Gratitude（AI集客ドットコム）のプライバシーポリシー。お問い合わせフォームで取得する情報、利用目的、外部サービス（Netlify Forms）の利用、Cookieの扱いについて説明します。',
  alternates: { canonical: '/privacy/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'プライバシーポリシー | AI集客ドットコム',
    description:
      'お問い合わせフォームで取得する情報・利用目的・外部サービスの利用・Cookieの扱いについて説明します。',
    url: '/privacy/',
    images: [SITE.ogImage],
  },
};

export default function PrivacyPage() {
  return (
    <>
      <script
        id="ld-privacy"
        {...jsonLd([
          organizationSchema(),
          breadcrumbSchema([
            { name: 'トップ', path: '/' },
            { name: 'プライバシーポリシー', path: '/privacy/' },
          ]),
        ])}
      />

      <SiteHeader active="/privacy/" />

      <main>
        <div className="page-hero">
          <div className="wrap">
            <span className="ey ey-w">AI集客ドットコム</span>
            <h1>プライバシーポリシー</h1>
            <p>お問い合わせで取得する情報の取り扱いについて説明します。</p>
          </div>
        </div>

        <section className="sec-72">
          <div className="wrap">
            <div className="breadcrumb">
              <Link href="/">トップ</Link>
              <span>›</span>
              <span>プライバシーポリシー</span>
            </div>

            <div className="article-wrap" style={{ paddingTop: 8 }}>
              <div className="article-body">
                <p>
                  株式会社Gratitude（以下「当社」）は、当サイト「AI集客ドットコム」
                  （{SITE.url}）でお預かりする情報を、以下のとおり取り扱います。
                  本ページは、法的な断定を目的とするものではなく、現在の運用内容を説明するものです。
                </p>
                <p>
                  <strong>制定・最終改定日：{POLICY_DATE}</strong>
                </p>

                <h2>1. 取得する情報</h2>
                <p>当サイトでは、お問い合わせフォームの送信時に次の情報を取得します。</p>
                <ul>
                  <li>現在のご状況（選択式）</li>
                  <li>お名前</li>
                  <li>会社名・屋号（任意）</li>
                  <li>メールアドレス</li>
                  <li>電話番号（任意）</li>
                  <li>ご相談内容（任意）</li>
                </ul>
                <p>
                  また、フォーム送信に伴い、送信処理を行う外部サービス（後述の Netlify Forms）により、
                  送信日時・IPアドレス・ブラウザの種類（ユーザーエージェント）・遷移元ページ（リファラー）
                  が自動的に記録されます。
                </p>

                <h2>2. 利用目的</h2>
                <ul>
                  <li>お問い合わせ・ご相談へのご回答およびご連絡のため</li>
                  <li>お問い合わせ内容の確認・記録のため</li>
                </ul>
                <p>
                  取得した連絡先を、ご相談対応の範囲を超えて広告メールの一斉配信などに利用することはありません。
                </p>

                <h2>3. 第三者への提供</h2>
                <p>
                  取得した情報は、法令に基づく場合を除き、ご本人の同意なく第三者へ提供しません。
                  外部サービスの利用については、次項に記載します。
                </p>

                <h2>4. 外部サービスの利用</h2>
                <p>当サイトの運用にあたり、次の外部サービスを利用しています。</p>
                <ul>
                  <li>
                    <strong>Netlify（Netlify, Inc.／米国）</strong>：当サイトのホスティング（配信）。
                    お問い合わせフォームの送信内容は、同社のフォーム機能「Netlify Forms」を通じて
                    送信・保管されます。データは日本国外のサーバーで処理・保管される場合があります。
                  </li>
                  <li>
                    <strong>Google（Google LLC）</strong>：メールによるお問い合わせの受信・返信、
                    Google Fonts によるフォント配信、および Google アナリティクス（GA4）による
                    アクセス解析に利用しています（詳細は第6項）。
                  </li>
                  <li>
                    <strong>microCMS（株式会社microCMS）</strong>：ブログ記事の管理・配信。
                    お問い合わせで取得した情報とは連携していません。
                  </li>
                </ul>

                <h2>5. 安全管理</h2>
                <ul>
                  <li>当サイトとの通信は SSL/TLS により暗号化しています。</li>
                  <li>お問い合わせ内容を確認できる担当者・範囲を限定しています。</li>
                </ul>

                <h2>6. Cookie・アクセス解析について</h2>
                <p>
                  当サイトは、利用状況の把握と改善のため、Google LLC が提供するアクセス解析ツール
                  「Google アナリティクス 4（GA4）」を利用しています。GA4 は Cookie を用いて
                  訪問者を区別し、次のような情報を統計的に収集します。個人を特定する情報は含みません。
                </p>
                <ul>
                  <li>閲覧されたページ、滞在時間、サイト内の移動</li>
                  <li>参照元（検索・リンク元など）</li>
                  <li>おおよその地域（都道府県レベル）、端末・ブラウザの種類</li>
                  <li>
                    ボタン操作（LINE・電話リンクのクリック、問い合わせフォームの送信）の発生回数
                  </li>
                </ul>
                <p>
                  収集された情報は Google へ送信され、同社のサーバー（日本国外を含む）で処理されます。
                  Google は GA4 において IP アドレスを記録・保存しません。データの取り扱いは
                  {' '}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google プライバシーポリシー
                  </a>
                  {' '}
                  および
                  {' '}
                  <a
                    href="https://support.google.com/analytics/answer/6004245"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google アナリティクスのデータ利用について
                  </a>
                  {' '}
                  をご確認ください。
                </p>
                <p>
                  計測を望まない場合は、ブラウザの設定で Cookie を無効化するか、
                  {' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google アナリティクス オプトアウト アドオン
                  </a>
                  {' '}
                  をご利用ください。無効化しても当サイトの閲覧・お問い合わせは可能です。
                </p>
                <p>
                  広告配信・リターゲティング目的の Cookie は使用していません。
                  このほか、画面表示のフォント読み込みのため Google Fonts（Google LLC）へ接続が発生します。
                </p>

                <h2>7. 開示・訂正・利用停止・削除のご請求</h2>
                <p>
                  ご本人からの、保有する情報の開示・訂正・利用停止・削除等のご請求は、
                  下記のお問い合わせ先で承ります。ご本人であることを確認のうえ、対応します。
                </p>

                <h2>8. お問い合わせ先</h2>
                <p>
                  株式会社Gratitude
                  <br />
                  {CONTACT.address.zip} {CONTACT.address.line}
                  <br />
                  電話：<a href={CONTACT.telHref}>{CONTACT.tel}</a>（{CONTACT.telHours}）
                  <br />
                  メール：<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </p>

                <h2>9. 本ポリシーの改定</h2>
                <p>
                  本ポリシーの内容は、運用の変更に応じて改定することがあります。
                  重要な変更を行う場合は、本ページで告知します。
                </p>
              </div>

              <p style={{ marginTop: 40 }}>
                <Link href="/contact/" className="back-link">
                  ← お問い合わせへ戻る
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
