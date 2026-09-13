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
import { useScrollProgress } from "@/lib/useScrollProgress";

export default function PersonalSite() {
  const progressRef = useScrollProgress();

  // <GraphScene/> only renders while the hero it shows through is on screen.
  const heroRef = useRef<HTMLElement | null>(null);

  return (
    <div className="relative min-h-screen bg-[#f2efe8] text-[#0f0e0c] font-sans">
      <GraphScene progressRef={progressRef} heroRef={heroRef} />

      <div className="relative z-10">
        <Header />
        <Hero ref={heroRef} />
        <Bio />
        <Works />
        <CurrentFocus />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
