/**
 * Faint organic line work behind the content. Purely decorative: two long
 * curves at very low contrast, stretched to the content height. Non-scaling
 * strokes keep the line weight constant however tall the page is.
 */
export function BackgroundCurves() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 1600"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M-40 260 C 220 120, 380 380, 640 300 S 1080 60, 1260 220"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1240 780 C 1040 700, 1000 1000, 760 1060 S 260 1280, -40 1180"
        stroke="rgba(183,243,107,0.2)"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
