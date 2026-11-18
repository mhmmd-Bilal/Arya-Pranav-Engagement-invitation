import { Reveal } from './Reveal';

/** "03 — The Invitation": the numbered chapter label used across sections. */
export default function Kicker({ index, children, className = '', light = false }) {
  return (
    <Reveal className={`flex items-center gap-4 ${light ? 'text-cream' : 'text-espresso/60'} ${className}`}>
      <span className="label tabular-nums">{index}</span>
      <span className={`h-px w-10 ${light ? 'bg-cream/50' : 'bg-espresso/25'}`} aria-hidden="true" />
      <span className="label">{children}</span>
    </Reveal>
  );
}
