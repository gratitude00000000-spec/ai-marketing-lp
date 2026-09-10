# 設計判断ログ — AI集客ドットコム（ai-marketing-japan.jp）

**運用ルール（追記型）**
- このファイルは**追記のみ**。過去の判断を削除・上書きしない。
- 判断が変わったら、**新しい日付の見出しで**「変更」「廃止」「置換」を明記して追記する。
- 各エントリは「判断 / 理由 / 不採用にした方法 / 将来変更するときの注意」を書く。
- 現在の本番状態は `PROJECT_STATUS.md`、時系列の作業は Git コミット履歴を参照。

---

## 2026-09-09

### D-001 静的 HTML から Next.js（App Router）へ移行
- **判断:** 本番の静的 HTML 6 ページを Next.js 15 App Router へ作り直す。
- **理由:** microCMS API キーがブログ HTML に平文で露出していた／SEO 基盤（robots・sitemap・canonical・構造化データ・セキュリティヘッダー）が未整備／今後のリブランドで動的なコンテンツ管理が必要。
- **不採用:** 静的 HTML のまま個別パッチを当て続ける案（キー隠蔽・SEO 整備が根本解決にならない）。
- **将来の注意:** デザイン・文言は移行時点では本番のまま（忠実移植）。リブランドは別フェーズ。

### D-002 リブランド本編より先に「忠実移植版」を本番公開する
- **判断:** 新サービス・料金・訴求を作り込む前に、忠実移植＋修正（キー隠蔽・SEO・リダイレクト・プライバシー・GA4）だけを先行して本番公開する。
- **理由:** 基盤（Next.js 稼働・URL 体系・計測）を先に確定させ、以降の作業の土台と検証環境を揃えるため。
- **不採用:** リブランド本編まで一括で仕上げてから公開する案（公開までの期間が長く、基盤の問題発見が遅れる）。
- **将来の注意:** 公開済みなのはあくまで「旧サイトの忠実コピー＋修正」。サービス内容・料金の刷新は未着手。

### D-003 公開ページは基本的に静的生成（SSG）
- **判断:** 全ページ SSG。ブログ一覧・記事詳細・sitemap のみ ISR（`revalidate = 600` 秒）。
- **理由:** 表示速度・安定性・ホスティングコスト。CMS 記事の更新頻度は低く 10 分の再生成で十分。
- **不採用:** 全ページ SSR（不要な関数実行・コールドスタート）。
- **将来の注意:** 記事公開直後に反映したい場合は microCMS Webhook → Netlify Build Hook を追加検討（未設定）。

### D-004 動的処理は必要な機能だけに限定する
- **判断:** サーバー処理は「microCMS 取得（サーバーコンポーネント）」「旧 URL リダイレクト（middleware）」に限定。API Route は作らない。
- **理由:** 攻撃面・保守対象を最小化。フォームは Netlify Forms に委譲。
- **不採用:** 独自 API Route 経由でのフォーム送信・下書きプレビュー（現時点で不要）。
- **将来の注意:** 下書きプレビューが必要になったら API Route ＋ draftKey を追加（要 microCMS キー権限見直し）。

### D-005 microCMS API キーを GET 専用（最小権限）に変更
- **判断:** 旧キーを失効させ、GET のみ許可の新キー（`nextjs-server`）を発行して `.env.local` / Netlify 環境変数で使う。
- **理由:** サイトは記事の閲覧しかしない。書き込み権限は不要でリスクのみ。
- **不採用:** 従来の POST/PATCH 込みキーを継続使用。
- **将来の注意:** 記事を API から投稿・更新する運用に変えるときは、別途書き込み用キーを発行する（GET 専用キーは触らない）。無料プランはキー 1 個までのため置き換え方式になる。

### D-006 microCMS API キーはサーバー側だけで使用する
- **判断:** `lib/microcms.ts` に `import 'server-only'` を付け、`MICROCMS_API_KEY`（`NEXT_PUBLIC_` を付けない）で読む。
- **理由:** クライアントバンドルへの混入を型・ビルドレベルで防止。
- **不採用:** `NEXT_PUBLIC_` プレフィックス付き環境変数／クライアントからの直接 fetch。
- **将来の注意:** ブラウザから microCMS を叩く実装を足さない。足す場合は別の公開可能キー設計を検討。

