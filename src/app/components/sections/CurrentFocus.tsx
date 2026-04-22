"use client";

import Link from "next/link";
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
    const ids = AGENTS.map((a) => a.id);
    const pick = (current: string | null) => {
      const pool = current ? ids.filter((id) => id !== current) : ids;
      return pool[Math.floor(Math.random() * pool.length)];
    };
    // Mobile gets a slower cycle since the card below the globe is the only
    // way to read each agent's thought — need dwell time for reading.
    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;
    const intervalMs = isMobile ? 4000 : 2500;
    const initial = setTimeout(() => setIdleId((cur) => pick(cur)), 1000);
    const interval = setInterval(() => {
      setIdleId((cur) => pick(cur));
    }, intervalMs);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [hover]);

  return (
    <>
      <section
        id="focus"
        className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]"
      >
        <SectionRail label="§ 03 — Current Focus" />
        <div className="col-span-11 md:col-span-5 md:border-r border-[#0f0e0c] flex flex-col justify-center px-6 md:px-8 py-10">
          <div className="mb-6 text-[11px] uppercase tracking-[0.15em] opacity-60">
            Agent architecture
          </div>
          <p className="text-[clamp(20px,2.2vw,30px)] leading-[1.3] tracking-[-0.01em]">
            Currently exploring how multi-agent systems should be structured.{" "}
            <em className="italic">Managers</em> reason.{" "}
            <em className="italic">Workers</em> act.{" "}
            <em className="italic">Checkers</em> validate.
          </p>
          <Link
            href="/building"
            className="mt-8 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.2em] underline underline-offset-[5px] hover:opacity-70"
          >
            See what I&rsquo;m building <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-start gap-3 px-4 pt-4 pb-2">
          <p className="hidden md:block w-full max-w-[720px] text-[14px] italic leading-[1.5] opacity-60">
            Notes from projects. Hover a node.
          </p>
          <div className="relative aspect-square w-full max-w-[720px] -my-[8%]">
            <AgentGlobe
              focusId={hover?.id ?? idleId}
              hoverActive={hover !== null}
              onHoverChange={setHover}
            />
          </div>
          {(() => {
            const id = hover?.id ?? idleId;
            const agent = id ? ALL_AGENTS.find((a) => a.id === id) : null;
            return (
              <div className="md:hidden w-full max-w-[720px] min-h-[110px] px-2 pt-4 pb-8">
                {agent ? (
                  <div
                    key={agent.id}
                    style={{ animation: "agent-card-in 500ms ease-out both" }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#d46a3a]">
                      {agent.label}
                    </div>
                    <div className="mt-2 text-[14px] leading-[1.45]">
                      {agent.thought}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })()}
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
