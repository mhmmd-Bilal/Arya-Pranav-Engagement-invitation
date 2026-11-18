import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];
export const FILM = [0.76, 0, 0.24, 1];
const VIEW = { once: true, margin: '0px 0px -12% 0px' };

/** Lifts and fades children into view once. */
export function Reveal({ children, delay = 0, y = 32, className = '', as = 'div' }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/**
 * Headline whose words rise from behind a mask. Screen readers get the plain text.
 * Pass `animate` (boolean) to drive it manually instead of on scroll.
 */
// Word masks get side padding + matching negative margin: room for script swashes without shifting layout.
export function RevealText({ text, as = 'h2', className = '', delay = 0, stagger = 0.07, animate }) {
  const Tag = as;
  const words = text.split(' ');
  const trigger =
    animate === undefined ? { whileInView: 'show', viewport: VIEW } : { animate: animate ? 'show' : 'hidden' };
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span aria-hidden="true" initial="hidden" {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }}>
        {words.map((w, i) => (
          <span key={i} className="-mx-[0.3em] inline-block overflow-hidden px-[0.3em] pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: '105%' }, show: { y: 0 } }}
              transition={{ duration: 1.2, ease: EASE }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

const CLIP_FROM = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
  center: 'inset(18% 18% 18% 18%)',
};

/** Photo revealed by a clip-path wipe while it settles from a slight zoom. */
export function MaskReveal({ children, className = '', from = 'bottom', delay = 0 }) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: CLIP_FROM[from] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={VIEW}
      transition={{ duration: 1.5, ease: FILM, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={VIEW}
        transition={{ duration: 2, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Large statement whose words fill in as it scrolls past, so the reading pace
 * follows the reader. Words wrapped in *asterisks* render in italic.
 */
export function ScrubText({ text, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] });
  const words = text.split(' ');
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text.replaceAll('*', '')}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word
            key={i}
            word={w}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            last={i === words.length - 1}
          />
        ))}
      </span>
    </p>
  );
}

function Word({ word, progress, range, last }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className={word.includes('*') ? 'font-serif italic' : undefined}>
      {word.replaceAll('*', '')}
      {last ? '' : ' '}
    </motion.span>
  );
}
