import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { EASE } from '../common/Reveal';
import { music } from '../../lib/music';

// Bottom-left so it never collides with the promo button (top-right).
// mix-blend-difference keeps it visible over both light and dark sections.
export default function MuteButton() {
  const [off, setOff] = useState(() => music.paused || music.muted);

  function toggle() {
    if (music.paused) {
      // e.g. returning visitor who skipped the envelope: start it now
      music.muted = false;
      music.play().catch(() => {});
      setOff(false);
    } else {
      music.muted = !music.muted;
      setOff(music.muted);
    }
  }

  const Icon = off ? VolumeX : Volume2;
  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={off ? 'Play music' : 'Mute music'}
      aria-pressed={!off}
      className="fixed bottom-4 left-4 z-50 grid size-10 place-items-center rounded-full border border-white/50 text-white mix-blend-difference transition-colors duration-500 hover:border-white sm:bottom-6 sm:left-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 1.2 }}
    >
      <Icon className="size-4" aria-hidden="true" />
    </motion.button>
  );
}
