# プロジェクト状況報告 — AI集客ドットコム リブランディング

**作成日:** 2026-09-09
**対象サイト:** https://ai-marketing-japan.jp （株式会社Gratitude）
**この報告の範囲:** 調査・報告のみ。コード変更・本番デプロイ・ファイル削除・microCMSデータ変更は行っていない。
**秘密情報:** APIキー・トークン・パスワードの値は本ファイルに一切記載しない。

---

## 1. 現在の要約

| 項目 | 内容 |
|---|---|
| **完了している作業** | ① Step 0 基盤是正（本番=Gitの正本化、GitHubトークン失効、バックアップ）② Next.js への「デザイン・文言そのまま」移植（6ページ）③ microCMS APIキーのサーバー化＋旧キー失効＋新キー（GET専用）発行 ④ ブログのローカル検証 ⑤ 本番の暫定対応デプロイ（ブログを「準備中」ページに差し替え、旧キー除去） |
| **進行中の作業** | なし（各作業は区切りで停止済み）。次はリブランド本編の着手待ち |
| **未着手の作業** | リブランド本編：共通データ層の拡張、トップ再構成、`/services/*`・`/pricing/`・`/privacy/`・`/terms/`・`/faq/` の新規作成、AI DRIVE への導線、GA4 本設定、Next.js 版の本番公開 |
| **本番サイトへの変更有無** | **あり（1回のみ）**。2026-09-09 13:50 デプロイ `6aa1641c...`。変更は `blog/index.html`（記事一覧→「リニューアル準備中」静的ページ・平文APIキー除去）と `blog/post.html`（`/blog/` へリダイレクト）のみ。トップ・会社概要・お問い合わせ・送信完了は**本番=main でバイト一致・無変更**を確認済み |
| **次に予定している作業** | リブランド本編（作業ブランチ `rebrand/nextjs-migration` 上）。本番デプロイは行わない |
| **重要な問題・停止要因** | (a) Next.js 版は**本番未公開・GitHub未push・ユーザーの視覚レビュー未実施** (b) 問い合わせフォームの Netlify 実受信が**本番相当環境で未確認** (c) 現行本番の FAQ・構造化データに**旧「グロースプラン ¥39,800」が残存**（Next.js版では修正済みだが未デプロイ）(d) 現行本番に robots.txt / sitemap.xml / セキュリティヘッダー / GA4 が無い（Next.js版では実装済みだが未デプロイ）(e) 記事URLが id ベース（slug 未設定）(f) npm audit で 2件の脆弱性（next → postcss） |

---

## 2. Git・正本の状態

| 項目 | 値 |
|---|---|
| リポジトリ絶対パス | `/Users/user/Desktop/AI marketing/02_AI集客LP/grt_meo_picture` |
| 現在のブランチ | `rebrand/nextjs-migration` |
| 現在のコミットID | `be7e2e2718308aa265f646f6d4a0e03402df936f`（短縮 `be7e2e2`） |
| `main` との差分 | 61ファイル（うち20は画像の `public/` への移動）、+8,173 / −1,585 行。実質変更41ファイル |
| 作業ツリー | **clean**（追跡対象の変更なし） |
| 未コミットファイル | なし |
| 未追跡ファイル | なし（`.env.local` / `.next/` / `node_modules/` / `next-env.d.ts` / `*.tsbuildinfo` / `.claude/` / `.netlify/` は `.gitignore` により除外＝無視） |
| GitHub へ push 済みか | `main` = **push済**（`origin/main` = `58ab11d`）。`sync/production-20260909`・`archive/github-main-a7cbb11`・`archive/local-worktree-20260909` も push済。**`rebrand/nextjs-migration` は未push（ローカルのみ）** |
| 現在の正本 | **本番運用の正本＝GitHub `main`（`58ab11d`）**。リブランド移植作業の正本＝ローカル `rebrand/nextjs-migration`（`be7e2e2`） |
| バックアップ用ブランチ・タグ | タグ: `backup/pre-step0-local-f9ab383`（旧ローカルmain）、`backup/github-main-a7cbb11`（旧GitHub main）／ブランチ: `archive/github-main-a7cbb11`、`archive/local-worktree-20260909`、`sync/production-20260909`（いずれも GitHub にも存在）／ローカルバックアップ: `/Users/user/Desktop/AI marketing/02_AI集客LP/_backups/step0_20260909/`（本番ミラー・git bundle 3本・作業ツリー tgz、約342MB） |
| remote URL の認証情報 | **含まれていない**。`origin` = `https://github.com/gratitude00000000-spec/ai-marketing-lp.git`。認証は `gh` CLI（keyring）＋ macOS Keychain 経由 |

### コミット履歴（関連分）
```
58ab11d (origin/main, main)  hotfix: ブログを準備中ページに（旧microCMSキー失効に伴う暫定対応）
be7e2e2 (HEAD, rebrand)      Phase2 (2-1): ブログ検証で判明した修正
4810743 (rebrand)           Phase2 (2-1): Next.js基盤へ移植 + microCMSキーのサーバー化
4314444 (sync/production)    Step 0: netlify.toml を復元
52782d1                     Step 0: 本番サイトの現状をリポジトリに取り込み（orphan root）
```

---

