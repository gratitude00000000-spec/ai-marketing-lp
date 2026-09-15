'use client';

import { useEffect, useRef, useState } from 'react';
import type { Plan } from '@/lib/site';

/**
 * 料金プラン表示。
 *
 * PC(761px以上)は従来どおりの静止グリッド。
 * スマホ(760px以下)だけ、同じDOM・同じテキストのまま CSS の
 * scroll-snap で横スワイプカルーセルに見せる（JS 不要で全文閲覧・
 * スワイプ操作が可能。JS はアクティブカードの拡大演出とボタン／
 * ドットのクリック操作だけを追加するプログレッシブエンハンスメント）。
 *
 * 「詳しく見る」は <details>/<summary> のネイティブ開閉を使用。
 * JS 無効でもキーボード操作でも開閉でき、閉じていても検索エンジンは
 * 内容を読み取れる。PC では CSS 側で常に展開表示に固定する。
 *
 * 注意: カードの is-active/is-before/is-after は JSX の className では
 * なく useEffect で classList を直接操作している。ScrollFx.tsx が
 * [data-anim] 要素へ classList.add('is-in') を外部から直接付与するため、
 * このコンポーネントが再レンダーのたびに className 文字列を再計算すると
 * React がその外部付与クラスを消してしまう（再フェード・再ぼかしされて
 * 見える不具合の原因になった）。className を状態非依存の固定値にし、
 * 可変クラスだけ imperative に付け外しすることでこれを回避している。
 */
export function PricingPlans({ plans }: { plans: Plan[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const initialIndex = Math.max(
    0,
    plans.findIndex((p) => p.featured),
  );
  const [active, setActive] = useState(initialIndex);

  // アクティブカードの切り替え（is-active/is-before/is-after）は
  // classList を直接操作し、JSX の className 再計算を通さない。
  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.classList.remove('is-active', 'is-before', 'is-after');
      el.classList.add(i === active ? 'is-active' : i < active ? 'is-before' : 'is-after');
    });
  }, [active]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // 最初に「おすすめ」プランを中央へ。scrollIntoView は反映が非同期
    // になるブラウザがあり、その場合 IntersectionObserver の最初の
    // コールバックがスクロール前（1枚目が見えている）のレイアウトを
    // 拾ってしまう。scrollLeft を直接計算して同期的に設定することで
    // observe() を呼ぶ時点で確実に中央寄せを終わらせておく。
    const initialEl = cardRefs.current[initialIndex];
    if (initialEl) {
      track.scrollLeft = initialEl.offsetLeft + initialEl.offsetWidth / 2 - track.clientWidth / 2;
    }
    track.classList.add('is-ready');

    // それでも最初のコールバックは基準状態の確定として扱うだけにし、
    // 「スワイプ→」ヒントを消す判定には使わない（2回目以降＝実際に
    // ユーザーが動かした結果とみなす）。
    let settled = false;
    const io = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { idx, ratio: entry.intersectionRatio };
          }
        }
        if (best && best.ratio > 0.55) {
          if (settled) track.classList.add('is-swiped');
          settled = true;
          setActive(best.idx);
        }
      },
      { root: track, threshold: [0.25, 0.55, 0.75, 0.95] },
    );
    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(plans.length - 1, idx));
    const el = cardRefs.current[clamped];
    if (!el) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div className="plans-carousel">
      <div className="plans plan-track" ref={trackRef}>
        {plans.map((plan, i) => {
          const mainFeats = plan.feats.slice(0, 3);
          const moreFeats = plan.feats.slice(3);
          return (
            <div
              className={`plan${plan.featured ? ' feat' : ''}`}
              key={plan.name}
              data-anim="blur"
              data-idx={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              {plan.featured && <div className="plan-badge">おすすめ</div>}
              {plans.length > 1 && (
                <span className="plan-swipe-hint" aria-hidden="true">
                  スワイプ<i>→</i>
                </span>
              )}
              <div className="plan-ico">
                <img loading="lazy" src={plan.icon} alt={plan.name} />
              </div>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                {plan.price} {plan.priceSmall && <small>{plan.priceSmall}</small>}
              </div>
              <div className="plan-tax">{plan.tax ?? ' '}</div>
              <p className="plan-desc">{plan.desc}</p>
              <ul className="plan-feats">
                {mainFeats.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              {moreFeats.length > 0 && (
                <>
                  {/* PC: 従来どおり1本のリストとして常時表示（下の詳細開閉と排他表示） */}
                  <ul className="plan-feats plan-feats-desktop-more">
                    {moreFeats.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  {/* スマホ: ネイティブ details/summary で開閉。JS 不要・
                      キーボード操作可・閉じていても検索エンジンは読み取れる */}
                  <details className="plan-more">
                    <summary>
                      詳しく見る<span className="plan-more-arrow" aria-hidden="true" />
                    </summary>
                    <ul className="plan-feats plan-feats-more">
                      {moreFeats.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </details>
                </>
              )}
            </div>
          );
        })}
      </div>

      {plans.length > 1 && (
        <div className="plan-nav">
          <button
            type="button"
            className="plan-nav-btn prev"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="前のプランを見る"
          >
            ‹
          </button>
          <div className="plan-dots" role="tablist" aria-label="料金プランの表示位置">
            {plans.map((plan, i) => (
              <button
                key={plan.name}
                type="button"
                role="tab"
                className={`plan-dot${i === active ? ' is-active' : ''}`}
                aria-selected={i === active}
                aria-label={`${plan.name}を表示`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="plan-nav-btn next"
            onClick={() => goTo(active + 1)}
            disabled={active === plans.length - 1}
            aria-label="次のプランを見る"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
