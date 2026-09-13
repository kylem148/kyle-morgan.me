"use client";

import { useEffect, useState } from "react";
import SectionRail from "../ui/SectionRail";
import AgentGlobe from "../three/AgentGlobe";
import { AGENTS, MANAGER, type Agent } from "@/content/agents";

const ALL_AGENTS = [MANAGER, ...AGENTS];

export default function CurrentFocus() {
  const [hover, setHover] = useState<Agent | null>(null);
  const [idleId, setIdleId] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!hover) return;
    const onMove = (e: PointerEvent) =>
      setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [hover]);

  // Idle pulse: while nothing is hovered, cycle the red highlight through
  // agents so the globe reads as interactive without a card appearing.
  // On hover-start we clear the idle focus so the eventual de-hover fades
  // through an all-neutral beat before the next idle node lights up.
  useEffect(() => {
    if (hover) {
      const clear = setTimeout(() => setIdleId(null), 0);
      return () => clearTimeout(clear);
    }
    // Mobile has no hover, so the card below the globe is the only way to
    // read each agent's thought. Dwell scales with the thought's length
    // (~240wpm plus a beat for the card fade-in) so each one can be finished.
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;
    const dwellMs = (id: string) => {
      if (!isMobile) return 2500;
      const words = AGENTS.find((a) => a.id === id)!.thought.split(/\s+/).length;
      return 2500 + words * 250;
    };
    let current: string | null = null;
    const step = () => {
      const pool = AGENTS.filter((a) => a.id !== current);
      current = pool[Math.floor(Math.random() * pool.length)].id;
      setIdleId(current);
      timer = setTimeout(step, dwellMs(current));
    };
    let timer = setTimeout(step, 1000);
    return () => clearTimeout(timer);
  }, [hover]);

  return (
    <>
      <section
        id="focus"
        className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]"
      >
        <SectionRail label="Current Focus" />
        <div className="col-span-11 md:col-span-5 md:border-r border-[#0f0e0c] flex flex-col justify-center px-6 md:px-8 py-10">
          <p className="text-[clamp(20px,2.2vw,30px)] leading-[1.3] tracking-[-0.01em]">
            Currently exploring how multi-agent systems should be structured.
            <span className="hidden md:inline"> Hover a node to see notes.</span>
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-start gap-3 px-4 pt-4 pb-2">
          <div className="relative aspect-square w-full max-w-[720px] -my-[8%]">
            <AgentGlobe
              focusId={hover?.id ?? idleId}
              hoverActive={hover !== null}
              onHoverChange={setHover}
            />
          </div>
          {/* Every card sits in the same grid cell and only the focused one is
              visible, so the box is always as tall as the longest note and the
              page below never shifts as the cards rotate. */}
          <div className="md:hidden grid w-full max-w-[720px] px-2 pt-4 pb-8">
            {ALL_AGENTS.map((agent) => {
              const active = agent.id === (hover?.id ?? idleId);
              return (
                <div
                  key={agent.id}
                  className={`col-start-1 row-start-1 ${active ? "" : "invisible"}`}
                  style={
                    active
                      ? { animation: "agent-card-in 500ms ease-out both" }
                      : undefined
                  }
                >
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#d46a3a]">
                    {agent.label}
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.45]">
                    {agent.thought}
                  </div>
                </div>
              );
            })}
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
            transform:
              cursor.x + 250 > window.innerWidth
                ? "translate(calc(-100% - 24px), -50%)"
                : "translate(24px, -50%)",
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