## 3. 現在の技術構成（`rebrand/nextjs-migration` ブランチ）

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js `^15.5.0`（インストール実体 15.5.25）、App Router |
| React | `^19.1.0`（実体 19.2.8） |
| Node.js 想定 | ローカル `v24.15.0` ／ Netlify ビルド `NODE_VERSION=20`（`netlify.toml`） |
| TypeScript | あり。`^5.8.0`、`strict: true`、`noEmit`、`paths: {"@/*": ["./*"]}` |
| CSS・UI | 単一の手書きデザインシステム `app/globals.css`（本番の inline `<style>` を移植・重複排除のみ、見た目不変）。**Tailwind 不使用**、CSS Modules 不使用、UIライブラリ不使用。フォントは Google Fonts（Shippori Mincho + Noto Sans JP）を `<link>` で読み込み |
| ビルド方式 | `next build`（`npm run build`）。Netlify では `@netlify/plugin-nextjs` 前提の設定（未デプロイ） |
| レンダリング方式 | 静的生成（SSG）中心。`/blog/` と `/blog/[slug]/` と `sitemap.xml` は ISR（`revalidate = 600` 秒）。`/blog/[slug]/` は `generateStaticParams` ＋ `dynamicParams = true` |
| CMS | microCMS（`microcms-js-sdk` `^3.2.0`）。サーバー専用（`server-only` パッケージでガード） |
| フォーム | Netlify Forms。`data-netlify="true"` ＋ `public/__forms.html`（ビルド時検出用）＋ React 側 `fetch` 送信 |
| ホスティング | Netlify（サイト名 `gratitude-lp`、site id `b620e9ab-586b-4b0c-a182-1b7d20e35d46`、team `gratitude-00000000's team`、プラン `nf_team_dev`） |
| デプロイ方式 | **手動 CLI のみ**（`npx netlify deploy --prod --dir=. --site=<id>`）。GitHub 連携の自動デプロイは**無効**（`build_settings.installation_id: false`、`cmd: ''`）。GitHub へ push しても本番は更新されない |
| package manager | npm（`package-lock.json` あり） |
| 主要依存 | `dependencies`: `microcms-js-sdk`、`next`、`react`、`react-dom`、`server-only` ／ `devDependencies`: `@types/node`、`@types/react`、`@types/react-dom`、`eslint`、`eslint-config-next`、`typescript` |
| 使用環境変数名（値は非表示） | `NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_SITE_NAME`、`MICROCMS_SERVICE_DOMAIN`、`MICROCMS_API_KEY`、`MICROCMS_BLOG_ENDPOINT`、`MICROCMS_CATEGORY_ENDPOINT`（既定値ありで参照）、`NEXT_PUBLIC_GA4_ID`、`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |

---

## 4. ディレクトリ・ファイル構成（`node_modules` / `.next` / キャッシュ / 秘密情報 除外）

```
grt_meo_picture/
├── app/
│   ├── layout.tsx              # 共通レイアウト（<html>/<head>、metadataBase、フォント、GA4）
│   ├── page.tsx                # ルート / （トップ）
│   ├── not-found.tsx           # 404 ページ
│   ├── globals.css             # 共通デザインシステム（全CSS）
│   ├── robots.ts               # robots.txt 生成
│   ├── sitemap.ts              # sitemap.xml 生成（microCMS記事も含む）
│   ├── about/page.tsx          # /about/
│   ├── contact/page.tsx        # /contact/
│   ├── thanks/page.tsx         # /thanks/（noindex）
│   └── blog/
│       ├── page.tsx            # /blog/（一覧・サーバー取得）
│       └── [slug]/page.tsx     # /blog/{slug}/（詳細・generateStaticParams）
├── components/
│   ├── SiteHeader.tsx          # 共通ヘッダー（server）
│   ├── HeaderCtas.tsx          # ヘッダーの LINE/電話ボタン（client・GA計測）
│   ├── MobileNav.tsx           # モバイルナビ（client）
│   ├── SiteFooter.tsx          # 共通フッター
│   ├── FaqAccordion.tsx        # FAQ アコーディオン（client）
│   ├── LineConsultBox.tsx      # トップの LINE 相談ウィジェット（client）
│   ├── ContactForm.tsx         # /contact/ の Netlify フォーム（client）
│   └── icons.tsx               # 電話アイコン SVG
├── lib/
│   ├── site.ts                 # 会社情報・連絡先・ナビ・料金プラン・FAQ・LINE URL 等の共通データ
│   └── microcms.ts             # microCMS サーバー専用クライアント（'server-only'）
├── cms/
│   └── types.ts                # microCMS 型定義 + blogSlug()/blogHtml() ヘルパー
├── seo/
│   └── jsonld.ts               # 構造化データ生成（Organization/WebSite/LocalBusiness/FAQPage/Breadcrumb/Article）
├── analytics/
│   ├── GA4.tsx                 # GA4 タグ（NEXT_PUBLIC_GA4_ID 未設定なら出力なし）
│   └── events.ts               # trackLineClick / trackPhoneClick / trackCTAClick / trackFormSubmit
├── public/
│   ├── favicon.png, apple-touch-icon.png, ogp_meo.png
│   ├── images/logo.png, images/logo-ai-llmo-aio-aeo-webmarketing-.png
│   ├── 11.jpg 〜 19.jpg（業種・信頼画像）
│   ├── plan-a-.jpg, plan-b.jpg, plan-c.jpg（プランアイコン）
│   ├── ai-search-google-trend-.jpg, ai-synergy-global-.jpg, googlebusinessprofile-meo-aio-.jpg（サービス画像）
│   └── __forms.html            # Netlify Forms 検出用の静的HTML
├── docs/
│   └── PROJECT_STATUS.md       # 本ファイル
├── package.json / package-lock.json
├── tsconfig.json
├── next.config.mjs             # trailingSlash / redirects / headers / images
├── netlify.toml                # Next.js ビルド設定（@netlify/plugin-nextjs）
├── .eslintrc.json              # next/core-web-vitals（no-img-element off）
├── .env.example                # 環境変数テンプレ（値なし）
└── .gitignore
```
- **テストディレクトリ:** 存在しない（テストスイート未整備）
- **GA4:** `analytics/GA4.tsx`（読込）＋ `analytics/events.ts`（イベント）＋各 client コンポーネントで発火
- **metadata:** `app/layout.tsx`（ルート）＋各 `page.tsx` の `export const metadata` / `generateMetadata`
- **構造化データ:** `seo/jsonld.ts` を各ページの `<Script type="application/ld+json">` で出力

---

## 5. ページ・ルート一覧

実装状況の凡例：**完了**（faithful移植として完成）／**実装中**／**仮実装**／**未着手**／**確認待ち**

| URL | ページ名 | ファイル | 実装状況 | 旧サイトから移植 | 新規 | index | title | H1 | canonical | 構造化データ | 主なCTA | 正常表示 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | トップ | `app/page.tsx` | 完了（faithful） | ✅ | − | index | AI集客ドットコム \| AI時代の集客支援・GBP運用代行・AIO/LLMO/AEO/MEO対策 | AIに選ばれる時代の集客設計を、AI集客ドットコムが支援します。 | `/` | Organization, WebSite, FAQPage | LINEで相談 / 電話 | ✅ ローカル |
| `/services/` | サービス総合 | 未作成 | **未着手** | − | ✅ | index | （未定） | （未定） | `/services/` | Service, Breadcrumb（予定） | 診断→LINE | ❌ |
| `/services/web-marketing/` | Web集客セット | 未作成 | **未着手** | − | ✅ | index | （未定） | （未定） | 〃 | Service, FAQPage, Breadcrumb（予定） | 無料相談 | ❌ |
| `/services/gbp/` | GBP運用（単品） | 未作成 | **未着手** | − | ✅ | index | （未定） | （未定） | 〃 | Service, FAQPage, Breadcrumb（予定） | 相談 | ❌ |
| `/services/website/` | HP制作案内 | 未作成 | **未着手** | − | ✅ | index | （未定） | （未定） | 〃 | Service, Breadcrumb（予定） | AI DRIVEへ / 相談 | ❌ |
| `/pricing/` | 料金 | 未作成 | **未着手** | − | ✅ | index | （未定） | （未定） | `/pricing/` | Breadcrumb（予定） | 相談 | ❌ |
| `/blog/` | ブログ一覧 | `app/blog/page.tsx` | 完了（サーバー取得・要実キー） | ✅ | − | index | ブログ | ブログ | `/blog/` | BreadcrumbList | 記事内CTA | ✅ ローカル（実キー設定時） |
| `/blog/{slug}/` | 記事詳細 | `app/blog/[slug]/page.tsx` | 完了（URLは id ベース、slug 未設定） | ✅（旧 `?id=` から） | − | index | 記事の `seo.seoTitle`（無ければ title） | 記事タイトル | `/blog/{id}/` | Article, BreadcrumbList | 無料相談バナー | ✅ ローカル（記事2本） |
| `/about/` | 会社概要 | `app/about/page.tsx` | 完了（faithful） | ✅ | − | index | 会社概要 | 会社概要 | `/about/` | Organization, LocalBusiness, BreadcrumbList | 電話 / 相談 | ✅ ローカル |
| `/contact/` | お問い合わせ | `app/contact/page.tsx` | 完了（faithful・フォーム実受信は確認待ち） | ✅ | − | index | お問い合わせ | お問い合わせ | `/contact/` | Organization, BreadcrumbList | フォーム送信 / 電話 | ✅ ローカル |
| `/privacy/` | プライバシーポリシー | 未作成 | **未着手** | − | ✅ | index | （未定） | （未定） | `/privacy/` | − | − | ❌ |
| `/terms/` | 利用規約 | 未作成 | **未着手** | − | ✅ | index | （未定） | （未定） | `/terms/` | − | − | ❌ |
| `/thanks/` | 送信完了 | `app/thanks/page.tsx` | 完了 | ✅ | − | **noindex,nofollow** | 送信完了 | 送信が完了しました | `/thanks/` | − | トップへ戻る | ✅ ローカル |
| `/_not-found`（404） | 404 | `app/not-found.tsx` | 完了（新規） | − | ✅ | （404） | ページが見つかりません | ページが見つかりません | − | − | トップへ | ✅ ローカル |

> 補足：`title` / `canonical` の `NEXT_PUBLIC_SITE_URL` はローカルでは `http://localhost:3000`。本番デプロイ時に `https://ai-marketing-japan.jp` へ切り替わる（環境変数駆動）。

