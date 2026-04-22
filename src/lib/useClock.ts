"use client";

import { useEffect, useState } from "react";

/**
 * Returns a 24-hour HH:MM:SS clock string for the given IANA timezone.
 * Empty string until the first tick so server/client HTML matches.
 */
export function useClock(timeZone = "America/Los_Angeles") {
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          timeZone,
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return clock;
}
