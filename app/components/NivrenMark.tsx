/** A folded N with forward-cut terminals and a continuous vermilion stroke. */
export function NivrenMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" width="32" height="32" aria-hidden="true" focusable="false">
      <path d="M6 58V20L20 6v38L6 58ZM44 6h14v38L44 58V6Z" fill="currentColor" />
      <path d="m20 6 24 32v20L20 26V6Z" fill="#ef4b23" />
    </svg>
  );
}
