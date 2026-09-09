'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = {
  active?: string;
  links: { label: string; href: string }[];
  tel: string;
  telHref: string;
};

export function MobileNav({ active, links }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className={`mob-ham${open ? ' open' : ''}`}
        aria-label="メニュー"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`mob-nav${open ? ' open' : ''}`} aria-label="モバイルナビゲーション">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={active === l.href ? 'active' : undefined}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
