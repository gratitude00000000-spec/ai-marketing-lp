'use client';

import { useEffect } from 'react';

/**
 * スクロール演出のプログレッシブ・エンハンスメント。
 *
 * 設計方針:
 * - SSR された HTML は「最初から見えている」状態。このコンポーネントは
 *   JS が使える環境でだけ html に .js-anim を付け、いったん隠してから見せる。
 *   → JS 無効・クローラ・バックグラウンドタブでも本文が必ず読める。
 * - prefers-reduced-motion: reduce では一切適用しない。
 * - 保険として 1400ms 後と visibilitychange(hidden) で強制的に表示する
 *   （IntersectionObserver が発火しない描画コンテキスト対策）。
 */
export function ScrollFx() {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-anim]'));
    if (targets.length === 0) return;

    root.classList.add('js-anim');

    const reveal = (el: HTMLElement) => el.classList.add('is-in');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((el) => io.observe(el));

    // 保険：描画コンテキストによっては IO が発火しないため、必ず最終状態にする
    const revealAll = () => targets.forEach(reveal);
    const timer = window.setTimeout(revealAll, 1400);
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') revealAll();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // 画面外に出た装飾アニメーション（ヒーロー・帯）は止めて負荷を抑える
    const loopHosts = Array.from(
      document.querySelectorAll<HTMLElement>('.hero-visual, .ticker, .ind-marquee-wrap, .stats-orbit-wrap'),
    );
    let loopIo: IntersectionObserver | undefined;
    if (loopHosts.length > 0) {
      loopIo = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            (entry.target as HTMLElement).classList.toggle('fx-paused', !entry.isIntersecting);
          }
        },
        { rootMargin: '120px' },
      );
      loopHosts.forEach((el) => loopIo!.observe(el));
    }

    // ヒーローのスマホ：マウス追従の微小な傾き（細かいポインタを持つ環境のみ）
    const stage = document.getElementById('heroVisual');
    const phone = document.getElementById('phoneMock');
    const fine = window.matchMedia?.('(pointer: fine)').matches;
    let onMove: ((e: MouseEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;
    let onRecalc: (() => void) | undefined;

    if (stage && phone && fine) {
      // 毎回 getBoundingClientRect() を呼ぶとレイアウトが都度発生するのでキャッシュする
      let rect = stage.getBoundingClientRect();
      onRecalc = () => {
        rect = stage.getBoundingClientRect();
      };
      const MAX_TILT = 6; // deg
      onMove = (e: MouseEvent) => {
        const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1..1
        const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1..1
        phone.style.setProperty('--ry', `${(mx * MAX_TILT).toFixed(2)}deg`);
        phone.style.setProperty('--rx', `${(-my * MAX_TILT).toFixed(2)}deg`);
      };
      onLeave = () => {
        phone.style.setProperty('--ry', '0deg');
        phone.style.setProperty('--rx', '0deg');
      };
      stage.addEventListener('mouseenter', onRecalc);
      stage.addEventListener('mousemove', onMove);
      stage.addEventListener('mouseleave', onLeave);
      window.addEventListener('resize', onRecalc);
      window.addEventListener('scroll', onRecalc, { passive: true });
    }

    return () => {
      io.disconnect();
      loopIo?.disconnect();
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      if (stage) {
        if (onMove) stage.removeEventListener('mousemove', onMove);
        if (onLeave) stage.removeEventListener('mouseleave', onLeave);
        if (onRecalc) {
          stage.removeEventListener('mouseenter', onRecalc);
          window.removeEventListener('resize', onRecalc);
          window.removeEventListener('scroll', onRecalc);
        }
      }
    };
  }, []);

  return null;
}
