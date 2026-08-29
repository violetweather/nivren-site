/** The Nivren N: two upright stems with a coral diagonal cutting through them. */
export function NivrenMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24" role="img" aria-hidden="true" focusable="false">
      <rect x="1.6" y="2.6" width="4.4" height="18.8" fill="currentColor" />
      <rect x="18" y="2.6" width="4.4" height="18.8" fill="currentColor" />
      <polygon points="6,2.6 11.2,2.6 18,21.4 12.8,21.4" fill="#ff4d29" />
    </svg>
  );
}
