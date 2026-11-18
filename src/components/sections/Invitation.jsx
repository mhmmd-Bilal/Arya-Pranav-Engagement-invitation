import { useRef } from 'react';
import Kicker from '../common/Kicker';
import Picture from '../common/Picture';
import { JasmineRow } from '../common/Jasmine';
import { MaskReveal, Reveal, ScrubText } from '../common/Reveal';
import { useGsap } from '../../hooks/useGsap';
import { weddingData } from '../../data/weddingData';

function Parents({ person }) {
  return (
    <div>
      <p className="label text-espresso/50">{person.relation}</p>
      <p className="mt-3 font-serif text-xl leading-snug sm:text-2xl">{person.parents}</p>
    </div>
  );
}

export default function Invitation() {
  const { bride, groom, invitation, displayDate, city } = weddingData;
  const ref = useRef(null);

  useGsap(ref, (gsap, { desktop }) => {
    gsap.fromTo(
      '[data-float]',
      { yPercent: desktop ? 18 : 8 },
      { yPercent: desktop ? -18 : -8, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });

  return (
    <section id="invitation" ref={ref} className="relative overflow-hidden bg-white section-x py-28 sm:py-36 lg:py-48">
      <JasmineRow layout={[[88, 6, 0.9], [93, 9], [97, 5, 0.8]]} className="max-lg:hidden" />

      <div className="mx-auto max-w-7xl">
        <Kicker index="03">The Invitation</Kicker>

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-8">
            <Reveal>
              <p className="label text-espresso/50">{invitation.blessing}</p>
            </Reveal>
            <ScrubText
              text={invitation.statement}
              className="mt-8 font-display text-[clamp(1.85rem,4.4vw,3.9rem)] leading-[1.12] tracking-[-0.02em]"
            />
          </div>

          <div data-float className="relative lg:col-span-4 lg:mt-40">
            <MaskReveal className="ml-auto aspect-[4/5] w-3/4 max-w-sm lg:w-full" from="bottom">
              <Picture
                name={invitation.image}
                alt="Hanging white jasmine strings behind the couple"
                sizes="(min-width: 1024px) 30vw, 75vw"
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover object-[35%_50%]"
              />
            </MaskReveal>
            <p className="label mt-4 text-right text-espresso/40">Fig. 01 — The jasmine strings</p>
          </div>
        </div>

        <div className="mt-24 grid gap-12 border-t border-espresso/10 pt-12 sm:grid-cols-2 lg:mt-32 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-3">
            <Parents person={bride} />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-3">
            <Parents person={groom} />
          </Reveal>
          <Reveal delay={0.16} className="sm:col-span-2 lg:col-span-5 lg:col-start-8">
            <p className="label text-espresso/50">
              {displayDate} · {city}
            </p>
            <p className="mt-3 text-base leading-relaxed text-espresso/75 sm:text-lg">{invitation.announcement}</p>
            <p className="mt-6 font-serif text-2xl italic">— {invitation.families}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
