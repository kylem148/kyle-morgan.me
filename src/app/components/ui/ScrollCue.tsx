"use client";

import { useEffect, useState } from "react";

export default function ScrollCue() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 3500);
    const onScroll = () => {
      if (window.scrollY > 48) {
        dismissed = true;
        clearTimeout(timer);
        setVisible(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.4em] transition-opacity duration-700 ${
        visible ? "opacity-60" : "opacity-0"
      }`}
    >
      Scroll ↓
    </span>
  );
}
