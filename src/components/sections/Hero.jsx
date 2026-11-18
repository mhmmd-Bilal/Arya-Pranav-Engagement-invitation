import { useRef } from 'react';
import { motion } from 'framer-motion';
import Picture from '../common/Picture';
import { EASE, FILM, RevealText } from '../common/Reveal';
import { useGsap } from '../../hooks/useGsap';
import { scrollToId } from '../../lib/smoothScroll';
import { weddingData } from '../../data/weddingData';

export default function Hero({ ready }) {
  const { bride, groom, hero, numericDate } = weddingData;
  const root = useRef(null);

  useGsap(root, (gsap) => {
    const scrub = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('[data-hero="img"]', { scale: 1.18, yPercent: 10, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-hero="names"]', { yPercent: -45, ease: 'none', scrollTrigger: scrub });
    gsap.to('[data-hero="meta"]', { yPercent: -90, opacity: 0, ease: 'none', scrollTrigger: { ...scrub, end: '60% top' } });
    gsap.to('[data-hero="shade"]', { opacity: 0.85, ease: 'none', scrollTrigger: scrub });
  });

  const show = (delay) => ({
    initial: { opacity: 0, y: 18 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.2, ease: EASE, delay },
  });

  return (
    <section ref={root} id="top" aria-label="Welcome" className="grain relative h-[100svh] min-h-[560px] overflow-hidden bg-espresso text-white">
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: 'inset(6% 6% 6% 6%)' }}
        animate={ready ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        transition={{ duration: 1.8, ease: FILM }}
      >
        <div data-hero="img" className="h-full w-full origin-[50%_30%]">
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1.2 }}
            animate={ready ? { scale: 1 } : undefined}
            transition={{ duration: 3, ease: EASE }}
          >
            <Picture
              name={hero.image}
              alt="Diamond engagement ring and gold bands in warm light"
              priority
              sizes="100vw"
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover object-center"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* cinematic grade: deep espresso at the edges where the type sits */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-espresso/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-espresso/60 via-transparent to-transparent" />
      <div data-hero="shade" className="absolute inset-0 bg-espresso opacity-0" />

      <div className="relative z-[2] flex h-full flex-col justify-between section-x pb-8 pt-24 sm:pb-10 sm:pt-28">
        <div className="flex items-start justify-end">
          <motion.p {...show(0.5)} className="label hidden text-white/60 md:block">
            Vol. 01 — {numericDate}
          </motion.p>
        </div>

        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div data-hero="names">
            <h1 className="font-normal">
              <RevealText as="span" text={bride.name} animate={ready} delay={0.5} className="display-xl script block" />
              <span className="display-xl script block pl-[8vw] lg:pl-[14vw]">
                <motion.span
                  className="mr-[0.15em] inline-block font-serif text-[0.62em] italic text-cream"
                  initial={{ opacity: 0 }}
                  animate={ready ? { opacity: 1 } : undefined}
                  transition={{ duration: 1.4, delay: 1 }}
                >
                  &amp;
                </motion.span>
                <RevealText as="span" text={groom.name} animate={ready} delay={0.75} className="inline" />
              </span>
            </h1>
          </div>

          <div data-hero="meta" className="flex flex-wrap items-end justify-between gap-6 lg:block lg:pb-4 lg:pr-12 lg:text-right">
            <motion.div {...show(1.2)}>
              <p className="max-w-[16rem] font-serif text-lg italic text-white/80 lg:ml-auto">{hero.tagline}</p>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.a
        href="#events"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('events');
        }}
        className="absolute bottom-8 right-5 z-[2] hidden items-center gap-4 text-white/70 transition-colors hover:text-white sm:right-8 lg:flex"
        aria-label="Scroll to the events"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, delay: 1.8 }}
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="label">Scroll</span>
        <span className="relative block h-14 w-px overflow-hidden bg-white/20">
          <span className="scroll-cue absolute inset-x-0 top-0 block h-1/2 bg-cream" />
        </span>
      </motion.a>
    </section>
  );
}
