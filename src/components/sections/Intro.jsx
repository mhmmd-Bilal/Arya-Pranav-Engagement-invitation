import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../common/Reveal';
import { weddingData } from '../../data/weddingData';
import { music } from '../../lib/music';

const fade = (delay, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.2, ease: EASE, delay },
});

export default function Intro({ onDone }) {
  const { bride, groom } = weddingData;
  const sealRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => sealRef.current?.focus({ preventScroll: true }), 1600);
    return () => clearTimeout(id);
  }, []);

  function openEnvelope() {
    // Must start inside the click handler, or browsers block autoplay.
    music.play().catch(() => {});
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return onDone();
    setOpen(true);
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation opening"
      className="grain fixed inset-0 z-[60] flex flex-col overflow-hidden bg-espresso text-white"
      exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE } }}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-5 pt-[18vh]">
        <motion.div {...fade(0.3, 30)} className="relative aspect-[3/2] w-[84vw] max-w-[26rem] [perspective:1200px]">
          {/* inside of the envelope */}
          <div className="absolute inset-0 bg-cream" />

          {/* the letter, tucked inside, rises once the flap is open */}
          <motion.div
            className="absolute inset-x-[5%] top-[5%] bottom-[5%] z-[1] flex flex-col items-center justify-center bg-white px-4 text-center text-espresso shadow-md"
            initial={false}
            animate={open ? { y: '-62%' } : { y: 0 }}
            transition={{ duration: 1.3, ease: EASE, delay: 1 }}
            onAnimationComplete={() => open && setTimeout(onDone, 700)}
          >
            <p className="script text-4xl sm:text-5xl">Our Engagement</p>
          </motion.div>

          {/* front pocket: covers the letter except the V under the flap */}
          <div
            className="absolute inset-0 z-[3] bg-linen shadow-xl"
            style={{ clipPath: 'polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)' }}
          />

          {/* top flap folds back behind the letter */}
          <motion.div
            className="absolute inset-x-0 top-0 z-[4] h-[58%] origin-top bg-[#ebe2d0]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            initial={false}
            animate={open ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 4 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3, zIndex: { delay: 0.75, duration: 0 } }}
          />

          {/* wax seal */}
          <motion.button
            ref={sealRef}
            type="button"
            onClick={openEnvelope}
            disabled={open}
            aria-label="Open the invitation"
            className="absolute left-1/2 top-[58%] z-[5] grid size-20 place-items-center rounded-full bg-espresso text-cream shadow-[0_4px_12px_rgba(0,0,0,0.35),inset_0_0_0_4px_rgba(225,213,191,0.25)] sm:size-24"
            style={{ x: '-50%', y: '-50%' }}
            initial={false}
            animate={open ? { scale: 1.3, opacity: 0 } : { scale: 1, opacity: 1 }}
            whileHover={open ? undefined : { scale: 1.06 }}
            whileTap={open ? undefined : { scale: 0.94 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className="script text-3xl sm:text-4xl">
              {bride.name[0]}&amp;{groom.name[0]}
            </span>
          </motion.button>
        </motion.div>

        <motion.p
          aria-hidden="true"
          className="mt-8 text-center text-xs uppercase tracking-[0.3em] text-cream/70"
          initial={{ opacity: 0 }}
          animate={open ? { opacity: 0 } : { opacity: [0.4, 1, 0.4] }}
          transition={open ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        >
          Tap the seal
        </motion.p>
      </div>

    </motion.div>
  );
}
