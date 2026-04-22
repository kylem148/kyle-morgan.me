"use client";

import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BuildingProject from "../components/sections/BuildingProject";
import { BUILDING_PROJECTS } from "@/content/building-projects";
import { useClock } from "@/lib/useClock";
import { useScrollProgress } from "@/lib/useScrollProgress";

export default function BuildingPage() {
  const { progress } = useScrollProgress();
  const clock = useClock();

  return (
    <div className="min-h-screen bg-[#f2efe8] text-[#0f0e0c] font-sans">
      <Header progress={progress} clock={clock} />

      <section className="border-b border-[#0f0e0c] px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-baseline justify-between gap-6">
          <h1 className="font-black uppercase tracking-[-0.05em] leading-[0.9] text-[clamp(72px,13vw,200px)]">
            Building
          </h1>
          <Link
            href="/"
            className="whitespace-nowrap text-[11px] uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-70"
          >
            ← Back
          </Link>
        </div>
        <p className="mt-6 max-w-3xl text-[clamp(18px,2vw,26px)] italic leading-[1.4] opacity-75">
          Honest progress reports from agentic projects I&rsquo;m shipping
          right now. Rough edges included.
        </p>
      </section>

      {BUILDING_PROJECTS.map((p, i) => (
        <BuildingProject key={p.id} project={p} index={i} />
      ))}

      <Footer />
    </div>
  );
}
