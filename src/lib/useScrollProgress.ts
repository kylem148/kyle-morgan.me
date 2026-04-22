"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks window scroll progress in [0, 1].
 *
 * Returns a ref for high-frequency consumers (render loops that shouldn't
 * trigger React re-renders) and a state value for UI that wants to reflect it.
 */
export function useScrollProgress() {
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const y = window.scrollY;
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const p = y / max;
      progressRef.current = p;
      setProgress(p);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return { progressRef, progress };
}
