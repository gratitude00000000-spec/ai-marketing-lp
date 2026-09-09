'use client';

import { useState } from 'react';
import type { Faq } from '@/lib/site';

export function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-list">
      {items.map((item, i) => {
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
  );
}
