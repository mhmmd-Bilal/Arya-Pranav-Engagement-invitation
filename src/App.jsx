import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import PromoButton from './components/layout/PromoButton';
import Cursor from './components/common/Cursor';
import Intro from './components/sections/Intro';
import Hero from './components/sections/Hero';
// import Invitation from './components/sections/Invitation';
// import Couple from './components/sections/Couple';
// import Story from './components/sections/Story';
import Events from './components/sections/Events';
import Venue from './components/sections/Venue';
// import Gallery from './components/sections/Gallery';
import Countdown from './components/sections/Countdown';
// import RSVP from './components/sections/RSVP';
import Closing from './components/sections/Closing';
import { useScrollLock } from './hooks/useScrollLock';
import { ScrollTrigger } from './hooks/useGsap';
import { startSmoothScroll } from './lib/smoothScroll';
import { weddingData } from './data/weddingData';

const SEEN_KEY = 'garden-edit:opened';
const seenThisSession = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

export default function App() {
  const [opened, setOpened] = useState(seenThisSession);
  useScrollLock(!opened);

  useEffect(() => {
    document.title = `${weddingData.bride.name} & ${weddingData.groom.name}`;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return startSmoothScroll();
  }, []);

  // Fonts and the unlocked scrollbar change layout; re-measure scroll scenes once settled.
  useEffect(() => {
    if (!opened) return;
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, [opened]);

  const open = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* private mode: the opening simply plays again next visit */
    }
    setOpened(true);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#events"
        className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-espresso"
      >
        Skip to events
      </a>
      <AnimatePresence>{!opened && <Intro key="intro" onDone={open} />}</AnimatePresence>
      {opened && <PromoButton />}
      <Cursor />
      <main inert={!opened ? '' : undefined}>
        <Hero ready={opened} />
        {/* <Invitation /> */}
        {/* <Couple /> */}
        {/* <Story /> */}
        <Events />
        <Venue />
        {/* <Gallery /> */}
        <Countdown />
        {/* <RSVP /> */}
      </main>
      <Closing />
    </MotionConfig>
  );
}
