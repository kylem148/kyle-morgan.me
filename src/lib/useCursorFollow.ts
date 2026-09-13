"use client";

import { useCallback, useEffect, useRef } from "react";

type Point = { x: number; y: number };

type Options = {
  /** Follower box size, used to flip sides and keep it on screen. */
  width: number;
  height: number;
  /** Gap between the cursor and the box. */
  offset: number;
  /** Fade-out length. Showing again after this long snaps instead of gliding. */
  hideMs: number;
};

type Controller = {
  show: (at?: Point) => boolean;
  hide: () => void;
};

// Viewport margin the box never crosses.
const EDGE = 16;
// Follow tightness, per second. Higher trails the cursor less.
const SPEED = 14;

/**
 * Eases a fixed-position element toward the cursor.
 *
 * Position is written straight to the element's transform from a rAF loop, so
 * pointer movement never re-renders React. The loop only runs while the
 * element is still catching up.
 *
 * `show` returns true when the element was fully hidden, meaning it snapped to
 * the cursor instead of gliding there.
 */
export function useCursorFollow<T extends HTMLElement>({
  width,
  height,
  offset,
  hideMs,
}: Options) {
  const ref = useRef<T | null>(null);
  const controller = useRef<Controller | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let visible = false;
    let hiddenAt = -Infinity;
    let raf = 0;
    let last = 0;

    const aim = () => {
      // Sit right of the cursor, flipping left when there's no room.
      const flip = pointer.x + offset + width + EDGE > window.innerWidth;
      target.x = flip ? pointer.x - offset - width : pointer.x + offset;
      target.y = Math.min(
        Math.max(pointer.y - height / 2, EDGE),
        window.innerHeight - height - EDGE,
      );
    };

    const paint = () => {
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    };

    const loop = (now: number) => {
      const dt = last ? Math.min(now - last, 50) / 1000 : 1 / 60;
      last = now;
      // Frame-rate independent easing, so 120Hz displays don't follow tighter.
      const k = reducedMotion.matches ? 1 : 1 - Math.exp(-SPEED * dt);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      paint();
      if (Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.1) {
        raf = window.requestAnimationFrame(loop);
      } else {
        raf = 0;
        last = 0;
      }
    };

    const start = () => {
      if (!raf) raf = window.requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (visible) {
        aim();
        start();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    controller.current = {
      show(at) {
        if (at) {
          pointer.x = at.x;
          pointer.y = at.y;
        }
        aim();
        const fresh = !visible && performance.now() - hiddenAt > hideMs;
        visible = true;
        if (fresh) {
          // Jump to the cursor rather than gliding in from where it faded out.
          current.x = target.x;
          current.y = target.y;
          paint();
        } else {
          start();
        }
        return fresh;
      },
      hide() {
        if (!visible) return;
        visible = false;
        hiddenAt = performance.now();
      },
    };

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.cancelAnimationFrame(raf);
      controller.current = null;
    };
  }, [width, height, offset, hideMs]);

  const show = useCallback(
    (at?: Point) => controller.current?.show(at) ?? true,
    [],
  );
  const hide = useCallback(() => controller.current?.hide(), []);

  return { ref, show, hide };
}
