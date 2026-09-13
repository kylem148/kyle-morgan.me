"use client";

import { useRef } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Hero from "./sections/Hero";
import Bio from "./sections/Bio";
import Works from "./sections/Works";
import CurrentFocus from "./sections/CurrentFocus";
import Contact from "./sections/Contact";
import GraphScene from "./three/GraphScene";
import { useClock } from "@/lib/useClock";
import { useScrollProgress } from "@/lib/useScrollProgress";

export default function PersonalSite() {
  const { progressRef, progress } = useScrollProgress();
  const clock = useClock();

  // Shared with <Works/> — hovered project's graphId drives subgraph highlight
  // inside <GraphScene/>. A ref (not state) so the 3D loop doesn't re-render.
  const hoverIdRef = useRef<string | null>(null);

  return (
    <div className="relative min-h-screen bg-[#f2efe8] text-[#0f0e0c] font-sans">
      <GraphScene progressRef={progressRef} hoverIdRef={hoverIdRef} />

      <div className="relative z-10">
        <Header progress={progress} clock={clock} />
        <Hero />
        <Bio />
        <Works hoverIdRef={hoverIdRef} />
        <CurrentFocus />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