---

## 6. 共通データとコンポーネント

| 情報 | 定義ファイル | 主な利用先 | 重複の有無 |
|---|---|---|---|
| 会社情報（社名・代表・事業内容） | `lib/site.ts`（`SITE`）＋`app/about/page.tsx` に about テーブル本文 | layout、footer、jsonld、about | 事業内容の文言は about ページに直書き（`lib/site.ts` に未集約） |
| 住所・電話・メール | `lib/site.ts`（`CONTACT`） | header CTA、footer、about、contact、jsonld | ✅ 一元化済み |
| サービス情報 | **未集約**。`app/page.tsx` の `SERVICES` 配列（トップ3種）と `app/about/page.tsx` の `SERVICES` 配列（6種）が**別々に定義** | 各ページ内 | **重複・不一致**（トップ3種 vs about 6種、粒度も異なる） |
| 料金プラン | `lib/site.ts`（`PLANS`） | `app/page.tsx` の料金セクション | ✅ 一元化済み（お試し・スタンダードの2件） |
| FAQ | `lib/site.ts`（`HOME_FAQ`、5問） | `app/page.tsx`（表示＋FAQPage JSON-LD） | ✅ 一元化済み |
| CTA（文言・遷移先） | `lib/site.ts`（`LINE_OPTIONS`）＋各コンポーネントにボタン実装 | HeaderCtas、LineConsultBox、CTAセクション | LINE/電話リンクは `CONTACT` から。ボタンの見た目は `globals.css` |
| LINE URL | `lib/site.ts`（`CONTACT.lineUrl` = `lin.ee/...`、`CONTACT.lineOaMessage` = `line.me/R/oaMessage/@...`） | HeaderCtas、LineConsultBox、page.tsx、blog空表示、（旧 main の blog 準備中ページ） | 値は `lib/site.ts` に集約。ただし `app/page.tsx` のヒーローLINEボタンだけ URL を直書き（`https://lin.ee/oJUbunU`）→ 軽微な重複 |
| AI DRIVE URL | **未定義**（コード内に一切なし） | なし | `/services/website/` 作成時に追加予定 |
| ヘッダー | `components/SiteHeader.tsx`（＋`HeaderCtas.tsx`、`MobileNav.tsx`） | 全ページ | ✅ 部品化（ナビ配列は SiteHeader 内に定義） |
| フッター | `components/SiteFooter.tsx` | 全ページ（thanks 除く） | ✅ 部品化（フッターリンク配列は SiteFooter 内に定義） |
| ナビゲーション | `SiteHeader.tsx` の `NAV_LINKS` と `SiteFooter.tsx` の `FOOTER_LINKS` が**別定義**（内容はほぼ同一） | header / footer | 軽微な重複（`lib/site.ts` の `NAV` は未使用） |
| SEO設定 | `lib/site.ts`（`SITE`）＋`app/layout.tsx`（metadataBase・OG 既定）＋各 `page.tsx` の metadata | 全ページ | ✅ 集約 |
| 構造化データ | `seo/jsonld.ts` | 各ページの `<Script>` | ✅ 一元化 |

**重複の要注意点:** ① サービス定義（トップ3 / about 6）が別配列で不一致 ② ナビ・フッターリンク配列が別定義 ③ `lib/site.ts` に `NAV` があるのに未使用 ④ about の事業内容が直書き ⑤ ヒーローの LINE URL 直書き。→ 共通データ層の整備（リブランド本編 Step 1）で解消予定。

---

## 7. 確定済みサービス内容・料金

### コードに反映済み（`lib/site.ts` `PLANS` / `HOME_FAQ`）

