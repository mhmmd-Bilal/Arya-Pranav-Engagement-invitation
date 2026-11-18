import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Map as MapIcon, MapPin, Navigation, X } from 'lucide-react';
import Kicker from '../common/Kicker';
import Picture from '../common/Picture';
import { EASE, Reveal, RevealText } from '../common/Reveal';
import { useGsap } from '../../hooks/useGsap';
import { weddingData } from '../../data/weddingData';

export default function Venue() {
  const { venue, city } = weddingData;
  const ref = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const q = encodeURIComponent(venue.mapQuery);

  useGsap(ref, (gsap) => {
    gsap.fromTo(
      '[data-venue-img]',
      { yPercent: -10, scale: 1.15 },
      { yPercent: 10, scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-venue-frame]', start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  return (
    <section id="venue" ref={ref} className="bg-espresso text-white">
      <div data-venue-frame data-nav-dark className="grain relative flex min-h-[100svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <div data-venue-img className="h-full w-full">
            <Picture name={venue.image} alt="Gold wedding rings resting on moss" sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/45 to-espresso/10" />

        <div className="frame relative z-[2] pb-14 pt-40 sm:pb-20">
          <Kicker index="01" light>
            The Venue
          </Kicker>
          <RevealText text={venue.name} className="display-lg mt-8 max-w-5xl font-normal" />

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <address className="flex gap-3 font-serif text-xl not-italic leading-snug text-white/85 sm:text-2xl">
                <MapPin className="mt-1.5 size-4 shrink-0 text-cream" strokeWidth={1.5} aria-hidden="true" />
                {venue.address}
              </address>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">{venue.note}</p>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-wrap items-start gap-3 lg:col-span-6 lg:col-start-7 lg:justify-end">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${q}`} target="_blank" rel="noopener noreferrer" className="btn-cream">
                <Navigation className="size-4" aria-hidden="true" /> Get directions
                <span className="sr-only">(opens Google Maps)</span>
              </a>
              <button
                type="button"
                onClick={() => setShowMap((v) => !v)}
                aria-expanded={showMap}
                aria-controls="venue-map"
                className="btn-line text-white"
              >
                {showMap ? <X className="size-4" aria-hidden="true" /> : <MapIcon className="size-4" aria-hidden="true" />}
                {showMap ? 'Hide map' : 'View map'}
              </button>
            </Reveal>
          </div>
          <p className="label mt-12 text-cream/50">{city}</p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showMap && (
          <motion.div
            id="venue-map"
            key="map"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="section-x py-8">
              <div className="relative mx-auto h-[60vh] max-h-[560px] min-h-[320px] max-w-7xl overflow-hidden bg-linen">
                <iframe
                  title={`Map showing ${venue.name}`}
                  src={`https://www.google.com/maps?q=${q}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0 grayscale sepia-[25%]"
                />
              </div>
              <p className="mx-auto mt-4 max-w-7xl text-right">
                <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="label text-cream/70 underline-offset-8 hover:text-cream hover:underline">
                  Open in Google Maps ↗
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
