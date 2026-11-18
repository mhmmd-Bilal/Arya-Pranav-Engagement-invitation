/** Remaining time from `now` until `target` (both ms or Date). Never negative. */
export function timeLeft(target, now = Date.now()) {
  const diff = Math.max(0, new Date(target).getTime() - new Date(now).getTime());
  return {
    done: diff === 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}
