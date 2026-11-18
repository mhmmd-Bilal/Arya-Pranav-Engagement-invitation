import { useEffect, useState } from 'react';
import { timeLeft } from '../utils/countdown';

export function useCountdown(target) {
  const [left, setLeft] = useState(() => timeLeft(target));
  useEffect(() => {
    if (left.done) return undefined;
    const id = setInterval(() => setLeft(timeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target, left.done]);
  return left;
}
