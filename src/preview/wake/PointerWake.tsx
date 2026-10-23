import { useEffect, useRef } from 'react';
import { createWake } from './renderer';
import s from './PointerWake.module.css';

export default function PointerWake() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    let dispose: (() => void) | null = null;
    let lost = false;
    function sync() {
      dispose?.();
      dispose = null;
      if (!motion.matches && pointer.matches && !lost) {
        // This decoration must never prevent the portfolio from loading.
        try {
          dispose = createWake(canvas);
        } catch {
          /* Keep the plain page background. */
        }
      }
      canvas.hidden = !dispose;
    }
    function onLost(event: Event) {
      event.preventDefault();
      lost = true;
      sync();
    }
    function onRestored() {
      lost = false;
      sync();
    }
    motion.addEventListener('change', sync);
    pointer.addEventListener('change', sync);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    sync();
    return () => {
      dispose?.();
      motion.removeEventListener('change', sync);
      pointer.removeEventListener('change', sync);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, []);
  return <canvas ref={ref} className={s.wake} aria-hidden="true" data-pointer-wake />;
}
