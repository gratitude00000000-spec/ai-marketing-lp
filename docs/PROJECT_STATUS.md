# プロジェクト状況 — AI集客ドットコム（ai-marketing-japan.jp）

**確認日:** 2026-09-10
**このファイルの役割:** 現在の事実のみを簡潔に記録する。過去の経緯・判断理由は `DECISIONS.md` と Git 履歴を参照。
**正本ルール:** このファイルは Git 管理された引き継ぎ情報の正本。矛盾時は「本番実測 > Git コード > このファイル」の順で信頼する。

---

## 1. 現在の本番

| 項目 | 値 | 確認方法 |
|---|---|---|
| 本番 URL | `https://ai-marketing-japan.jp` | 固定 |
| 稼働中のもの | **Next.js 版（App Router）が本番稼働中** | — |
| Netlify published deploy | 下記コマンドで確認した値を正とする（記録時点: `6aa2692944f06588af258fe7` / 2026-09-10 08:24 UTC / context production） | `npx netlify api getSite --data '{"site_id":"b620e9ab-586b-4b0c-a182-1b7d20e35d46"}'` の `published_deploy.id` |
| **本番にデプロイされているアプリケーションコードのコミット** | `e45fcd5ec498df58096b6ca72cd2107d6866d9bc`（2026-09-10 の GA4 有効化コミット）。**これは「本番アプリのコミット」であって「現在の `main` の HEAD」ではない** | このファイル（更新は本番デプロイ時のみ） |
| 現在の `main` / `origin/main` の HEAD | **このファイルに固定値で書かない。** セッション開始時に毎回コマンドで確認する | `git rev-parse HEAD` / `git fetch origin && git rev-parse origin/main` |
| Netlify サイト | `gratitude-lp` / site id `b620e9ab-586b-4b0c-a182-1b7d20e35d46` | 固定 |
| GitHub 自動デプロイ | **未設定**（`installation_id:false`）。push しても本番は更新されない | — |
| デプロイ方式 | **Netlify CLI による手動デプロイ**（`npx netlify deploy --prod --build --site b620e9ab-586b-4b0c-a182-1b7d20e35d46 --message "..."`。`main` チェックアウト状態で実行） | — |

> **重要:** このドキュメントや `CLAUDE.md` を `main` にマージすると `main` の HEAD は変わるが、
> **本番アプリのコード（`e45fcd5`）と published deploy は変わらない**（自動デプロイなしのため）。
> ドキュメントだけを `main` にマージした場合、`main` の HEAD ≠ 本番アプリのコミット になる。
> 「本番に今どのコードが出ているか」を知りたいときは、上表の
> 「本番にデプロイされているアプリケーションコードのコミット」＋ Netlify API の `published_deploy.id` を見る。
> `git rev-parse origin/main` の結果を「本番のコード」と誤解しない。

---

## 2. ロールバック

| 項目 | 値 |
|---|---|
| 旧静的サイトの deploy | `6aa1641c214671978323a274`（2026-09-09 13:50、context production、state ready で保持） |
| 復旧方法 | ① Netlify 管理画面 → Deploys → 当該 deploy の「Publish deploy」／ ② `npx netlify api restoreSiteDeploy --data '{"site_id":"b620e9ab-586b-4b0c-a182-1b7d20e35d46","deploy_id":"6aa1641c214671978323a274"}'` |
| 前提条件 | **復旧前に、Netlify API で現在の `published_deploy.id` を確認する**こと。**ユーザーの承認なしにロールバックしない** |
| 補足 | 本番アプリのコミット（記録時点 `e45fcd5`）を `git archive <commit> \| tar` でクリーン書き出し → `npx netlify deploy --prod --dir=` でも旧状態を作り直せる |

---

## 3. 現在稼働中の機能

