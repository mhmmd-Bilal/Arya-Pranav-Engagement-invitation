import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Desktop-only cursor companion: a small ring that trails the pointer and
 * opens into a lens with a label over anything marked data-cursor="View".
 * The system cursor stays visible, so nothing is lost if this is disabled.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 36, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 380, damping: 36, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    setEnabled(mq.matches);
    const onChange = (e) => setEnabled(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setLabel(e.target.closest?.('[data-cursor]')?.dataset.cursor ?? '');
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full border border-cream"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: label ? 88 : 12,
        height: label ? 88 : 12,
        backgroundColor: label ? 'rgba(225,213,191,0.95)' : 'rgba(225,213,191,0)',
        borderColor: label ? 'rgba(225,213,191,0)' : 'rgba(225,213,191,0.9)',
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className={`label text-[0.56rem] text-espresso transition-opacity duration-300 ${label ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </motion.div>
  );
}
