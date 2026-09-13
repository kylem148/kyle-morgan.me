"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks window scroll progress in [0, 1].
 *
 * Returns a ref rather than state so high-frequency consumers (render loops)
 * can read it without triggering React re-renders. Updated from scroll and
 * resize events, so nothing runs while the page sits still.
 */
export function useScrollProgress() {
  const progressRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    let max = 1;

    const update = () => {
      progressRef.current = window.scrollY / max;
    };
    const measure = () => {
      // clientHeight follows the initial containing block, which mobile
      // browsers keep fixed as their toolbar collapses. innerHeight follows the
      // toolbar, which would nudge progress mid-scroll.
      max = Math.max(1, root.scrollHeight - root.clientHeight);
      update();
    };

    measure();
    // Page height changes as images and fonts load.
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return progressRef;
}