| プラン | 月額（税抜） | 税込 | 投稿回数 | 編集・修正回数の記載 | 内容 |
|---|---|---|---|---|---|
| お試しプラン | ¥14,980 | ¥16,478 | 月3回投稿 | **削除済み**（記載なし） | メニュー・GBP全体の編集対応／口コミ返信 |
| スタンダードプラン（おすすめ） | ¥19,800 | ¥21,780 | 月4回投稿 | **削除済み**（記載なし） | 口コミ返信／GBP×他媒体シナジー／コンサルティング対応／多言語化／投稿時の画像SEO |

- **初期費用 / 契約期間 / 解約条件 / セット割引:** コードに**記載なし**（未確定・推測補完していない）
- **旧「グロースプラン ¥39,800」:** `rebrand/nextjs-migration` の**表示コンテンツ・JSON-LD には一切なし**（`lib/site.ts` のコメント2箇所に「提供終了」と経緯記載のみ）。**ただし現行本番（`main` の `index.html`）には FAQ 本文と FAQPage JSON-LD に残存**（未デプロイの Next.js 版でのみ除去済み）
- **Proプラン:** `rebrand` では非掲載（`lib/site.ts` のコメントのみ）

### 未確定（コードに入れていない）

| 区分 | 状態 |
|---|---|
| Web集客セット（主力プラン） | 正式名称・料金とも**未確定** → ページ未作成、`PLANS` にも未追加 |
| GBP運用単品 | 「当面は お試し／スタンダードをそのまま単品扱い」の方針のみ（前段の回答）。専用ページ未作成 |
| HP制作単品 | AI DRIVE へ案内する方針のみ。`/services/website/` 未作成、AI DRIVE URL 未定義 |
| Web集客コンサルティング | 単品でも提供する方針のみ。ページ未作成、料金未定 |
| AI DRIVE との役割分担 | 方針は前段で確認済み（HP制作の詳細は AI DRIVE、相談はどちらからでも可）だが**コード未反映** |

---

## 8. microCMS の状態

| 項目 | 内容 |
|---|---|
| 接続方法 | `lib/microcms.ts` の `createClient()`（`microcms-js-sdk`）。`import 'server-only'` でサーバー専用を強制 |
| サービスドメイン | 環境変数 `MICROCMS_SERVICE_DOMAIN`（`.env.local` に設定・値は非表示） |
| 使用エンドポイント名 | `blogs`（`MICROCMS_BLOG_ENDPOINT` 既定）、`categories`（`MICROCMS_CATEGORY_ENDPOINT` 既定） |
| APIキーを使用する場所 | `lib/microcms.ts` のみ（サーバーコンポーネント `app/blog/page.tsx`・`app/blog/[slug]/page.tsx`・`app/sitemap.ts` から呼び出し） |
| サーバー側だけで使用されているか | **はい**。`'server-only'` によりクライアントバンドルに混入するとビルドエラーになる |
| ブラウザへ APIキーが配信されていないか | **配信されていない**（検証済み）。本番ビルド出力（`.next/`）・全クライアントJSチャンク・HTML・RSC ペイロード・`sitemap.xml`・`robots.txt` のいずれにもキー・サービスドメインなし。ブラウザから microCMS への直接リクエストも発生しない |
| `.env.local` が Git 管理対象外か | **対象外**（`.gitignore` の `.env*.local` で除外。`git check-ignore` で確認。git 履歴にも新キーは 0 件） |
| ブログ一覧の取得状況 | 実データ取得**成功**（記事2本表示：カテゴリ「更新情報」・公開日）。キー未設定時は「準備中」表示でビルドは通る |
| 記事詳細の取得状況 | 実データ取得**成功**（記事2本）。本文HTML・`seo.seoTitle` を `<title>` に・パンくず・公開/更新日を表示 |
| 記事URLの形式 | `/blog/{slug}/`（`trailingSlash: true`）。`slug` は `seo.slug` → `slug` → `id` の順で解決 |
| slug の使用状況 | **現在の記事2本は `slug` / `seo.slug` 未設定** → URL は id ベース（例 `/blog/qln47wv3gx/`）。descriptive URL にするには microCMS で各記事に slug 入力が必要 |
| 旧 `?id=` 形式からの移行方法 | `next.config.mjs` の `redirects()` で `/blog/post.html` → `/blog/`（`permanent: true`）。**個別記事の 1:1 リダイレクトは未実装**（旧URLは記事一覧に着地。slug 確定後に 1:1 を追記予定） |
| 301 リダイレクトの実装状況 | Next.js 設定リダイレクト（`/blog/post.html`・`/blog/post`）。現行本番（暫定版）の `blog/post.html` は JS `location.replace` ＋ `meta refresh`（サーバー301ではない） |
| 下書きプレビュー | **未実装**（`draftKey` を扱う API Route なし。新キーも下書き取得権限なし） |
| Webhook・再ビルド | **未設計**。現状は ISR（`revalidate = 600` 秒）でのポーリング更新のみ。microCMS Webhook → Netlify Build Hook の連携は未設定 |
| キーローテーションの状況 | **完了**。旧キー `default` は削除・失効（GET で 401）。新キー `nextjs-server`（**GET 専用・最小権限**、PATCH/DELETE は "forbidden" を確認）を発行し `.env.local` に設定。本番デプロイ時は Netlify 環境変数へ設定予定 |

---

## 9. 問い合わせ・CTA の状態

