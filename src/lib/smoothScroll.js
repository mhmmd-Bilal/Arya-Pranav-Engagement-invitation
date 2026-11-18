import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/** Starts Lenis driven by GSAP's ticker so ScrollTrigger and smooth scroll share one clock. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Smoothly scrolls to `#id` (or the top), falling back to native scrolling. */
export function scrollToId(id) {
  const target = id === 'top' ? 0 : document.getElementById(id);
  if (target === null) return;
  if (lenis) {
    // A menu link is tapped while the menu's scroll lock has Lenis stopped. Restart it now:
    // a later start() (when the lock releases) would reset Lenis and cancel this scroll.
    lenis.start();
    lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  }
  else if (target === 0) window.scrollTo({ top: 0 });
  else target.scrollIntoView();
}

export function pauseScroll(paused) {
  if (!lenis) return;
  if (paused) lenis.stop();
  else lenis.start();
}
