import { useEffect } from 'react';
import { pauseScroll } from '../lib/smoothScroll';

let locks = 0;

/** Locks page scroll while `active`; nested locks (menu + lightbox) are counted. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    locks += 1;
    document.documentElement.style.overflow = 'hidden';
    pauseScroll(true);
    return () => {
      locks -= 1;
      if (locks === 0) {
        document.documentElement.style.overflow = '';
        pauseScroll(false);
      }
    };
  }, [active]);
}