| 項目 | 内容 |
|---|---|
| フォーム実装方式 | `components/ContactForm.tsx`（client）。`<form data-netlify="true" data-netlify-honeypot="bot-field">` ＋ `<input type="hidden" name="form-name" value="contact">`。送信は `fetch('/', {method:'POST', 'application/x-www-form-urlencoded'})` → 成功時 `router.push('/thanks/')` |
| Netlify Forms 検出設定 | `public/__forms.html`（フォーム定義を 1:1 で複製した静的HTML）＋ 実フォームの `data-netlify` 属性 |
| 送信先 | `action="/thanks/"`（フォールバック）／実送信は `fetch` で `/` へ POST（`form-name=contact`） |
| 必須項目 | `purpose`（ラジオ・先頭に `required`）、`name`、`email` |
| 未必須項目 | `company`、`phone`、`message` |
| バリデーション | ブラウザネイティブ（`required` / `type="email"` / `type="tel"`）。カスタムバリデーションなし |
| スパム対策 | ハニーポット `bot-field`（送信前に値が入っていれば中断）。reCAPTCHA なし |
| 送信成功時の遷移先 | `/thanks/`（`noindex,nofollow`） |
| エラー時の表示 | `fetch` 失敗時にフォーム内へ赤字メッセージ（「送信に失敗しました。お手数ですが、お電話またはLINEでお問い合わせください。」）＋送信ボタン再活性化 |
| LINE リンク | `CONTACT.lineUrl`（`lin.ee/...`）。相談内容選択時は `line.me/R/oaMessage/@...` にプリセットメッセージ付与。`target="_blank" rel="noopener noreferrer"` |
| 電話リンク | `tel:` スキーム（`CONTACT.telHref`）。header・contact・トップ CTA |
| AI DRIVE へのリンク | **なし**（コード内に一切なし） |
| 外部リンクの `rel` 設定 | 外部 `<a target="_blank">` はすべて `rel="noopener noreferrer"`（SiteFooter、LineConsultBox、page.tsx、HeaderCtas、about）。確認済み |
| フォームが実際に受信できる状態か | **未確認**。現行本番の Netlify Forms `contact` は登録済みで累計6件受信（Phase 1 で確認済み）。**Next.js 版のフォームは Netlify Deploy Preview 等の本番相当環境で送信テストをしていない**。ローカルでは `fetch` フローのみ確認 |

---

## 10. SEO・AIO／LLMO の状態（`rebrand/nextjs-migration`）

| 項目 | 実装状況 |
|---|---|
| ページ別 title | ✅ 全ページ個別（layout の `template: '%s | AI集客ドットコム'`） |
| meta description | ✅ 全ページ個別（トップ・about・contact・blog は固有文、記事は `seo.metaDescription` → `description`） |
| canonical | ✅ 全ページ（`alternates.canonical`、絶対URL・環境変数駆動） |
| OGP / Twitter Card | ✅ layout に既定＋各ページで上書き。記事は `og:type=article` ＋ publishedTime/modifiedTime |
| favicon | ✅ `/favicon.png`（32×32）＋ `/apple-touch-icon.png`（`app/layout.tsx` の `icons`） |
| robots.txt | ✅ `app/robots.ts` で生成（`Disallow: /thanks/ /api/ /_next/`、Sitemap 参照）。**現行本番は 404** |
| sitemap.xml | ✅ `app/sitemap.ts` で生成（静的4ページ＋記事2本＝6 URL）。**現行本番は 404** |
| パンくず | ✅ about / contact / blog / 記事に `BreadcrumbList` JSON-LD。記事詳細は画面上にもパンくず表示 |
| 内部リンク | ヘッダー・フッターの共通ナビ、記事→`/contact/` バナー、blog 空表示→ contact/LINE。**サービス間の相互リンクは未実装**（サービスページ未作成のため） |
| 見出し構造 | ✅ 各ページ h1 は1つ。トップは h1→h2（セクション）。記事本文は microCMS の h2/h3/h4 をそのまま |
| Organization | ✅ トップ・about・contact（`seo/jsonld.ts` `organizationSchema()`。社名・別名・URL・logo・電話・メール・住所・sameAs） |
| WebSite | ✅ トップ（`webSiteSchema()`） |
| WebPage | ❌ 未実装（個別の `WebPage` type は出していない） |
| Service | ❌ 未実装（サービスページ未作成） |
| BreadcrumbList | ✅ about / contact / blog / 記事 |
| FAQPage | ✅ トップ（`HOME_FAQ` 5問と 1:1） |
| Article | ✅ 記事詳細（headline・image・datePublished・dateModified・author=Organization・publisher） |
| 更新日・公開日 | ✅ 記事に `publishedAt` / `updatedAt` を画面表示＋ Article JSON-LD の datePublished / dateModified |
| 運営者情報 | ✅ Organization / LocalBusiness に社名・住所（沖縄県那覇市）・電話・公式サイト。about ページに会社概要テーブル |
| AI が理解しやすいサービス定義文 | ⚠️ **部分的**。第1段階レポートに `/` と `/services/gbp/` の「AI引用用定義文」案はあるが、**コードには未反映**（対象ページが未作成、またトップにも明示的な定義文段落はまだ置いていない） |
| 存在しない情報を構造化データに入れていないか | ✅ 確認済み。`priceRange: '¥¥'` は概算表記、`areaServed` は「日本」。料金額・実績数値・レビュー・評価は構造化データに含めていない。旧グロースプラン価格も含まない |

---

## 11. GA4・コンバージョン計測

| 項目 | 内容 |
|---|---|
| GA4 の設置状況 | コードは実装済み（`analytics/GA4.tsx` を `app/layout.tsx` の `<head>` で読込）。ただし **`NEXT_PUBLIC_GA4_ID` 未設定なら何も出力しない**。ローカル `.env.local` でも未設定＝現状レンダリングされない |
| 測定ID が全ページ共通管理か | ✅ 環境変数 `NEXT_PUBLIC_GA4_ID` 1箇所。layout で全ページ共通適用。**ID はコードにハードコードしていない** |
| 現行本番の GA4 | **設置なし**（本番 `index.html` に gtag / googletagmanager / GTM いずれもなし） |
| GTM | 未使用（コンポーネントなし） |
| LINE クリックイベント | 実装済み（`trackLineClick(location)` → GA4 `line_click`）。HeaderCtas、LineConsultBox で発火 |
| 電話クリックイベント | 実装済み（`trackPhoneClick(location)` → `phone_click`）。HeaderCtas、LineConsultBox で発火 |
| フォーム送信イベント | 実装済み（`trackFormSubmit('contact')` → `form_submit`）。`ContactForm` の送信成功時 |
| AI DRIVE 遷移イベント | **未実装**（AI DRIVE リンク自体が未実装） |
| その他 CTA イベント | `trackCTAClick(name, location)` → `cta_click`。LineConsultBox の相談内容ボタン選択で `line_option` を送信 |
| 二重送信・二重計測の可能性 | 現状は低い（GA4 のみ・GTM なし。`gtag('config')` は 1回）。ただし `NEXT_PUBLIC_GA4_ID` 設定後に SPA 遷移でのページビュー計測の要否を検討要（現状 `send_page_view` は既定のまま） |
| Cookie・プライバシーポリシーとの整合性 | ⚠️ **未整合**。`/privacy/` ページが未作成。GA4 を本番で有効化する前にプライバシーポリシー整備が必要 |
| DebugView 等での動作確認 | **未実施**（ID 未設定のため計測未発火） |

---

## 12. セキュリティ確認

