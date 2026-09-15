'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent, CSSProperties } from 'react';

type Service = { img: string; title: string; short: string; desc: string; points: string[] };

/**
 * サービス内容セクションのスマホ専用「メインカード＋サムネイル」カルーセル。
 * PC(761px以上)は従来どおり svc-grid の静止グリッドを表示し、これは
 * CSS（@media max-width:760px）でスマホのときだけ差し替え表示する。
 *
 * 全カードを常に DOM に描画し、位置は「現在のインデックスからの距離
 * (diff)」に応じた CSS カスタムプロパティで表現する。React の再レン
 * ダーで diff が変わるたびにインラインの値だけが変わるので、ブラウザ
 * は古い値から新しい値への transition を自動的に補間してくれる
 * （＝現在のカードが移動・縮小しながら退場し、次のカードが傾きながら
 * 入ってきて正面に戻る、を JS 側で個別にアニメーションさせる必要がない）。
 *
 * JS が動かない／ハイドレーション前は `is-ready` を付けない。CSS 側も
 * `.msvc-stage.is-ready` を条件にすることで、それまでは通常の縦並び
 * （即座に全文閲覧可能）のまま。aria-hidden も ready 后でしか付けない
 * ため、JS 無効環境で他カードの内容がアクセシビリティツリーから消える
 * ことはない。
 */
export function ServicesMobileCarousel({ services }: { services: Service[] }) {
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  const goTo = (idx: number) => {
    setCurrent(Math.max(0, Math.min(services.length - 1, idx)));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(services.length - 1, current + 1);
      goTo(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(0, current - 1);
      goTo(prev);
      tabRefs.current[prev]?.focus();
    }
  };

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const THRESHOLD = 40;
    if (delta > THRESHOLD) goTo(current - 1);
    else if (delta < -THRESHOLD) goTo(current + 1);
  };

  return (
    <div className="msvc">
      <div
        className={`msvc-stage${ready ? ' is-ready' : ''}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {services.map((s, i) => {
          const diff = i - current;
          const active = diff === 0;
          const style = {
            '--msvc-diff': diff,
            '--msvc-tilt': active ? 0 : diff > 0 ? -6 : 6,
            '--msvc-scale': active ? 1 : 0.96,
            '--msvc-opacity': active ? 1 : 0.7,
          } as CSSProperties;
          return (
            <div
              className={`msvc-card${active ? ' is-active' : ''}`}
              key={s.title}
              style={style}
              aria-hidden={ready && !active}
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
          );
        })}

        {ready && services.length > 1 && (
          <>
            <button
              type="button"
              className="msvc-arrow prev"
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              aria-label="前のサービスを見る"
            >
              ‹
            </button>
            <button
              type="button"
              className="msvc-arrow next"
              onClick={() => goTo(current + 1)}
              disabled={current === services.length - 1}
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
              <span key={s.title} className={`msvc-dot${i === current ? ' is-active' : ''}`} aria-hidden="true" />
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
                className={`msvc-thumb${i === current ? ' is-active' : ''}`}
                aria-selected={i === current}
                tabIndex={i === current ? 0 : -1}
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
