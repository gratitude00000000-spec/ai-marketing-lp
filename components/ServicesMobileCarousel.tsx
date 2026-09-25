'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

type Service = { img: string; title: string; short: string; desc: string; points: string[] };

/**
 * サービス内容セクションのスマホ専用「メインカード＋サムネイル」カルーセル。
 * PC(761px以上)は従来どおり svc-grid の静止グリッドを表示し、これは
 * CSS（@media max-width:760px）でスマホのときだけ差し替え表示する。
 *
 * PricingPlans と同じ方式：ネイティブの横スクロール + scroll-snap で
 * 指スワイプそのものをブラウザに任せる（慣性・ラバーバンドも自然に
 * 効く）。どのカードが中央に来たかは IntersectionObserver で検出し、
 * is-active/is-before/is-after を classList で直接付け外しする
 * （JSX の className を状態依存にすると ScrollFx の外部 classList.add
 * を再レンダーのたびに消してしまうため。PricingPlans と同じ理由）。
 *
 * JS が動かない／ハイドレーション前は `is-ready` を付けない。CSS 側も
 * `.msvc-track.is-ready` を条件にすることで、それまでは通常の縦並び
 * （即座に全文閲覧可能）のまま。矢印・ドット・サムネイルも ready 後
 * だけ描画するため、JS 無効環境で無反応なボタンが表示されることもない。
 */
export function ServicesMobileCarousel({ services }: { services: Service[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.classList.remove('is-active', 'is-before', 'is-after');
      el.classList.add(i === active ? 'is-active' : i < active ? 'is-before' : 'is-after');
      el.setAttribute('aria-hidden', String(i !== active));
    });
  }, [active]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    setReady(true);
    track.classList.add('is-ready');

    const io = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (!best || entry.intersectionRatio > best.ratio) best = { idx, ratio: entry.intersectionRatio };
        }
        if (best && best.ratio > 0.55) setActive(best.idx);
      },
      { root: track, threshold: [0.25, 0.55, 0.75, 0.95] },
    );
    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(services.length - 1, idx));
    const el = cardRefs.current[clamped];
    if (!el) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(services.length - 1, active + 1);
      goTo(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(0, active - 1);
      goTo(prev);
      tabRefs.current[prev]?.focus();
    }
  };

  return (
    <div className="msvc">
      <div className="msvc-stage">
        <div className="msvc-track" ref={trackRef}>
          {services.map((s, i) => (
            <div
              className="msvc-card"
              key={s.title}
              data-idx={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              <div className="msvc-img">
                <img loading="lazy" src={s.img} alt={s.title} />
              </div>
              <div className="msvc-body">
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

        {ready && services.length > 1 && (
          <>
            <button
              type="button"
              className="msvc-arrow prev"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="前のサービスを見る"
            >
              ‹
            </button>
            <button
              type="button"
              className="msvc-arrow next"
              onClick={() => goTo(active + 1)}
              disabled={active === services.length - 1}
              aria-label="次のサービスを見る"
            >
              ›
            </button>
          </>
        )}
      </div>

      {ready && services.length > 1 && (
        <>
          <div className="msvc-dots">
            {services.map((s, i) => (
              <span key={s.title} className={`msvc-dot${i === active ? ' is-active' : ''}`} aria-hidden="true" />
            ))}
          </div>

          <div className="msvc-thumbs" role="tablist" aria-label="サービス一覧" onKeyDown={onKeyDown}>
            {services.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                className={`msvc-thumb${i === active ? ' is-active' : ''}`}
                aria-selected={i === active}
                tabIndex={i === active ? 0 : -1}
                onClick={() => goTo(i)}
              >
                <img loading="lazy" src={s.img} alt="" />
                <span>{s.short}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