| 項目 | 結果 |
|---|---|
| GitHub トークンの残存 | ✅ **なし**。作業ツリー・全 git 履歴（`--all -p`）・`.git` 内部・`~/.gitconfig` すべてクリーン。Step 0 で 2リポジトリの remote URL からトークン除去＋ユーザーが GitHub 上で classic PAT 4本を削除済み |
| microCMS APIキーの残存（新キー） | ✅ **なし**。作業ツリー・git 履歴とも 0 件。`.env.local`（Git 管理外）のみ |
| microCMS APIキーの残存（旧・失効済みキー） | ⚠️ **git 履歴に残存**。旧 `blog/index.html`・`blog/post.html` に平文で入っていたため、コミット `f9ab383` / `0aec1a8` / `0d8ff6b` / `52782d1` / `4810743` / `58ab11d` の各ブロブに含まれる。**ただし当該キーは失効済み（GET で 401 "header is invalid"）＝無効なデッドクレデンシャル**。`main` と `rebrand` の追跡ファイル現行版にはなし |
| `.env` ファイルの Git 追跡 | ✅ `.env.local` は未追跡（`.gitignore`）。`.env.example`（値なしテンプレ）のみ追跡 |
| 公開 HTML・JavaScript への秘密情報混入 | ✅ **なし**（Next.js ビルド出力・現行本番の暫定版ブログとも）。現行本番の暫定ブログページからは fetch 処理ごとキーを除去済み |
| Git 履歴への秘密情報混入 | ⚠️ 上記の**失効済み microCMS キーのみ**。GitHub トークン・新キー・パスワードはなし |
| 外部スクリプト | Google Fonts（`fonts.googleapis.com` / `fonts.gstatic.com`）、GA4（`googletagmanager.com`、ID 設定時のみ）。microCMS 画像 CDN（`images.microcms-assets.io`）。いずれも標準的 |
| フォームスパム対策 | ハニーポット `bot-field` のみ。reCAPTCHA / Netlify の追加 spam filter は未設定 |
| セキュリティヘッダー（現行本番） | ⚠️ `strict-transport-security`（HSTS）のみ。**X-Content-Type-Options / X-Frame-Options / Referrer-Policy / Permissions-Policy / CSP なし** |
| セキュリティヘッダー（Next.js 版・未デプロイ） | `next.config.mjs` の `headers()` で X-Content-Type-Options=nosniff / X-Frame-Options=SAMEORIGIN / Referrer-Policy=strict-origin-when-cross-origin / Permissions-Policy=camera=(),microphone=(),geolocation=()。**CSP・HSTS は未設定**（HSTS は Netlify が付与） |
| CSP | ❌ 未設定（現行・Next.js 版とも） |
| HSTS | ✅ 現行本番で `max-age=31536000`（Netlify 付与） |
| X-Content-Type-Options | 現行本番 ❌ ／ Next.js 版 ✅（未デプロイ） |
| Referrer-Policy | 現行本番 ❌ ／ Next.js 版 ✅（未デプロイ） |
| Permissions-Policy | 現行本番 ❌ ／ Next.js 版 ✅（未デプロイ） |
| 依存パッケージの脆弱性 | ⚠️ `npm audit` で **2件**：(高) `postcss` — "XSS via Unescaped `</style>` in CSS Stringify Output"（`next` が脆弱バージョンの postcss に依存）／(中) `next` — 同 postcss 依存。実運用リスクは低め（postcss はビルド時、攻撃者制御の CSS 入力経路なし）だが、本番公開前に `npm audit` の再確認・バージョン更新の検討を推奨 |

---

## 13. 実行・検証結果

凡例：**成功** / **失敗** / **未実施** / **実施できない**

| 項目 | 結果 | 備考 |
|---|---|---|
| install（`npm install`） | **成功** | 311パッケージ。`server-only` 追加インストール済み |
| lint（`npx next lint`） | **成功** | 警告・エラー 0。`next lint` は Next 16 で廃止予定の告知あり |
| type-check（`npx tsc --noEmit`） | **成功** | エラー 0 |
| build（`npx next build`） | **成功** | 静的12ページ生成（記事2本含む）。First Load JS 共通 103kB |
| test | **実施できない** | テストスイートが存在しない |
| ブラウザ確認（PC） | **成功** | `/`・`/about/`・`/contact/`・`/blog/`・`/blog/{id}/`・`/thanks/`・`robots.txt`・`sitemap.xml` を表示確認。コンソールエラーなし |
| モバイル確認（375px） | **成功** | 横スクロールなし、ハンバーガーメニュー開閉・リンク遷移 OK |
| リンク確認 | **未実施（自動）** | 共通ナビ・主要CTAは手動確認済み。自動リンクチェッカーは未実行 |
| 404確認 | **成功** | `app/not-found.tsx` 表示。`/blog/post.html?id=x` → `/blog/` へ 308 |
| フォーム確認 | **未確認** | ローカルで `fetch` 送信フローとバリデーション・遷移は確認。**Netlify の実受信は本番相当環境で未テスト** |
| Lighthouse / Core Web Vitals | **未実施** | — |
| 構造化データ確認 | **成功（簡易）** | ブラウザ上で JSON-LD のパースと `@type` を確認（Organization/WebSite/FAQPage、Article/BreadcrumbList）。Google Rich Results Test は未実行 |
| robots・sitemap 確認 | **成功** | ビルド出力で `robots.txt`（Disallow 3件）・`sitemap.xml`（6 URL）を確認 |

---

## 14. 本番・プレビュー環境

| 項目 | 内容 |
|---|---|
| 本番URL | https://ai-marketing-japan.jp |
| 現在の本番は旧静的HTMLか Next.js版か | **旧静的HTML**（`main` ブランチの `index.html` ほか）。Next.js 版は**未公開** |
| プレビューURL | **なし**（Netlify Deploy Preview 未作成、`rebrand` ブランチ未push）。確認はローカル `next dev` / `next start` のみ |
| Netlify との接続状況 | サイト `gratitude-lp` に接続。`build_settings.repo_url` は GitHub リポジトリを指すが `installation_id: false` ＝ **GitHub App 未連携＝自動デプロイなし**。デプロイは CLI 手動のみ |
| Vercel との接続状況 | `00_HP制作共通テンプレートのコピー/.vercel/project.json` に Vercel プロジェクト `ai-marketing-japan`（team `team_ZV91...`）が残存。**本番ドメインは Netlify を指しており、Vercel は本番未使用**。プロジェクトの生存確認は未実施（Vercel API 未アクセス）。削除は保留（ユーザー方針：Next.js 移行・本番公開が正常完了してから不要品を一覧報告→承認） |
| 自動デプロイの設定状況 | **なし**（Netlify・Vercel とも） |
| 本番公開済みの最終コミット | `main` = `58ab11d`（デプロイ `6aa1641c214671978323a274`、2026-09-09 13:50 published、context production） |
| ローカルだけに存在する変更 | `rebrand/nextjs-migration` ブランチ全体（`be7e2e2`。Next.js 移植・microCMS サーバー化・SEO 整備）。**GitHub 未push・本番未反映** |
| 本番デプロイを行っていないこと | Next.js 版の本番デプロイは**未実施**。今回の報告作成でも一切デプロイしていない |

