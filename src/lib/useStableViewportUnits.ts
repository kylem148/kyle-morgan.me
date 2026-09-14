"use client";

import { useEffect } from "react";

/**
 * Pins the --svh and --lvh custom properties (see globals.css) to pixels.
 *
 * Some mobile browsers (Firefox and other WKWebView browsers on iOS) resize the
 * page itself when their toolbar slides away on scroll, which recomputes every
 * svh/lvh/vh size and makes the layout jump. This reads the browser's own 1svh
 * and 1lvh, then keeps them through toolbar-sized changes on touch devices.
 * Real resizes (rotation, split screen, a resized window) re-measure.
 */
export function useStableViewportUnits() {
  useEffect(() => {
    const root = document.documentElement;
    const touch = window.matchMedia("(pointer: coarse)");
    let width = 0;
    let height = 0;

    const measure = () => {
      width = root.clientWidth;
      height = root.clientHeight;
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:fixed;top:0;width:0;visibility:hidden;pointer-events:none;height:100svh";
      document.body.append(probe);
      const svh = probe.getBoundingClientRect().height / 100;
      probe.style.height = "100lvh";
      const lvh = probe.getBoundingClientRect().height / 100;
      probe.remove();
      root.style.setProperty("--svh", `${svh}px`);
      root.style.setProperty("--lvh", `${lvh}px`);
    };

    const onResize = () => {
      // On a touch device, a height-only change under 25% is a toolbar moving,
      // so keep the pinned values. Same rule as GSAP ScrollTrigger's
      // ignoreMobileResize. Anything bigger is a real resize.
      const toolbar =
        touch.matches &&
        root.clientWidth === width &&
        Math.abs(root.clientHeight - height) <= root.clientHeight * 0.25;
      if (!toolbar) measure();
    };

    measure();
    window.addEventListener("resize", onResize);
    // A rotation while the tab was hidden or in the back/forward cache may not
    // fire resize, so check again when the page comes back.
    window.addEventListener("pageshow", onResize);
    document.addEventListener("visibilitychange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pageshow", onResize);
      document.removeEventListener("visibilitychange", onResize);
      root.style.removeProperty("--svh");
      root.style.removeProperty("--lvh");
    };
  }, []);
}
