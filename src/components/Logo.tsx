/** ComfortFeet wordmark: two-tone lowercase name + small tagline with one script word. */
export function Logo({ tagline = true, light = false }: { tagline?: boolean; light?: boolean }) {
  return (
    <span className={light ? 'wordmark light' : 'wordmark'}>
      <span className="wm-name">
        comfort<b>feet</b>
      </span>
      {tagline && (
        <span className="wm-tag">
          MARCHEZ <i>léger</i> CHAQUE JOUR
        </span>
      )}
    </span>
  );
}
