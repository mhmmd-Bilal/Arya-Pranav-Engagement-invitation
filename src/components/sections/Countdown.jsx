import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Picture from '../common/Picture';
import { EASE, Reveal } from '../common/Reveal';
import { useCountdown } from '../../hooks/useCountdown';
import { useGsap } from '../../hooks/useGsap';
import { weddingData } from '../../data/weddingData';

/** One digit that rolls upward when it changes. */
function Digit({ value }) {
  return (
    <span className="relative inline-block h-[1.02em] w-[0.62em] overflow-hidden align-top">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label, min = 2 }) {
  const text = String(value).padStart(min, '0');
  return (
    <div className="flex flex-col items-start border-l border-white/20 pl-4 sm:pl-6">
      <span className="font-display text-[clamp(3.2rem,11vw,9.5rem)] leading-none tracking-tighter text-white tabular-nums" aria-hidden="true">
        {text.split('').map((d, i) => (
          // key from the right so units keep their slot when the length changes
          <Digit key={text.length - i} value={d} />
        ))}
      </span>
      <span className="label mt-4 text-cream/80">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const { done, days, hours, minutes, seconds } = useCountdown(weddingData.date);
  const ref = useRef(null);

  useGsap(ref, (gsap) => {
    gsap.fromTo('[data-cd-img]', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  return (
    <section ref={ref} data-nav-dark aria-label="Countdown to the wedding" className="grain relative overflow-hidden bg-espresso text-white">
      <div className="absolute inset-0">
        <div data-cd-img className="h-full w-full">
          <Picture name={weddingData.countdown.image} alt="" sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
        </div>
      </div>
      <div className="absolute inset-0 bg-espresso/80" />

      <div className="frame relative z-[2] py-28 sm:py-36 lg:py-44">
        {done ? (
          <Reveal className="max-w-lg text-lg text-white/80">The celebrations have begun. Thank you for your blessings!</Reveal>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4">
            {[[days, 'Days'], [hours, 'Hours'], [minutes, 'Minutes'], [seconds, 'Seconds']].map(([v, label], i) => (
              <Reveal key={label} delay={i * 0.12}>
                <Unit value={v} label={label} />
              </Reveal>
            ))}
          </div>
        )}
        {!done && (
          <p className="sr-only" data-countdown-text>
            {days} days, {hours} hours and {minutes} minutes to go.
          </p>
        )}

      </div>
    </section>
  );
}
