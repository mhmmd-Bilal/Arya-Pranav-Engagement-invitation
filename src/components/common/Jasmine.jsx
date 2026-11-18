import { memo } from 'react';

const PETALS = [0, 72, 144, 216, 288];

/** A hanging string of jasmine buds, drawn in cream; sways gently from its knot. */
export const JasmineStrand = memo(function JasmineStrand({ flowers = 8, className = '', style, color = '#E1D5BF' }) {
  const h = flowers * 22 + 14;
  return (
    <svg
      viewBox={`0 0 20 ${h}`}
      width="20"
      height={h}
      className={`sway pointer-events-none ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d={`M10 0V${h - 4}`} stroke={color} strokeOpacity=".45" strokeWidth=".6" />
      {Array.from({ length: flowers }, (_, i) => (
        <g key={i} transform={`translate(10 ${18 + i * 22}) rotate(${i * 37})`}>
          {PETALS.map((r) => (
            <ellipse key={r} cy="-3.6" rx="2.2" ry="3.8" fill={color} transform={`rotate(${r})`} />
          ))}
          <circle r="1.1" fill="#201614" fillOpacity=".25" />
        </g>
      ))}
    </svg>
  );
});

/** Strands across the top of a section. `layout`: [left %, flowers, opacity?]. */
export function JasmineRow({ layout, className = '', color }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 ${className}`} aria-hidden="true">
      {layout.map(([left, flowers, opacity = 1], i) => (
        <div key={i} className="absolute top-0" style={{ left: `${left}%`, opacity }}>
          <JasmineStrand
            flowers={flowers}
            color={color}
            style={{ '--sway-dur': `${6 + (i % 4)}s`, '--sway-delay': `${-i * 1.3}s` }}
          />
        </div>
      ))}
    </div>
  );
}
