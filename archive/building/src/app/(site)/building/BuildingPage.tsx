import Link from "next/link";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BuildingProject from "../components/sections/BuildingProject";
import { BUILDING_PROJECTS } from "@/content/building-projects";

export default function BuildingPage() {
  return (
    <div className="min-h-screen bg-[#f2efe8] text-[#0f0e0c] font-sans">
      <Header />

      <main>
      <section className="border-b border-[#0f0e0c] px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-baseline justify-between gap-6">
          <h1 className="font-semibold uppercase tracking-[-0.03em] leading-[0.9] text-[clamp(56px,10vw,140px)]">
            Building
          </h1>
          <Link
            href="/#focus"
            className="whitespace-nowrap text-[11px] uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-70"
          >
            ← Back
          </Link>
        </div>
        <p className="mt-6 max-w-3xl text-[clamp(18px,2vw,26px)] italic leading-[1.4] opacity-75">
          An evolving record of the agentic systems I&rsquo;m building: Where each
          project stands, the decisions that shaped them, and lessons learned along
          the way.
        </p>
      </section>

      {BUILDING_PROJECTS.map((p) => (
        <BuildingProject key={p.id} project={p} />
      ))}
      </main>

      <Footer />
    </div>
  );
}
