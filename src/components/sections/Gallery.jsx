import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import Kicker from '../common/Kicker';
import Picture from '../common/Picture';
import { EASE, MaskReveal } from '../common/Reveal';
import { useGsap } from '../../hooks/useGsap';
import { useScrollLock } from '../../hooks/useScrollLock';
import { weddingData } from '../../data/weddingData';

const pad = (n) => String(n).padStart(2, '0');
// Size + position give the two columns an art-directed, uneven rhythm.
const SHAPE = {
  tall: 'aspect-[4/5] w-full',
  wide: 'aspect-[4/3] w-full',
  small: 'aspect-square w-4/5 sm:w-3/5',
};

function Lightbox({ index, onClose, onStep }) {
  const images = weddingData.gallery;
  const item = images[index];
  const closeRef = useRef(null);
  const [dir, setDir] = useState(0);
  useScrollLock(true);

  const step = useCallback(
    (d) => {
      setDir(d);
      onStep(d);
    },
    [onStep],
  );

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const els = [...document.querySelectorAll('[data-lightbox] button')];
        const i = els.indexOf(document.activeElement);
        e.preventDefault();
        els[(i + (e.shiftKey ? -1 : 1) + els.length) % els.length]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [onClose, step]);

  return (
    <motion.div
      data-lightbox
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${images.length}`}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-espresso/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      onClick={onClose}
    >
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 text-white sm:px-8">
        <p className="label text-cream/80" aria-live="polite">
          {pad(index + 1)} / {pad(images.length)}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="-mr-2 flex size-12 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          aria-label="Close gallery"
        >
          <X className="size-6" strokeWidth={1.25} />
        </button>
      </div>

      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.figure
          key={item.image}
          custom={dir}
          className="flex max-h-[78svh] max-w-[92vw] touch-pan-y flex-col items-center"
          variants={{
            enter: (d) => ({ x: d * 90, opacity: 0, clipPath: d > 0 ? 'inset(0 0 0 30%)' : 'inset(0 30% 0 0)' }),
            center: { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0%)' },
            exit: (d) => ({ x: d * -90, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: EASE }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60 || info.velocity.x < -400) step(1);
            else if (info.offset.x > 60 || info.velocity.x > 400) step(-1);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Picture
            name={item.image}
            alt={item.alt}
            priority
            sizes="92vw"
            className="block"
            imgClassName="max-h-[72svh] w-auto max-w-[92vw] select-none object-contain [-webkit-user-drag:none]"
          />
          <figcaption className="mt-4 font-serif text-lg italic text-white/70">{item.alt}</figcaption>
        </motion.figure>
      </AnimatePresence>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-3 sm:bottom-auto sm:left-0 sm:right-0 sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2 sm:justify-between sm:px-6 sm:[&>button]:pointer-events-auto sm:pointer-events-none">
        {[
          [-1, ArrowLeft, 'Previous photo'],
          [1, ArrowRight, 'Next photo'],
        ].map(([d, Icon, label]) => (
          <button
            key={d}
            type="button"
            aria-label={label}
            onClick={(e) => {
              e.stopPropagation();
              step(d);
            }}
            className="flex size-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:border-cream hover:bg-cream hover:text-espresso"
          >
            <Icon className="size-5" strokeWidth={1.25} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function Tile({ item, index, onOpen }) {
  return (
    <figure className={`${SHAPE[item.span]} ${index % 3 === 2 ? 'ml-auto' : ''}`}>
      <button
        type="button"
        onClick={() => onOpen(index)}
        data-cursor="View"
        className="group block h-full w-full"
        aria-label={`Open photo ${index + 1}: ${item.alt}`}
      >
        <MaskReveal className="h-full w-full bg-linen" from={index % 2 ? 'top' : 'bottom'}>
          <Picture
            name={item.image}
            alt=""
            sizes="(min-width: 1024px) 45vw, 50vw"
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.05]"
          />
        </MaskReveal>
      </button>
      <figcaption className="label mt-3 flex justify-between gap-4 text-espresso/45">
        <span>{pad(index + 1)}</span>
        <span className="hidden truncate sm:block">{item.alt}</span>
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  const images = weddingData.gallery;
  const ref = useRef(null);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i + d + images.length) % images.length), [images.length]);

  useGsap(ref, (gsap) => {
    gsap.fromTo('[data-marquee]', { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('[data-col="right"]', { yPercent: 0 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '[data-cols]', start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  const left = images.map((item, i) => ({ item, i })).filter(({ i }) => i % 2 === 0);
  const right = images.map((item, i) => ({ item, i })).filter(({ i }) => i % 2 === 1);

  return (
    <section id="gallery" ref={ref} className="overflow-hidden bg-white py-28 sm:py-36 lg:py-48">
      <div className="frame">
        <Kicker index="08">The Gallery</Kicker>
      </div>
      <p
        data-marquee
        className="mt-10 whitespace-nowrap font-display text-[clamp(4rem,16vw,15rem)] leading-none tracking-[-0.04em] text-espresso"
        aria-hidden="true"
      >
        Moments <span className="font-serif italic text-espresso/40">in</span> bloom — Moments{' '}
        <span className="font-serif italic text-espresso/40">in</span> bloom
      </p>
      <h2 className="sr-only">Gallery — moments in bloom</h2>

      <div data-cols className="frame mt-16 grid grid-cols-2 gap-3 sm:gap-6 lg:mt-24 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-8 sm:gap-14 lg:col-span-7 lg:gap-24">
          {left.map(({ item, i }) => (
            <Tile key={item.image} item={item} index={i} onOpen={setOpen} />
          ))}
        </div>
        <div data-col="right" className="flex flex-col gap-8 pt-24 sm:gap-14 lg:col-span-5 lg:gap-24 lg:pt-56">
          {right.map(({ item, i }) => (
            <Tile key={item.image} item={item} index={i} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  );
}