| 機能 | 状態 |
|---|---|
| Next.js App Router（SSG 中心、ブログのみ ISR `revalidate=600`） | ✅ |
| microCMS ブログ（記事2本） | ✅ 一覧・詳細とも本番公開済み |
| `LEGACY_SLUGS`（`cms/types.ts`）で既存2記事の URL をコード側固定 | ✅ |
| 旧記事 URL 6 パターン → 新 slug へ 308（`middleware.ts`） | ✅ |
| robots.txt（`app/robots.ts`） | ✅ `Disallow: /api/` のみ |
| sitemap.xml（`app/sitemap.ts`） | ✅ 7 URL（静的5 + 記事2） |
| canonical（全ページ絶対 URL・本番ドメイン） | ✅ |
| JSON-LD（SSG HTML に inline 出力） | ✅ Organization / WebSite / FAQPage / BreadcrumbList / Article |
| Netlify Forms（`contact`、POST 先 `/__forms.html`） | ✅ 実受信確認済み。累計 6 件（テスト送信は削除済み） |
| `/thanks/` の meta robots | ✅ `noindex, nofollow`（ページ側 meta。robots.txt では遮断しない） |
| プライバシーポリシー（`/privacy/`） | ✅ `index, follow` |
| セキュリティヘッダー（`next.config.mjs`） | ✅ X-Content-Type-Options / X-Frame-Options=SAMEORIGIN / Referrer-Policy / Permissions-Policy（HSTS は Netlify 付与） |
| GA4 | ✅ 有効（下記 §4） |
| Search Console | ✅ 設定済み（下記 §5） |

---

## 4. GA4

| 項目 | 値 |
|---|---|
| 状態 | **有効** |
| 測定 ID | `G-E5KY03HZPY` |
| 駆動方法 | `NEXT_PUBLIC_GA4_ID`（Netlify 環境変数）→ `analytics/GA4.tsx` が gtag を読み込み |
| 本番での確認 | 本番 HTML で gtag 読み込み確認済み。`_ga` / `_ga_E5KY03HZPY` Cookie 生成・collect 到達を確認 |
| 計測イベント | `page_view`（自動）／`line_click`／`phone_click`／`cta_click`／`form_submit`（`analytics/events.ts`、各 client コンポーネントで発火） |
| GA4 プロパティ名 | 「AI DRIVE」（GA アカウント「Gratiutde PC」内）。**名称変更が残作業** |
| キーイベント設定 | **未完了** |
| DebugView 確認 | **未確認**（GA 管理画面へのアクセスはユーザー作業） |

---

## 5. Search Console

| 項目 | 状態 |
|---|---|
| プロパティ種別 | ドメインプロパティ（`sc-domain:ai-marketing-japan.jp`） |
| 所有権認証 | ✅ 完了。エックスドメインの DNS に TXT レコード（`google-site-verification=…`、**値は非記載**）を追加済み |
| サイトマップ送信 | ✅ `https://ai-marketing-japan.jp/sitemap.xml` を送信済み。7 URL 検出・正常処理 |
| インデックス登録リクエスト | ✅ 主要4 URL（`/`、`/blog/`、`/blog/ai-era-seo-meo-guide/`、`/blog/what-is-ai-marketing/`）を申請済み |
| 旧 ID URL | 申請していない（308 転送元のため対象外） |

---

## 6. microCMS・ブログ

| 項目 | 内容 |
|---|---|
| API キー | **GET 専用**（PATCH/DELETE 不可）。値は `.env.local` のみ・**このファイルに記載しない** |
| SEO グループのスラッグ用フィールド ID | `slug` ではなく **`slag`**（スペル誤り。現時点で変更しない） |
| 既存2記事 | `qln47wv3gx` → `/blog/ai-era-seo-meo-guide/`／`yk421h0dsqw` → `/blog/what-is-ai-marketing/`。`cms/types.ts` の `LEGACY_SLUGS` で URL 固定 |
| CMS 側の slug 入力 | 任意（コードが URL の正）。新規記事は `seo.slag` に英数字を入れれば `blogSlug()` が拾う |
| 旧記事 URL の転送 | `/blog/post.html?id=…`・`/blog/<id>`・`/blog/<id>/`（各2記事＝6 パターン）を `middleware.ts` で 308（1 ホップ・クエリ除去） |
| 既存2記事のバックアップ | `02_AI集客LP/_backups/microcms-blogs-20260910/`（ローカル） |

---

## 7. robots・sitemap