### D-007 Netlify Forms の送信先を `/__forms.html` にする
- **判断:** フォームの `fetch` POST 先と `<form action>` を `/` ではなく静的パス `/__forms.html` にする。`public/__forms.html` にフォーム定義を複製（ビルド時検出用）。
- **理由:** ルート `/` への POST は Next.js の SSR 関数が横取りし、Netlify Forms のハンドラに届かず送信が記録されなかった（実測で確認）。静的パスなら確実に捕捉される。
- **不採用:** `/` への POST（不達）。
- **将来の注意:** フォーム項目を変更したら `components/ContactForm.tsx` と `public/__forms.html` を 1:1 で揃える。同意チェック `privacy-agree` は `__forms.html` に載せない（Netlify へ送らない）。

---

## 2026-09-10

### D-008 既存2記事の URL を `LEGACY_SLUGS`（コード側）で固定する
- **判断:** `cms/types.ts` の `LEGACY_SLUGS` で `qln47wv3gx` → `ai-era-seo-meo-guide`、`yk421h0dsqw` → `what-is-ai-marketing` を固定。`blogSlug()` はこのマップを最優先。
- **理由:** この2記事には旧 URL から 1:1 リダイレクトを張っており、公開後にスラッグが変わると被リンク・インデックスが切れる。URL の恒久性を CMS フィールドの記入に依存させたくない。加えて CMS 側のフィールド ID が誤スペル（`slag`）。
- **不採用:** microCMS の `seo.slag` に値を入れて CMS を URL の正とする案（方針 A としてユーザーが不採用。CMS スキーマは触らない）。
- **将来の注意:** 新規記事はこのマップに追加しない（CMS の `seo.slag` に英数字を入れれば拾う）。この2記事の URL を変えるときは `LEGACY_SLUGS`・`middleware.ts`・リダイレクト・Search Console を揃えて対応。

### D-009 microCMS の `slag` フィールドを現時点で `slug` に直さない
- **判断:** SEO グループ内フィールド ID の誤スペル `slag` はそのまま。コード側は `seo.slug` と `seo.slag` の両方を参照する。
- **理由:** 方針 A（CMS スキーマ・記事データを触らない）。リネームは既存データ移行を伴い事故リスクがある。実害は「コードが両方見る」ことで吸収できている。
- **不採用:** 管理画面でフィールド ID を `slug` にリネーム。
- **将来の注意:** リネームする場合はユーザー承認必須。リネーム後 `cms/types.ts` の `slag` 参照を削除してよい。

### D-010 旧 URL リダイレクトを `middleware.ts` に集約する
- **判断:** 旧ブログ URL の 1:1 リダイレクトを `next.config.mjs` の `redirects()` ではなく `middleware.ts` で処理する。
- **理由:** `next.config` の `redirects()` は middleware より前（ルーティング step 2）に走り、かつ未使用のクエリ文字列を転送先へ引き継ぐ（`/blog/post.html?id=xxx` → `/blog/<slug>/?id=xxx` になるのを実測）。`has` + 名前付きキャプチャでも解消できなかった。middleware で `NextResponse.redirect` にクリーンな URL を渡すと 308・クエリ除去・1 ホップを保証できる。
- **不採用:** `next.config.mjs` の `redirects()` での 1:1 リダイレクト。
- **将来の注意:** `middleware.ts` の `LEGACY_ARTICLES` と `cms/types.ts` の `LEGACY_SLUGS` を対で維持する。

### D-011 リダイレクトは 301 ではなく 308 を使う
- **判断:** 恒久リダイレクトは 308（Next.js の `permanent: true` / middleware の `NextResponse.redirect(url, 308)`）。報告上も「308 恒久リダイレクト」と表記する。
- **理由:** Next.js の恒久リダイレクトは 301 ではなく 308 を返す。308 は 301 と違いメソッドとボディを保持する恒久リダイレクトで、GET には実質同等。実装に合わせた正確な表記にする。
- **不採用:** 無理に 301 を返す実装（Next.js の標準から外れる）。
- **将来の注意:** SEO 上 308 でも旧 URL の評価は新 URL に引き継がれる。ドキュメントで「301」と書かない。

