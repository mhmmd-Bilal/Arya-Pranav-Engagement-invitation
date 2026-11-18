import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Kicker from '../common/Kicker';
import Picture from '../common/Picture';
import { MaskReveal, Reveal, RevealText } from '../common/Reveal';
import { useGsap } from '../../hooks/useGsap';
import { weddingData } from '../../data/weddingData';

/** Portrait that leans a few degrees toward the pointer (fine pointers only). */
function Tilt({ children, className = '' }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 18 });
  return (
    <motion.div
      className={`[perspective:1200px] ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }}>{children}</motion.div>
    </motion.div>
  );
}

function Bio({ person, role, className = '' }) {
  return (
    <Reveal className={className}>
      <p className="label text-espresso/50">{role}</p>
      <h3 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{person.fullName}</h3>
      <p className="mt-2 font-serif text-lg italic text-espresso/60">
        {person.relation} {person.parents}
      </p>
      <p className="mt-5 max-w-sm leading-relaxed text-espresso/75">{person.about}</p>
    </Reveal>
  );
}

export default function Couple() {
  const { bride, groom } = weddingData;
  const ref = useRef(null);

  useGsap(ref, (gsap, { desktop }) => {
    const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true };
    gsap.fromTo('[data-speed="slow"]', { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: st });
    gsap.fromTo('[data-speed="fast"]', { yPercent: desktop ? 22 : 10 }, { yPercent: desktop ? -22 : -10, ease: 'none', scrollTrigger: st });
    gsap.fromTo('[data-amp]', { xPercent: -12, rotate: -6 }, { xPercent: 12, rotate: 6, ease: 'none', scrollTrigger: st });
  });

  return (
    <section id="couple" ref={ref} className="relative overflow-hidden bg-linen section-x py-28 sm:py-36 lg:py-48">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Kicker index="04">Meet the Couple</Kicker>
            <RevealText text="Two stories, one garden" className="display-lg mt-8 max-w-4xl font-normal" />
          </div>
          <Reveal className="max-w-xs font-serif text-xl italic text-espresso/60 lg:pb-3 lg:text-right">
            “Some people arrive and make such a beautiful impact on your life.”
          </Reveal>
        </div>

        <div className="relative mt-20 grid grid-cols-12 lg:mt-28">
          {/* the oversized ampersand drifts across the gap as you scroll */}
          <span
            data-amp
            className="pointer-events-none absolute left-[46%] top-[30%] z-0 hidden select-none font-serif text-[22rem] leading-none italic text-cream lg:block"
            aria-hidden="true"
          >
            &amp;
          </span>

          {/* Bride — large, left */}
          <div className="relative z-[1] col-span-11 sm:col-span-8 lg:col-span-6">
            <div data-speed="slow">
              <Tilt>
                <MaskReveal className="aspect-[4/5] bg-cream" from="bottom">
                  <Picture
                    name={bride.image}
                    alt={`Portrait standing in for ${bride.fullName}`}
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover object-[50%_25%]"
                  />
                </MaskReveal>
              </Tilt>
            </div>
            <p className="display-lg script pointer-events-none absolute -bottom-[0.35em] -right-[0.2em] z-[2] text-white mix-blend-difference max-sm:text-[3.4rem] sm:-right-[0.6em]" aria-hidden="true">
              {bride.name}
            </p>
          </div>

          {/* Groom — smaller, right, lower, overlapping */}
          <div className="relative z-[2] col-span-9 col-start-4 -mt-16 sm:col-span-6 sm:col-start-7 sm:-mt-40 lg:col-span-4 lg:col-start-9 lg:mt-56">
            <div data-speed="fast">
              <Tilt>
                <MaskReveal className="aspect-[3/4] bg-cream outline outline-8 outline-linen" from="top" delay={0.15}>
                  <Picture
                    name={groom.image}
                    alt={`Portrait standing in for ${groom.fullName}`}
                    sizes="(min-width: 1024px) 32vw, 70vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full scale-[1.35] object-cover object-[52%_55%]"
                  />
                </MaskReveal>
              </Tilt>
            </div>
            <p className="display-md script pointer-events-none mt-4 text-right text-espresso lg:absolute lg:-left-[0.7em] lg:-top-[0.45em] lg:z-[2] lg:mt-0 lg:text-left" aria-hidden="true">
              {groom.name}
            </p>
          </div>
        </div>

        <div className="mt-20 grid gap-14 sm:grid-cols-2 lg:mt-24 lg:grid-cols-12">
          <Bio person={bride} role="The Bride" className="lg:col-span-4 lg:col-start-2" />
          <Bio person={groom} role="The Groom" className="lg:col-span-4 lg:col-start-8" />
        </div>
      </div>
    </section>
  );
}