| 項目 | 現仕様 |
|---|---|
| robots.txt | `Disallow: /api/` のみ。`Sitemap: https://ai-marketing-japan.jp/sitemap.xml` |
| `/_next/`・`/thanks/` | **robots.txt で遮断しない**（`/_next/` は Google のレンダリングに必要、`/thanks/` はページ側 meta の noindex を Google に読ませるため） |
| `/thanks/` の noindex | ページの `<meta name="robots" content="noindex, nofollow">` |
| sitemap 静的5 URL | `<loc>` のみ。**不正確な lastmod は付けない**（再デプロイで日付が動くのを防ぐため）。changefreq/priority も付けない |
| sitemap 記事2 URL | `lastmod` = microCMS の `updatedAt` |

---

## 8. プライバシーポリシー（`/privacy/`）

| 項目 | 内容 |
|---|---|
| 公開状態 | ✅ 公開済み・`index, follow`・canonical `https://ai-marketing-japan.jp/privacy/` |
| 制定・最終改定日 | 2026-09-10 |
| 記載している外部サービス | Netlify（ホスティング＋Netlify Forms、国外処理の可能性）／Google（メール受信・返信、Google Fonts、GA4）／microCMS（ブログ配信、問い合わせ情報とは非連携） |
| GA4 の記載 | 第6項に、解析 Cookie 使用・取得する統計情報・Google 送信/国外処理・IP 非記録・Google ポリシー/データ利用/オプトアウトのリンク・Cookie 無効化方法 |
| フォームの同意 | 送信前に同意チェックボックス（`required`）。同意項目 `privacy-agree` は Netlify Forms へ送信しない |
| 推測で記載していない項目 | 保存期間、第三者提供の実態、Netlify/Google/microCMS 以外の委託先、問い合わせ窓口責任者 |

---

## 9. 未完了・未確定事項（残タスク）

### リブランド本編（サービス構成・料金の確定待ち）
- リブランド後のトップ訴求・構成の刷新
- サービス詳細ページ（`/services/*`：AI集客支援 / GBP運用 / HP制作 / コンサル）
- `/pricing/` の作成
- 正式な料金・契約条件（初期費用・最低契約期間・解約条件）の確定

### 運用・計測
- 返信日数の表記を「2営業日以内」に統一（トップの LINE 相談ボックスが「1営業日以内」のまま）
- GA4 プロパティ名の変更（「AI DRIVE」→ AI集客ドットコム 等）
- GA4 キーイベント設定（`form_submit` をコンバージョン化 等）
- GA4 DebugView / リアルタイムでの発火確認
- microCMS 更新 → 本番反映の方式確認（現在は ISR `revalidate=600` のみ。Webhook → Build Hook は未設定）
- GitHub 自動デプロイ導入の判断

### ドキュメント・確認
- プライバシーポリシーの保存期間等の確認（未確認事項の穴埋め）
- Search Console のインデックス状況の確認（申請後 1〜2 週間）

---

## 10. 次回セッションの開始位置

**コード制作を始める前に、次を確定する（ユーザー判断）:**

1. リブランド後のサービス構成
2. 料金プラン
3. 初期費用
4. 最低契約期間
5. 解約条件
6. `/pricing/` の掲載内容
7. GA4 の計測イベント（追加するもの）

---

## 11. 現在行ってはいけないこと

- 未確定の料金・契約条件を本番に公開する
- リブランド内容を推測で実装する
- API キー・PAT・トークンを MD／コードへ記録する
- ユーザーの承認なしに本番デプロイ・`main` マージ・`origin/main` への push を行う
- ユーザーの承認なしに GA4 測定 ID を変更する
- microCMS の `slag` フィールドを勝手に `slug` へリネームする
- DNS の A レコードを変更する

---

## 12. バックアップ・退避先（参考）

| 対象 | 場所 |
|---|---|
| 旧履歴（Git） | GitHub のブランチ `sync/production-20260909` / `archive/github-main-a7cbb11` / `archive/local-worktree-20260909`、タグ `backup/pre-step0-local-f9ab383` / `backup/github-main-a7cbb11` |
| Step 0 ローカルバックアップ | `02_AI集客LP/_backups/step0_20260909/`（本番ミラー・git bundle 3本・作業ツリー tgz、約 342MB） |
| 既存2記事の CMS バックアップ | `02_AI集客LP/_backups/microcms-blogs-20260910/` |
