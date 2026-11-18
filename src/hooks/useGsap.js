import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Runs scroll animations scoped to `scope` and reverts them on unmount.
 * `setup(gsap, conditions)` only runs when the user has not asked for reduced
 * motion; `conditions.desktop` is true at ≥ 1024px.
 */
export function useGsap(scope, setup, deps = []) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scope);
    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 1024px)' },
      (ctx) => (ctx.conditions.motion ? setup(gsap, ctx.conditions) : undefined),
    );
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { ScrollTrigger };
