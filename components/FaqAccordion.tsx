'use client';

import { useState } from 'react';
import type { Faq } from '@/lib/site';

/**
 * 質問を前半／後半で左右2列に分ける。
 *
 * grid の同じ行に左右を並べる方式だと、片方の項目だけ開いたときに
 * 隣の列の行まで一緒に引き伸ばされて不自然になる。それを避けるため、
 * 左右を完全に独立した2つの縦積みリスト（それぞれ通常のブロック
 * フロー）として描画し、開閉は隣の列に一切影響しないようにする。
 * どちらの列で開いても、開閉状態は openIndex 1つで管理し、
 * 同時に開けるのは全体で1問まで（従来の挙動を維持）。
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const half = Math.ceil(items.length / 2);
  const columns = [items.slice(0, half), items.slice(half)];

  return (
    <div className="faq-cols">
      {columns.map((col, ci) => (
        <div className="faq-list" key={ci}>
          {col.map((item, localI) => {
            const i = ci === 0 ? localI : half + localI;
            const open = openIndex === i;
            return (
              <div key={i} className={`faq-item${open ? ' open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : i)}
                >
                  {item.q}
                </button>
                <div className="faq-a" role="region">
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
