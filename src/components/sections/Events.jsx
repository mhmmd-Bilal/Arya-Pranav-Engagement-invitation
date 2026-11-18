import { Clock, MapPin } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { weddingData } from '../../data/weddingData';

const ACCENT = 'var(--color-espresso)';
const CARDS = ['var(--color-linen)', 'color-mix(in srgb, var(--color-cream) 60%, white)']; // theme tints, alternating per event

// [left %, top %, colour, seconds] for the floating confetti bits
const C = 'var(--color-cream)';
const E = 'color-mix(in srgb, var(--color-espresso) 45%, transparent)';
const CONFETTI = [
  [8, 18, E, 6], [30, 6, C, 7], [47, 30, C, 5.5], [56, 12, E, 6.5],
  [70, 40, C, 7.5], [88, 22, E, 6], [94, 62, C, 5], [40, 72, E, 7],
  [18, 85, C, 6.5], [76, 88, C, 5.5],
];

function EventCard({ event, index }) {
  const [, day, month] = event.date.match(/(\d+)\s+(\w+)/) ?? [];
  return (
    <Reveal delay={index * 0.15} className={index % 2 ? 'sm:mt-12' : ''}>
      <article className="flex gap-5 rounded-3xl p-6 shadow-sm sm:p-8" style={{ backgroundColor: CARDS[index % 2] }}>
        <div className="shrink-0 text-center">
          <p className="font-serif text-5xl italic leading-none sm:text-6xl" style={{ color: ACCENT }}>{day}</p>
          <p className="mt-2 text-xs text-espresso/60">{month?.slice(0, 3)}</p>
        </div>
        <div>
          <h3 className="font-serif text-xl leading-snug sm:text-2xl">{event.name}</h3>
          <p className="mt-3 flex items-center gap-2 text-sm text-espresso/80">
            <Clock className="size-4 shrink-0" style={{ color: ACCENT }} aria-hidden="true" /> {event.time}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-9 items-center gap-2 text-sm text-espresso/80 underline-offset-4 hover:underline"
          >
            <MapPin className="size-4 shrink-0" style={{ color: ACCENT }} aria-hidden="true" /> {event.venue}
            <span className="sr-only">(opens Google Maps)</span>
          </a>
        </div>
      </article>
    </Reveal>
  );
}

export default function Events() {
  return (
    <section id="events" className="relative overflow-hidden bg-white section-x py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {CONFETTI.map(([left, top, color, dur], i) => (
          <span
            key={i}
            className="drift absolute h-2.5 w-1.5 rounded-sm opacity-70"
            style={{ left: `${left}%`, top: `${top}%`, backgroundColor: color, '--drift-dur': `${dur}s`, '--drift-delay': `${-i}s` }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {weddingData.events.map((event, i) => (
            <EventCard key={event.name} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
