type Industry = { img: string; title: string; desc: string };

/**
 * 対応業種セクションの「3D画像マルキー」。
 *
 * 縦長カードを右から左へ一定速度・途切れなくループさせる。実装は
 * カード配列を2つ並べて -50% まで translateX するだけの、よくある
 * シームレスマーキー手法（サーバーコンポーネント・JS不要・CSSアニメのみ）。
 * 2巡目は aria-hidden で読み上げから除外し、情報は1巡目のみが正。
 * prefers-reduced-motion では globals.css の全体ルールで自動的に停止する。
 */
export function IndustryMarquee({ items }: { items: Industry[] }) {
  const loop = [...items, ...items];

  return (
    <div className="ind-marquee-wrap" aria-label="対応業種の一覧">
      <div className="ind-marquee-fade ind-marquee-fade-l" aria-hidden="true" />
      <div className="ind-marquee-fade ind-marquee-fade-r" aria-hidden="true" />
      <div className="ind-marquee-track">
        {loop.map((ind, i) => {
          const isDup = i >= items.length;
          return (
            <div className="ind-card-3d" key={`${ind.title}-${i}`} aria-hidden={isDup || undefined}>
              <img src={ind.img} alt={isDup ? '' : ind.title} loading="lazy" />
              <div className="ind-card-3d-ov" />
              <div className="ind-card-3d-ct">
                <h3>{ind.title}</h3>
                <p>{ind.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
