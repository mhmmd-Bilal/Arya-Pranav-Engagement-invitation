import { useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import Picture from '../common/Picture';
import { JasmineRow } from '../common/Jasmine';
import { Reveal } from '../common/Reveal';
import { useGsap } from '../../hooks/useGsap';
import { scrollToId } from '../../lib/smoothScroll';
import { weddingData } from '../../data/weddingData';

export default function Closing() {
  const { bride, groom, closing, social } = weddingData;
  const ref = useRef(null);

  // The final photograph opens from a framed window to full-bleed, like a film's last shot.
  useGsap(ref, (gsap, { desktop }) => {
    const st = { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true }; // end at page bottom so the frame always fully opens, however short the footer
    gsap.fromTo('[data-final-frame]', { clipPath: desktop ? 'inset(14% 22% 14% 22%)' : 'inset(10% 8% 10% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: st });
    gsap.fromTo('[data-final-img]', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: st });
  });

  return (
    <footer ref={ref} data-nav-dark className="grain relative overflow-hidden bg-espresso text-white">
      <div className="relative min-h-[100svh]">
        <div data-final-frame className="absolute inset-0 overflow-hidden">
          <div data-final-img className="h-full w-full">
            <Picture name={closing.image} alt="Wedding rings on a bouquet of pink peonies" sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover object-center" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-espresso/30" />
        </div>
        <JasmineRow layout={[[4, 10, 0.8], [9, 6, 0.6], [88, 7, 0.6], [94, 11, 0.8]]} className="z-[2] max-md:hidden" />

        <div className="frame relative z-[2] flex min-h-[100svh] flex-col justify-end pb-16 pt-32">
          <Reveal className="max-w-2xl">
            <p className="font-serif text-2xl italic leading-snug text-white/90 sm:text-3xl">{closing.message}</p>
            <p className="mt-8 font-serif text-xl italic text-cream sm:text-2xl">
              {closing.signOff}
              <br />
              {bride.name} &amp; {groom.name}
            </p>
          </Reveal>
        </div>
      </div>

      <div className="frame relative z-[2] flex flex-col items-end gap-6 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-end">
        {social.length > 0 && (
          <ul className="flex gap-6">
            {social.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="label text-white/60 hover:text-cream">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId('top');
          }}
          className="label group inline-flex min-h-11 items-center gap-3 text-white/70 hover:text-cream"
        >
          Back to the beginning
          <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
