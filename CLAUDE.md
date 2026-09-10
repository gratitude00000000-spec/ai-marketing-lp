# AI集客ドットコム（ai-marketing-japan.jp）— リポジトリ固有の指示

このファイルは **AI集客ドットコム固有の指示**です。全HP共通方針は親ディレクトリの
`../../CLAUDE.md`（`/Users/user/Desktop/AI marketing/CLAUDE.md`）を参照します。
重複する共通ルール（SEO・AIO/LLMO・UX・CRO・セキュリティ一般・microCMS一般運用・
コード品質・公開前チェック等）はここには記載しません。
**親の指示と矛盾を発見した場合は、作業を進めずユーザーへ報告してください。**

現在の本番状態・Git状態・残タスクは次の2ファイルに集約しています（起動時に自動で読み込まれます）。

@docs/PROJECT_STATUS.md
@docs/DECISIONS.md

---

## 情報の正本（信頼する順番）

MDと実際のコード・本番が矛盾したときは、**勝手に判断せず、実測結果をユーザーへ報告する**こと。

1. 現在の本番環境の実測結果（`curl` / Netlify API の getSite 等）
2. 現在チェックアウトしている Git コード
3. `docs/PROJECT_STATUS.md`
4. `docs/DECISIONS.md`
5. Git コミット履歴
6. Claude Code のローカルメモリ（`~/.claude/.../memory/`）
7. 過去の会話履歴

Claude Code のローカルメモリは**補助**であり、正本ではない。正本はこのリポジトリ内の
Git 管理 MD（本ファイル・`docs/PROJECT_STATUS.md`・`docs/DECISIONS.md`）とする。

---

## セッション開始時に必ず行うこと

1. この `CLAUDE.md` を読む
2. `docs/PROJECT_STATUS.md` を読む
3. `docs/DECISIONS.md` を読む
4. 現在のブランチ・HEAD・作業ツリーの状態を確認（`git status` / `git rev-parse HEAD`）
5. `origin/main` との差分を確認（`git fetch origin && git log --oneline origin/main..HEAD`）
6. 本番に関係する作業では、現在の Netlify published deploy を確認
   （`npx netlify api getSite --data '{"site_id":"b620e9ab-586b-4b0c-a182-1b7d20e35d46"}'`）
7. `docs/PROJECT_STATUS.md` の「確認日」が古い場合は、コード・本番・Git で再確認してから進める

---

## セッション終了時に `docs/PROJECT_STATUS.md` を更新する条件

次のいずれかが起きたら、作業を終える前に `docs/PROJECT_STATUS.md` を現在の事実に合わせて更新する。

- 本番 deploy が変わった
- `main` の HEAD が変わった
- GA4 など外部サービスの稼働状態が変わった
- Search Console など外部設定が変わった
- 機能が追加・削除された
- 残タスクが完了した／次回開始位置が変わった
- 本番公開・ロールバックを行った
- 新しい重要な未確定事項が発生した

設計判断が新しく確定・変更されたら `docs/DECISIONS.md` にも**追記**する（過去の判断は削除・上書きしない。
変わった場合は新しい日付で「変更」「廃止」「置換」を追記）。

単なる文章修正や小さなコード整理でプロジェクト状態が変わらない場合は、無理に MD を更新しない。

---

## 本番操作（ユーザーの明示承認が必要）

以下はユーザーがその作業を明示的に承認した場合のみ実行する。承認は作業ごと・セッションごと。

- `main` へのマージ
- `origin/main` への push
- `npx netlify deploy --prod`（本番デプロイ）
- Netlify published deploy の復元（ロールバック）
- GA4 の有効化・停止・測定 ID 変更
- DNS の変更
- microCMS のスキーマ変更・記事変更
- API キーの作成・権限変更・削除
- Git 履歴の書き換え
- force push
- GitHub 自動デプロイの設定
- 料金・サービス内容の変更

---

## 秘密情報の取り扱い

- API キー・PAT・アクセストークン・パスワード・Cookie を **MD・コード・Git に書かない**。
- 秘密情報は `.env.local`（Git 管理外）または Netlify の環境変数で管理する。
- 秘密情報の値を回答・ログ・コミット差分に表示しない。
- `.env.local` を `git add` しない（`.gitignore` の `.env*.local` で除外済み）。
- 秘密情報を発見しても値を回答に表示しない（ファイル名・影響・対応のみ報告）。
- 失効済みの旧 microCMS キーが過去コミットに含まれるが、**履歴書き換え（filter-repo 等）はユーザーの個別承認なしに行わない**。

---

## このプロジェクト固有の事実（変更時は承認が必要）

| 項目 | 値・ルール |
|---|---|
| 本番 URL | `https://ai-marketing-japan.jp`（**www なし**） |
| ホスティング | Netlify。サイト名 `gratitude-lp`、site id `b620e9ab-586b-4b0c-a182-1b7d20e35d46` |
| デプロイ方式 | **Netlify CLI による手動のみ**。GitHub 自動デプロイは未設定（`installation_id:false`）。push しても本番は更新されない |
| 本番デプロイコマンド | `npx netlify deploy --prod --build --site b620e9ab-586b-4b0c-a182-1b7d20e35d46 --message "..."`（`main` をチェックアウトした状態で実行） |
| ロールバック先 | 旧静的サイト deploy `6aa1641c214671978323a274`。復旧前に現 published deploy を確認し、ユーザー承認を得てから実行 |
| DNS | エックスドメイン（Xdomain）管理。A レコード `75.2.60.5`（Netlify）。**A レコードは変更しない** |
| microCMS | API キーは **GET 専用**（PATCH/DELETE 不可）。値は `.env.local` のみ。SEO グループ内のスラッグ用フィールド ID は `slug` ではなく **`slag`**（スペル誤り）。勝手に `slug` へリネームしない |
| ブログ URL | 既存2記事（`qln47wv3gx` / `yk421h0dsqw`）は `cms/types.ts` の `LEGACY_SLUGS` でコード側に URL 固定。CMS 側の `seo.slag` 入力は任意。旧記事 URL 6 パターンは `middleware.ts` で 308 転送 |
| GA4 | **有効**。測定 ID `G-E5KY03HZPY`。`NEXT_PUBLIC_GA4_ID`（Netlify 環境変数）で駆動。測定 ID は勝手に変更しない |
| 料金 | Web 集客セットプランの正式料金・契約条件は**未確定**。未確定の料金・プランを本番に公開しない。`lib/site.ts` の `PLANS` に推測値を追加しない |
| リブランド本編 | サービス詳細ページ・`/pricing/` は未着手。内容を推測で実装しない（サービス構成・料金の確定待ち） |

---

## 現在行ってはいけないこと

- 未確定の料金・契約条件を本番に公開する
- リブランド内容（サービスページ・訴求・料金体系）を推測で実装する
- API キー・PAT・トークンを MD／コード／Git に記録する
- ユーザーの承認なしに本番デプロイ・`main` マージ・`origin/main` への push を行う
- ユーザーの承認なしに GA4 測定 ID を変更する
- microCMS の `slag` フィールドを勝手に `slug` へリネームする
- DNS の A レコードを変更する