---

## 15. 変更ファイル一覧（Step 0 完了後〜現在）

`main`（`58ab11d`）と `rebrand/nextjs-migration`（`be7e2e2`）の差分。すべて**コミット済み**。

### 追加（新規）

| ファイル | 変更理由 | 影響範囲 |
|---|---|---|
| `app/layout.tsx` | Next.js ルートレイアウト（head・フォント・GA4・metadata 既定） | 全ページ |
| `app/page.tsx` | トップページを JSX 化（本番と同一内容） | `/` |
| `app/about/page.tsx` | 会社概要を JSX 化 | `/about/` |
| `app/contact/page.tsx` | お問い合わせを JSX 化 | `/contact/` |
| `app/thanks/page.tsx` | 送信完了を JSX 化 | `/thanks/` |
| `app/blog/page.tsx` | ブログ一覧をサーバー取得に変更 | `/blog/` |
| `app/blog/[slug]/page.tsx` | 記事詳細を静的パス＋サーバー取得に変更 | `/blog/{slug}/` |
| `app/not-found.tsx` | 404ページ新設 | 404 |
| `app/globals.css` | 本番の inline CSS を集約 | 全ページ |
| `app/robots.ts` | robots.txt 生成（本番に無かった） | SEO |
| `app/sitemap.ts` | sitemap.xml 生成（本番に無かった） | SEO |
| `components/SiteHeader.tsx` / `HeaderCtas.tsx` / `MobileNav.tsx` / `SiteFooter.tsx` / `FaqAccordion.tsx` / `LineConsultBox.tsx` / `ContactForm.tsx` / `icons.tsx` | 共通パーツの部品化 | 全ページ |
| `lib/site.ts` | 会社情報・連絡先・料金・FAQ・ナビの共通データ | 全ページ |
| `lib/microcms.ts` | microCMS サーバー専用クライアント（キーをサーバー側へ） | ブログ・sitemap |
| `cms/types.ts` | microCMS 型定義 | ブログ |
| `seo/jsonld.ts` | 構造化データ生成関数 | 全ページ |
| `analytics/GA4.tsx` / `analytics/events.ts` | GA4 タグ＋イベント計測 | 全ページ |
| `public/__forms.html` | Netlify Forms 検出用 | フォーム |
| `package.json` / `package-lock.json` / `tsconfig.json` / `next.config.mjs` / `.eslintrc.json` / `.env.example` | Next.js プロジェクト設定 | ビルド全体 |
| `docs/PROJECT_STATUS.md` | 本報告書 | ドキュメント |

### 変更

| ファイル | 変更理由 | 影響範囲 | コミット |
|---|---|---|---|
| `.gitignore` | `.env*` `.next/` `node_modules/` `.claude/` 等を除外 | リポジトリ全体 | 済 |
| `netlify.toml` | 静的公開設定 → Next.js ビルド設定（`@netlify/plugin-nextjs`） | デプロイ | 済 |
| `blog/index.html`（**`main` 側のみ**） | 旧キー失効に伴い「準備中」静的ページ化＋平文キー除去 | 現行本番 `/blog/` | 済（`58ab11d`・**本番デプロイ済**） |
| `blog/post.html`（**`main` 側のみ**） | `/blog/` へリダイレクト化＋キー除去 | 現行本番 `/blog/post.html` | 済（`58ab11d`・**本番デプロイ済**） |

### 移動

| 内容 | 理由 |
|---|---|
| 画像20点を `public/` 配下へ（`11.jpg`→`public/11.jpg` 等） | Next.js の静的アセット規約 |

### 削除（`rebrand` ブランチでの削除。`main` には残存）

| ファイル | 理由 |
|---|---|
| `index.html` / `about/index.html` / `contact/index.html` / `thanks/index.html` / `blog/index.html` / `blog/post.html` | Next.js の `app/*/page.tsx` へ置換 |
| `ai-search-google-trend-.png` | JPG 版（`public/ai-search-google-trend-.jpg`）に統一。ただし `.png` は OGP 用に `public/` へ移動して保持 |
| 旧 `netlify.toml`（静的用） | Next.js 用に書き換え |

---

## 16. 残作業と未決定事項

### 優先度：高

| # | 残作業 | 現在の状態 | 着手可能か | 私の回答が必要か | 本番公開前に必須か | 推奨する次の対応 |
|---|---|---|---|---|---|---|
| H1 | `rebrand/nextjs-migration` を GitHub へ push し Netlify Deploy Preview を作成 | 未push | ✅ 可（push 許可の確認のみ） | Yes（push 可否） | ✅ 必須 | まず Preview を作り、全ページ表示とフォーム受信を本番相当で確認 |
| H2 | 問い合わせフォームの Netlify 実受信テスト | 未確認 | Preview 作成後に可 | No | ✅ 必須 | Deploy Preview でテスト送信 → Netlify 管理画面で受信確認 |
| H3 | 現行本番の「グロースプラン ¥39,800」除去（FAQ本文・JSON-LD） | Next.js 版では除去済・**現行本番に残存** | ✅ 可（Next.js 版デプロイで解消） | No | ✅ 必須 | Next.js 版本番公開に含めて解消 |
| H4 | Web集客セットプランの正式名称・料金の確定 | 未確定 | ユーザー確定待ち | **Yes** | セットプランを出すなら必須 | 料金確定 → `lib/site.ts` `PLANS` に追加、`/pricing/` 作成 |
| H5 | Next.js 版の本番デプロイ判断（Netlify 設定を静的→Next.js ビルドに切替） | 未実施 | 承認後に可 | **Yes** | — | Preview 検証 OK 後に切替。ロールバック手順（netlify.toml 戻し＋`main` 再デプロイ）を準備 |

