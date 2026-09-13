"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks window scroll progress in [0, 1].
 *
 * Returns a ref rather than state so high-frequency consumers (render loops)
 * can read it without triggering React re-renders.
 */
export function useScrollProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const y = window.scrollY;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      progressRef.current = y / max;
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return progressRef;
}
