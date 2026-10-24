import { useEffect, useEffectEvent, useSyncExternalStore, type RefObject } from 'react';

const subscribeMotion = (callback: () => void) => {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const isReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, isReduced, () => true);
}

/** Keep the tour clock independent of drawing, resizing and material changes. */
export function useTour(
  stage: RefObject<HTMLDivElement | null>,
  playing: boolean,
  step: number,
  advance: () => void,
) {
  const onAdvance = useEffectEvent(advance);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!stage.current || !playing || reduced) return;
    let visible = false;
    let timer = 0;
    const synchronize = () => {
      if (!visible || document.hidden) {
        window.clearTimeout(timer);
        timer = 0;
      } else if (!timer) {
        timer = window.setTimeout(() => onAdvance(), 4000);
      }
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      synchronize();
    });
    observer.observe(stage.current);
    document.addEventListener('visibilitychange', synchronize);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', synchronize);
    };
  }, [stage, playing, step, reduced]);
}