### D-012 robots.txt から `/_next/` と `/thanks/` を除外しない
- **判断:** robots.txt の `Disallow` は `/api/` のみ。`/_next/` と `/thanks/` はクロール可能にする。
- **理由:** `/_next/` には Google がページを描画・理解するのに必要な CSS/JS が含まれる。`/thanks/` を robots.txt で遮断すると Google がページ内の `noindex` を読めない。
- **不採用:** `Disallow: /_next/`・`Disallow: /thanks/`（レンダリング阻害・noindex 未認識）。
- **将来の注意:** `/api/` は現在公開 API を持たないが将来に備えて残置。API Route を足すときは公開可否に応じて見直す。

### D-013 `/thanks/` は robots.txt ではなくページ側 meta で noindex にする
- **判断:** `/thanks/` の非インデックス化は `<meta name="robots" content="noindex, nofollow">`（`app/thanks/page.tsx` の `metadata.robots`）で行う。
- **理由:** D-012 の通り、robots.txt で遮断すると noindex 自体が読まれない。meta ならクロールさせたうえで確実に除外できる。
- **不採用:** robots.txt での `Disallow: /thanks/`。
- **将来の注意:** 送信完了以外にインデックス不要なページを足すときも同じ方式（meta noindex ＋ robots.txt では遮断しない）。

### D-014 sitemap の静的ページから不正確な lastmod を削除する
- **判断:** `app/sitemap.ts` で静的5 URL は `<loc>` のみ出力（`lastModified` を付けない）。`changefreq` / `priority` も付けない。記事2 URL のみ `lastmod` = microCMS `updatedAt`。
- **理由:** `lastModified: new Date()` だとビルド／再デプロイのたびに日付が動き、内容を変えていないのに「更新扱い」になる。正確な重要更新日を継続管理できるようになるまでは出さないほうが良い。`changefreq` / `priority` は Google が使用しない。
- **不採用:** 全 URL に `new Date()` の lastmod ＋ changefreq/priority を機械的に付ける。
- **将来の注意:** 静的ページの正確な更新日を管理できる仕組みができたら lastmod を戻してよい。
- **2026-09-10 追記:** 当初この判断は親 CLAUDE.md の「初期SEO純正装備」テンプレート（全URLに `new Date()`）からの逸脱だったが、親 CLAUDE.md 側を「lastModified は正確に取得できる URL だけ／静的ページは省略可／changeFrequency・priority は任意」に更新したため、現在は親テンプレートと整合。

### D-015 運営会社の構造化データは `LocalBusiness` ではなく `Organization` を使う
- **判断:** 会社の JSON-LD は `Organization`。`LocalBusiness`（`ProfessionalService`）は使わない。
- **理由:** 株式会社Gratitude は来店型の営業所として一般顧客を受け付けているわけではなく、全国対応の Web 集客支援サービス。`LocalBusiness` は来店型ビジネス向けの type。
- **不採用:** `LocalBusiness` / `ProfessionalService`（実態と合わない）。
- **将来の注意:** 住所は E-E-A-T（実在性）目的で `Organization.address` に記載する。来店受付を始めるなら `LocalBusiness` を再検討。

### D-016 根拠のない `priceRange` を構造化データから削除する
- **判断:** JSON-LD から `priceRange: '¥¥'` を削除（`LocalBusiness` 削除に伴い消滅）。
- **理由:** 根拠のない値。存在しない情報を構造化データに入れない。
- **不採用:** 概算表記としての `priceRange` 残置。
- **将来の注意:** 料金体系が確定しても、確度の高い数値以外は構造化データに入れない。

### D-017 JSON-LD を `next/script` ではなく素の `<script>` で SSG HTML に直接出力する
- **判断:** `<script type="application/ld+json" dangerouslySetInnerHTML=…>` を各ページで直接出力する（`next/script` を使わない）。
- **理由:** `next/script`（afterInteractive）は構造化データを `__next_s` 経由でクライアント注入するため、JS を実行しない AI クローラ等が読めなかった。SSG HTML に inline されていれば確実に読まれる。
- **不採用:** `next/script` での JSON-LD 出力。
- **将来の注意:** 新しいページの JSON-LD も素の `<script>` で出す。

