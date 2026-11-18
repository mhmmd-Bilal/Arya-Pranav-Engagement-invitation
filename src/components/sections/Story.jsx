import { useRef, useState } from 'react';
import Kicker from '../common/Kicker';
import Picture from '../common/Picture';
import { MaskReveal, Reveal } from '../common/Reveal';
import { useGsap } from '../../hooks/useGsap';
import { weddingData } from '../../data/weddingData';

const pad = (n) => String(n).padStart(2, '0');

function Chapter({ item, index, total }) {
  return (
    <>
      <p className="label text-cream/70">
        Chapter {pad(index + 1)} / {pad(total)} · {item.date}
      </p>
      <h3 className="display-md mt-5 font-normal text-white">{item.title}</h3>
      <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">{item.text}</p>
    </>
  );
}

/** Desktop: the section pins and chapters play like scenes in a film. */
function Pinned({ story }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const n = story.length;

  useGsap(ref, (gsap, { desktop }) => {
    if (!desktop) return;
    const imgs = gsap.utils.toArray('[data-scene]');
    const inner = gsap.utils.toArray('[data-scene-img]');
    const texts = gsap.utils.toArray('[data-scene-text]');
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
        end: `+=${(n - 1) * 85}%`,
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * (n - 1) + 0.5))),
      },
    });
    tl.fromTo('[data-rail]', { scaleY: 0 }, { scaleY: 1, duration: n - 1 }, 0);
    for (let i = 1; i < n; i++) {
      tl.fromTo(imgs[i], { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' }, i - 1);
      tl.fromTo(inner[i], { scale: 1.3 }, { scale: 1.02, duration: 1 }, i - 1);
      tl.fromTo(inner[i - 1], { scale: 1.02 }, { scale: 1.12, duration: 1 }, i - 1);
      tl.to(texts[i - 1], { opacity: 0, y: -50, duration: 0.35 }, i - 1);
      tl.fromTo(texts[i], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.4 }, i - 0.55);
    }
  });

  return (
    <div ref={ref} className="relative hidden h-screen overflow-hidden section-x lg:motion-safe:block">
      <div className="frame absolute inset-x-0 top-24 z-10">
        <Kicker index="05" light>
          Our Story
        </Kicker>
      </div>
      <div className="mx-auto grid h-full max-w-7xl grid-cols-12 items-center gap-10 pb-16 pt-36">
        <div className="relative col-span-6 h-[64vh]">
          {story.map((item, i) => (
            <div key={item.title} data-scene className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
              <div data-scene-img className="h-full w-full">
                <Picture name={item.image} alt="" sizes="45vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
              </div>
            </div>
          ))}
          <p className="label absolute -bottom-8 left-0 text-cream/50">Fig. {pad(active + 1)} — {story[active].title}</p>
        </div>

        <div className="relative col-span-5 col-start-8 h-[60vh]">
          <span className="absolute -left-10 top-0 h-full w-px bg-white/15" aria-hidden="true">
            <span data-rail className="block h-full w-full origin-top bg-cream" />
          </span>
          <p className="font-display text-[9rem] leading-none tracking-tighter text-white/10" aria-hidden="true">
            {pad(active + 1)}
          </p>
          {story.map((item, i) => (
            <div
              key={item.title}
              data-scene-text
              className="absolute inset-x-0 top-[38%]"
              style={{ opacity: i === 0 ? 1 : 0 }}
              aria-hidden={i !== active}
            >
              <Chapter item={item} index={i} total={n} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Mobile, tablet and reduced motion: a vertical sequence of scenes. */
function Stacked({ story }) {
  return (
    <ol className="mx-auto mt-16 max-w-3xl space-y-24 section-x lg:motion-safe:hidden">
      {story.map((item, i) => (
        <li key={item.title} className={`grid gap-8 sm:grid-cols-2 sm:items-end ${i % 2 ? 'sm:[&>*:first-child]:order-2' : ''}`}>
          <MaskReveal className="aspect-[4/5]" from={i % 2 ? 'right' : 'left'}>
            <Picture name={item.image} alt="" sizes="(min-width: 640px) 45vw, 90vw" className="block h-full w-full" imgClassName="h-full w-full object-cover" />
          </MaskReveal>
          <Reveal>
            <Chapter item={item} index={i} total={story.length} />
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export default function Story() {
  const { story } = weddingData;
  return (
    <section id="story" data-nav-dark aria-label="Our story" className="grain relative bg-espresso pb-28 pt-28 text-white lg:motion-safe:py-0">
      <div className="mx-auto max-w-3xl section-x lg:motion-safe:hidden">
        <Kicker index="05" light>
          Our Story
        </Kicker>
      </div>
      <Pinned story={story} />
      <Stacked story={story} />
    </section>
  );
}
