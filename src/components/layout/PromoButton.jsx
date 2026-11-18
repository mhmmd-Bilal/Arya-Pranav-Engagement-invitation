import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { EASE } from '../common/Reveal';

// Small floating promo button. Opens a WhatsApp chat with this number.
const PROMO = {
  phone: '918129896670', // country code + number, digits only
  message: 'Hi! I saw a wedding invitation website and would love one like this for my wedding.',
  label: 'Get a website like this',
};
const PROMO_URL = `https://wa.me/${PROMO.phone}?text=${encodeURIComponent(PROMO.message)}`;

/** True while the button sits over the hero or a dark section, so it can switch to light text. */
function useOverDark() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const sections = [...document.querySelectorAll('#top, [data-nav-dark]')];
    const Y = 40; // vertical centre of the button
    const check = () =>
      setDark(sections.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= Y && r.bottom > Y;
      }));
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);
  return dark;
}

export default function PromoButton() {
  const dark = useOverDark();
  return (
    <motion.a
      href={PROMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group label fixed right-4 top-4 z-50 inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[0.6rem] tracking-[0.2em] backdrop-blur-[2px] transition-colors duration-500 sm:right-6 sm:top-6 ${
        dark
          ? 'border-white/35 text-white/85 hover:border-white hover:text-white'
          : 'border-espresso/25 text-espresso/75 hover:border-espresso hover:text-espresso'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: EASE, delay: 1.2 }}
    >
      {PROMO.label}
      <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      <span className="sr-only">(opens WhatsApp chat with +91 81298 96670)</span>
    </motion.a>
  );
}
