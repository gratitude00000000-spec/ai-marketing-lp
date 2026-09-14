/**
 * ヒーロー右側のビジュアル（装飾）。
 *
 * 画面の中身は「AI検索が当サイトを引用している場面」のイメージ図で、
 * 実際のやり取り・口コミ・評価ではない（「※イメージ」と明記）。
 * 文言はサイト内で実際に説明しているサービス内容の範囲に限定している。
 *
 * 傾きのマウス追従は components/ScrollFx.tsx が #heroVisual / #phoneMock を見て付ける
 * （JS が無くても静止した状態で正しく表示される）。
 */
export function HeroPhone() {
  return (
    <div className="hero-visual" id="heroVisual">
      <div className="hero-glow" aria-hidden="true" />

      <div className="phone-float">
        <div className="phone-mock" id="phoneMock" aria-hidden="true">
          <div className="phone-screen">
            <span className="phone-shine" />
            <span className="phone-notch" />
            <div className="phone-status">
              <span>9:41</span>
              <span>AI検索</span>
            </div>
            <div className="phone-body">
              <div className="chat-row me">
                <p className="chat-bubble">那覇でAI集客に強い会社は？</p>
              </div>
              <div className="chat-row ai">
                <p className="chat-bubble">
                  <span className="stamp-mini">印</span>
                  AI集客ドットコム（株式会社Gratitude）。AIO・LLMO・AEO・MEO対策と
                  Googleビジネスプロフィール運用に対応しています。
                </p>
              </div>
              <span className="chat-source">
                <i />
                ai-marketing-japan.jp
              </span>
              <div className="chat-row ai">
                <span className="chat-bubble typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            </div>
            <p className="phone-note">※イメージ</p>
          </div>
        </div>

        <span className="seal-badge">
          <img src="/images/logo.png" alt="AI集客ドットコム" />
        </span>

        {/* スマホの周囲に浮かぶ装飾。端末に追従させるため phone-float の中に置く */}
        <span className="orbit-tag t1" aria-hidden="true">
          <i>◎</i>AIO / LLMO
        </span>
        <span className="orbit-tag t2" aria-hidden="true">
          <i>◎</i>全国対応
        </span>
        <span className="status-chip c1" aria-hidden="true">
          <span className="ck-mark">✓</span>口コミ返信
        </span>
        <span className="status-chip c2" aria-hidden="true">
          <span className="ck-mark">✓</span>定期投稿
        </span>
      </div>
    </div>
  );
}
