"use client";

import { useEffect, useState } from "react";
import SectionRail from "../ui/SectionRail";
import AgentGlobe from "../three/AgentGlobe";
import type { Agent } from "@/content/agents";

export default function CurrentFocus() {
  const [hover, setHover] = useState<Agent | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!hover) return;
    const onMove = (e: PointerEvent) =>
      setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [hover]);

  return (
    <>
      <section
        id="focus"
        className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]"
      >
        <SectionRail label="§ 03 — Current Focus" />
        <div className="col-span-12 md:col-span-5 border-r border-[#0f0e0c] px-6 md:px-8 py-14 md:py-20">
          <div className="mb-6 text-[11px] uppercase tracking-[0.15em] opacity-60">
            Agent architecture
          </div>
          <p className="text-[clamp(20px,2.2vw,30px)] leading-[1.3] tracking-[-0.01em]">
            Exploring how multi-agent systems should be structured.{" "}
            <em className="italic">Managers</em> reason.{" "}
            <em className="italic">Workers</em> act.{" "}
            <em className="italic">Checkers</em> validate.
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-center gap-4 p-4">
          <p className="w-full text-[14px] italic leading-[1.5] opacity-60">
            Each node carries a thought. Hover to read.
          </p>
          <div className="relative aspect-square w-full">
            <AgentGlobe focusId={hover?.id ?? null} onHoverChange={setHover} />
          </div>
        </div>
      </section>

      {hover && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-30 hidden md:block"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform: "translate(24px, -50%)",
          }}
        >
          <div className="w-[260px] rounded-sm bg-[#0f0e0c] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#d46a3a]">
              {hover.label}
            </div>
            <div className="mt-2 text-[14px] leading-[1.4] text-[#f2efe8]">
              {hover.thought}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