### 優先度：中

| # | 残作業 | 現在の状態 | 着手可能か | 私の回答が必要か | 本番公開前に必須か | 推奨する次の対応 |
|---|---|---|---|---|---|---|
| M1 | リブランド本編：`/services/`・`/services/web-marketing/`・`/services/gbp/`・`/services/website/` 作成 | 未着手 | ✅ 可（確定済み方針の範囲で） | 一部 Yes（コンサル範囲・AI DRIVE 導線） | セット訴求には必要 | 共通データ層整備 → 各ページ作成 |
| M2 | `/pricing/` 作成（横断料金・条件。セット料金は「要相談」で設計） | 未着手 | ✅ 可 | Yes（初期費用・契約期間・解約条件） | — | 確定分＋「要相談」で設計 |
| M3 | `/privacy/`・`/terms/` 作成 | 未着手 | ✅ 可（AI DRIVE の `/privacy/` を土台化） | 一部（掲載可否） | GA4 有効化前に privacy は必須 | プライバシーポリシー先行 |
| M4 | GA4 測定ID の確定・設定（`NEXT_PUBLIC_GA4_ID`） | コード実装済・ID 未設定 | ✅ 可 | **Yes**（`G-E5KY03HZPY` 採用可否） | 計測したいなら必須 | privacy 整備とセットで有効化 |
| M5 | サービス定義の一元化（トップ3種 / about 6種の不一致解消） | 重複あり | ✅ 可 | Yes（正式なサービス区分） | — | `lib/site.ts` に `SERVICES` 集約 |
| M6 | 返信日数の表記統一（トップ「1営業日」/ 他「2営業日」） | 本番のまま（不統一） | ✅ 可 | Yes（どちらに統一） | — | 統一値を `lib/site.ts` へ |
| M7 | 記事 slug の設定（microCMS で各記事に入力） | 未設定（id ベースURL） | ユーザー作業 | No（ユーザーが microCMS で入力） | — | 2記事に slug 入力 → 1:1 リダイレクト追記 |
| M8 | microCMS Webhook → Netlify Build Hook 連携 | 未設計 | Next.js 本番化後に可 | No | — | 記事公開時の自動再ビルド設定 |
| M9 | `npm audit` の 2件（postcss/next） | 未対応 | ✅ 可 | No | 望ましい | `npm audit` 再確認・依存更新の可否検討 |

### 優先度：低

| # | 残作業 | 現在の状態 | 着手可能か | 私の回答が必要か | 本番公開前に必須か | 推奨する次の対応 |
|---|---|---|---|---|---|---|
| L1 | Vercel プロジェクト・旧 Next.js テンプレの整理 | 保留（ユーザー方針） | 本番公開後 | Yes（削除承認） | 不要 | 公開安定後に一覧報告→承認→削除 |
| L2 | `ai-marketing-full.txt` 二重管理の廃止 | 未対応 | ✅ 可 | No | 不要 | Next.js 一本化時に削除 |
| L3 | ヘッダー/フッターのナビ配列の重複解消、`lib/site.ts` `NAV` の活用 | 軽微な重複 | ✅ 可 | No | 不要 | 共通データ層整備時に統合 |
| L4 | CSP ヘッダーの追加検討 | 未設定 | ✅ 可 | No | 不要（推奨） | Next.js `headers()` に段階導入 |
| L5 | 「継続率90%以上」の表記（裏付けありだが詳細非記載の方針） | 本番のまま保持 | — | 済（方針確認済み） | 不要 | 現状維持 |

---

## 17. 総合判定

1. **現在の完成度：約 55%**
   - Step 0 基盤是正：100%／faithful 移植（既存6ページ）：95%（実キー・フォーム実受信の最終確認除く）／microCMS サーバー化・キーローテーション：100%／SEO 基盤（robots・sitemap・構造化データ・canonical）：85%／**リブランド本編（新サービス・料金・メッセージ・AI DRIVE 導線）：0%**／本番公開：0%／視覚レビュー・フォーム実受信：0%
2. **ローカルプレビュー：可能**（`cd grt_meo_picture && npm install && npm run dev` → `http://localhost:3000`。`.env.local` に microCMS 新キー設定済みでブログも実データ表示）
3. **本番公開：技術的には可能だが推奨しない**（`next build` 成功・型/lint クリーン。ただし下記4の理由で時期尚早）
4. **本番公開を止める問題：あり**
   - (a) `rebrand` ブランチが GitHub 未push・Deploy Preview なし・**ユーザーの視覚レビュー未実施**
   - (b) 問い合わせフォームの Netlify 実受信が**本番相当環境で未確認**（CV 直結）
   - (c) Netlify を静的公開→Next.js ビルドへ切替える構成変更が伴い、失敗時は全ページ影響（ロールバック手順は要準備）
   - (d) 現状は「本番の忠実コピー＋ブログ修正」であり**リブランドの中身がまだ無い**。この状態で公開する意義は「基盤の確定」と「ブログ/キー/SEO の修正反映」に限られる
   - (e) `npm audit` 2件、記事 URL が id ベース、GA4/privacy 未整備
5. **次に実施すべき作業（1つだけ）：`rebrand/nextjs-migration` を GitHub に push し、Netlify の Deploy Preview（本番に影響しないプレビューURL）を作成する。** これで全ページ表示・フォーム実受信・構造化データ・パフォーマンスを本番相当で検証できるようになり、以降の判断材料が揃う。
6. **ChatGPT に判断してほしい内容**
   - ① **順序判断**：「Next.js 版を "忠実コピー＋修正" のまま先に本番公開して基盤を確定させる」か、「リブランド本編（新サービスページ・料金・メッセージ）まで仕上げてから一括公開する」か
   - ② セットプラン等の**未確定料金・条件**（初期費用／契約期間／解約条件／セット割引／セットプラン名・金額）を確定するか、「要相談」で進めるか
   - ③ **GA4 測定ID `G-E5KY03HZPY` を正式採用**してよいか（＋プライバシーポリシー整備の要否）
   - ④ 現行本番の残存課題（グロースプラン ¥39,800／robots・sitemap 欠如／セキュリティヘッダー欠如）を、**Next.js 版公開まで待つ**か、**現行静的サイトに個別パッチを当てる**か
   - ⑤ Deploy Preview 作成のための `rebrand/nextjs-migration` の **GitHub push を許可**するか

---

*この報告は 2026-09-09 時点の実測に基づく。「未確認」「未実施」と記した項目は推測で補完していない。*
