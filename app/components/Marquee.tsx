export function Marquee({ items, tone = "default" }: { items: string[]; tone?: "default" | "loud" }) {
  const track = (
    <span className="marquee-track">
      {items.map((item) => (
        <span className="marquee-item" key={item}>
          {item}
          <i aria-hidden="true">/</i>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`marquee marquee-${tone}`}>
      <div className="marquee-rail">
        {track}
        <span aria-hidden="true">{track}</span>
      </div>
    </div>
  );
}