### D-018 PostCSS を `overrides` で安全なバージョンに固定する
- **判断:** `package.json` に `"overrides": { "postcss": "^8.5.28" }` を追加。
- **理由:** `npm audit` の 2 件（postcss の XSS / ファイル読み取り系、next が脆弱版に依存）を、Next.js のメジャーアップなしで解消するため。結果 `npm audit` 0 件。
- **不採用:** `npm audit fix --force`（next@16 への強制メジャーアップを伴う）。
- **将来の注意:** Next.js を正規にアップグレードするタイミングで override が不要になれば外す。override 追加時は必ず lint / type-check / build を通す。

### D-019 Next.js 16 への強制アップグレードは行わない
- **判断:** `npm audit fix --force` が示す `next@16` へのメジャーアップは実施しない。安全に更新できる範囲（override 等）でのみ対応する。
- **理由:** メジャーアップは App Router の破壊的変更・検証コストが大きい。当プロジェクトの実リスクはビルド時限定で低い。
- **不採用:** `next@16` への即時アップグレード。
- **将来の注意:** アップグレードするときは専用のブランチで、全ページ・middleware・ISR・Netlify plugin の互換を検証してから。

### D-020 プライバシーポリシー（`/privacy/`）を公開する
- **判断:** フォームで氏名・メール・電話等を取得しているため、GA4 有効化の前に `/privacy/` を作成・公開する。フォーム付近に利用目的表示、送信前の同意チェック（`required`、JS 無効時も有効）を設ける。
- **理由:** 個人情報を取得するフォームを公開している以上、利用目的の明示と同意取得が必要。
- **不採用:** GA4 有効化のタイミングまでプライバシーポリシーを後回しにする案。
- **将来の注意:** GA4 を有効化したので第6項は「GA4 利用・解析 Cookie 使用」を記載済み。外部サービスを追加・変更したら第4項・第6項を更新する。

### D-021 未確認情報を推測でプライバシーポリシーに記載しない
- **判断:** フォームデータの保存期間、第三者提供の実態、他の委託先、問い合わせ窓口責任者は、正式に確認できるまで記載しない。
- **理由:** 法的な断定ではなく、実際の運用内容を説明するページにする方針。誤記載は避ける。
- **不採用:** 一般的なひな型からの推測補完。
- **将来の注意:** 運用が固まったら該当項目を追記する。

### D-022 GitHub 自動デプロイは後工程で判断する
- **判断:** 当面は Netlify CLI の手動デプロイを継続。GitHub App 連携（自動デプロイ）は導入しない。
- **理由:** 手動でデプロイタイミングを制御でき、承認フローと相性が良い。自動化のメリットが必要になる段階ではない。secret 環境変数の扱いはクラウドビルド前提のため、手動運用の間は通常環境変数のまま。
- **不採用:** 現時点での GitHub 連携自動デプロイ有効化。
- **将来の注意:** 導入するとブランチ push で本番が更新されるようになる。導入時は `MICROCMS_API_KEY` の secret 化、デプロイ承認フローの再設計をセットで行う。ユーザー承認必須。

### D-023 Git 管理された MD を引き継ぎ情報の正本にする
- **判断:** プロジェクトの現況・判断・ルールは、Claude Code のローカルメモリではなく、このリポジトリ内の `CLAUDE.md` / `docs/PROJECT_STATUS.md` / `docs/DECISIONS.md`（Git 管理・GitHub push 済み）を正本とする。
- **理由:** ローカルメモリ（`~/.claude/.../memory/`）は Git 管理外・バックアップなしで、端末故障や削除で失われる。実際に唯一の Git 管理状況ドキュメントが 1 日で陳腐化し、ローカルメモリ内に GA4 の記述矛盾が発生していた。
- **不採用:** ローカルメモリを主たる引き継ぎ手段にし続ける案。
- **将来の注意:** ローカルメモリ（`MEMORY.md` / `rebrand-phase1.md` / `project_hosting.md`）は「詳細は Git 管理 MD を参照」に軽量化して補助的に維持する。セッション終了時の更新先はまず `docs/PROJECT_STATUS.md`。
