import type { Product } from '../data/products';

/** Drawn sock illustration used as a product visual until real photos are added. */
export function SockArt({ color, pattern = 'plain', height = 'crew', size = 220 }: {
  color: string;
  pattern?: Product['pattern'];
  height?: Product['height'];
  size?: number;
}) {
  const id = `p${color.replace('#', '')}${pattern}${height}`;
  const top = height === 'knee' ? 6 : height === 'crew' ? 26 : height === 'ankle' ? 66 : 92;
  const light = isLight(color);
  const accent = light ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.16)';
  const cuff = light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.10)';
  const body = `M70 ${top} H128 V150 C128 160 134 166 146 172 L178 188 C198 198 200 228 176 236 C168 239 158 239 148 235 L86 210 C74 205 70 196 70 184 Z`;
  return (
    <svg viewBox="0 0 240 250" width={size} height={size} role="img" aria-label="Illustration de chaussette">
      <defs>
        <clipPath id={`c${id}`}><path d={body} /></clipPath>
        <pattern id={`s${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
          {pattern === 'stripes' && <rect width="16" height="6" fill={accent} />}
          {pattern === 'dots' && <circle cx="8" cy="8" r="3" fill={accent} />}
          {pattern === 'rib' && <rect width="3" height="16" fill={accent} />}
        </pattern>
      </defs>
      <ellipse cx="128" cy="238" rx="74" ry="7" fill="rgba(0,0,0,0.06)" />
      <path d={body} fill={color} />
      <g clipPath={`url(#c${id})`}>
        <rect x="0" y="0" width="240" height="250" fill={`url(#s${id})`} />
        <rect x="60" y={top} width="80" height="14" fill={cuff} />
        <path d="M128 150 C128 160 134 166 146 172 L178 188 C198 198 200 228 176 236 C170 238 164 238 158 237 L160 196 Z" fill={accent} />
        <path d="M70 184 C70 196 74 205 86 210 L106 218 L100 190 Z" fill={accent} />
      </g>
      <path d={body} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
    </svg>
  );
}

function isLight(hex: string): boolean {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}
