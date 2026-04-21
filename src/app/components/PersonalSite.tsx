"use client";

import { useEffect, useRef, useState } from "react";
import RoboticArmScene from "./RoboticArmScene";

const PROJECTS = [
  {
    n: "01",
    name: "Cal Poly Vibe Coding",
    discipline: "Club Landing Page",
    year: "2026",
    status: "Active",
    desc: "A dynamic website built for the Cal Poly Vibe Coding Club.",
    href: "https://vibecoding.calpoly.edu",
  },
  {
    n: "02",
    name: "Cal Poly Resources",
    discipline: "Full Stack Web App",
    year: "2025",
    status: "Active",
    desc: "A resource hub with clear navigation and student-focused content.",
    href: "#",
  },
  {
    n: "03",
    name: "Operation Surf",
    discipline: "Full Stack Application",
    year: "2025",
    status: "Shipped",
    desc: "Giving ease of life to Operation Surf on a Hack4Impact team.",
    href: "#",
  },
] as const;

const STACK = ["CSS", "HTML", "JavaScript", "Vite", "Unity", "Mongo"];

export default function PersonalSite() {
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(0);

  const [progressDisplay, setProgressDisplay] = useState(0);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "America/Los_Angeles",
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    lastScrollRef.current = window.scrollY;
    lastTimeRef.current = performance.now();

    let raf = 0;
    const loop = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      const y = window.scrollY;
      const dy = y - lastScrollRef.current;
      velocityRef.current = velocityRef.current * 0.85 + (dy / dt) * 0.15 * 1000;
      lastScrollRef.current = y;
      lastTimeRef.current = now;

      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = y / max;
      progressRef.current = p;
      setProgressDisplay(p);

      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f2efe8] text-[#0f0e0c] font-sans">
      <RoboticArmScene progressRef={progressRef} velocityRef={velocityRef} />

      <div className="relative z-10">
        <header
          className="sticky top-0 z-40 flex items-center justify-between border-b border-[#0f0e0c] px-6 py-2 text-[11px] uppercase tracking-[0.1em] backdrop-blur-md bg-[#f2efe8]/85"
        >
          <span>Kyle Morgan — Portfolio № 007</span>
          <nav className="hidden md:flex gap-6">
            <a href="#bio" className="hover:underline underline-offset-4">Bio</a>
            <a href="#works" className="hover:underline underline-offset-4">Works</a>
            <a href="#now" className="hover:underline underline-offset-4">Now</a>
            <a href="#contact" className="hover:underline underline-offset-4">Contact</a>
          </nav>
          <span className="tabular-nums tracking-[0.05em]">
            6 DOF · idle · <span>{(progressDisplay * 100).toFixed(1)}%</span>
          </span>
          <span className="hidden sm:inline tabular-nums tracking-[0.05em]">
            SLO / PST / {clock || "—"}
          </span>
        </header>

        <section className="relative flex min-h-[calc(100svh-34px)] flex-col justify-between px-6 py-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2 tabular-nums tracking-[0.05em] text-sm leading-tight">
              Vol. I
              <br />
              N° 007
              <br />
              MMXXVI
            </div>
            <div className="col-span-8 text-center">
              <div className="text-[11px] uppercase tracking-[0.3em] opacity-60">
                ◆ Built to reach. Trained to wait.
              </div>
            </div>
            <div className="col-span-2 text-right tabular-nums tracking-[0.05em] text-sm leading-tight">
              Est.
              <br />
              2022
              <br />
              4 yrs
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="font-black uppercase tracking-[-0.06em] leading-[0.88] mix-blend-multiply text-[clamp(72px,14vw,220px)]">
              Kyle Morgan
            </h1>
            <div className="mt-4 text-[clamp(12px,1.4vw,20px)] uppercase tracking-[0.3em]">
              Software · Engineer · San Luis Obispo · CA
            </div>
            <div className="mt-8 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em]">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for freelance</span>
            </div>
          </div>
        </section>

        <section
          id="bio"
          className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]/70 backdrop-blur-sm"
        >
          <div className="col-span-1 flex items-end border-r border-[#0f0e0c] p-4">
            <span
              className="text-[11px] uppercase tracking-[0.15em]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              § 01 — Bio
            </span>
          </div>
          <div className="col-span-12 md:col-span-7 border-r border-[#0f0e0c] px-6 md:px-8 py-14 md:py-16 text-[clamp(20px,2.4vw,34px)] leading-[1.3] tracking-[-0.01em]">
            From immersive web experiences to large-scale agentic systems, I&rsquo;ve
            learned to architect projects that are{" "}
            <em className="italic">purposefully engineered</em>, user-focused,
            and secure. My goal is to leverage technology to create innovative
            solutions that make a positive impact on people&rsquo;s lives.
          </div>
          <div className="col-span-12 md:col-span-4 px-6 md:px-8 py-10 md:py-16 text-sm leading-[1.6]">
            <div className="mb-4 text-[11px] uppercase tracking-[0.15em] opacity-60">
              ◆ Stack
            </div>
            <ul className="grid grid-cols-2 gap-y-2">
              {STACK.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-[2px] w-3 bg-[#0f0e0c]" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8 mb-4 text-[11px] uppercase tracking-[0.15em] opacity-60">
              ◆ Principles
            </div>
            <ol className="grid gap-2 pl-5 list-decimal">
              <li><strong>Build it simple.</strong></li>
              <li><strong>Ship it soon.</strong></li>
              <li><strong>Keep it legible.</strong></li>
              <li><strong>Care about the craft.</strong></li>
            </ol>
          </div>
        </section>

        <section
          id="works"
          className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]/85"
        >
          <div className="col-span-1 flex items-end border-r border-[#0f0e0c] p-4">
            <span
              className="text-[11px] uppercase tracking-[0.15em]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              § 02 — Works
            </span>
          </div>
          <div className="col-span-11 p-6">
            <div className="grid grid-cols-[1fr_3fr_2fr_2fr_1fr] gap-4 border-b border-[#0f0e0c] py-3 text-[11px] uppercase tracking-[0.1em]">
              <div>Index</div>
              <div>Project</div>
              <div className="hidden sm:block">Discipline</div>
              <div className="hidden sm:block">Year</div>
              <div>Status</div>
            </div>
            {PROJECTS.map((p) => (
              <a
                key={p.n}
                href={p.href}
                className="group grid grid-cols-[1fr_3fr_2fr_2fr_1fr] items-baseline gap-4 border-b border-[#0f0e0c]/20 py-7 text-inherit no-underline transition-colors hover:bg-[#0f0e0c]/[0.03]"
              >
                <div className="tabular-nums tracking-[0.05em]">№ {p.n}</div>
                <div>
                  <div className="text-[22px] sm:text-[32px] font-medium leading-[1.1] tracking-[-0.02em] group-hover:underline underline-offset-4">
                    {p.name}
                  </div>
                  <div className="mt-1 text-[13px] opacity-70 sm:hidden">
                    {p.discipline} · {p.year}
                  </div>
                  <div className="mt-2 text-[13px] opacity-75 max-w-xl">
                    {p.desc}
                  </div>
                </div>
                <div className="hidden sm:block text-sm">{p.discipline}</div>
                <div className="hidden sm:block tabular-nums tracking-[0.05em]">{p.year}</div>
                <div className="text-[11px] uppercase tracking-[0.1em]">
                  <span
                    className={`mr-2 inline-block h-1.5 w-1.5 rounded-full ${
                      p.status === "Active" ? "bg-emerald-500" : "bg-neutral-400"
                    }`}
                  />
                  {p.status}
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          id="now"
          className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]/70 backdrop-blur-sm min-h-[55vh]"
        >
          <div className="col-span-1 flex items-end border-r border-[#0f0e0c] p-4">
            <span
              className="text-[11px] uppercase tracking-[0.15em]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              § 03 — Now
            </span>
          </div>
          <div className="col-span-11 px-6 md:px-8 py-14 md:py-16">
            <div className="mb-8 flex justify-between text-[11px] uppercase tracking-[0.15em]">
              <span>◆ Currently · Spring MMXXVI</span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <div className="max-w-5xl text-[clamp(22px,3vw,40px)] leading-[1.3] tracking-[-0.01em]">
              Studying computer science at{" "}
              <em className="italic">Cal Poly SLO</em>. Shipping side projects
              in Vite, Unity, and Mongo. Open to conversations about{" "}
              <span className="underline underline-offset-4">
                building things people actually use
              </span>
              .
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="grid grid-cols-12 border-t border-b border-[#0f0e0c] bg-[#f2efe8]/85"
        >
          <div className="col-span-1 flex items-end border-r border-[#0f0e0c] p-4">
            <span
              className="text-[11px] uppercase tracking-[0.15em]"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              § 04 — Contact
            </span>
          </div>
          <div className="col-span-12 md:col-span-7 border-r border-[#0f0e0c] px-6 md:px-8 py-16 md:py-20">
            <div className="font-black uppercase leading-[0.9] tracking-[-0.05em] mix-blend-multiply text-[clamp(72px,13vw,180px)]">
              Write
              <br />
              <em className="font-light italic">in.</em>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center p-8 md:p-10">
            <div className="grid gap-4 text-[15px]">
              {[
                ["Email", "kyle@themorganization.com", "mailto:kyle@themorganization.com"],
                ["LinkedIn", "in/kyle-morgan", "https://www.linkedin.com/in/kyle-morgan"],
                ["GitHub", "kylem148", "https://github.com/kylem148"],
                ["Instagram", "@kyle.morgan", "https://instagram.com"],
              ].map(([k, v, href]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-[#0f0e0c]/25 pb-2.5"
                >
                  <span className="tabular-nums tracking-[0.05em] text-[12px] uppercase">{k}</span>
                  <a
                    href={href}
                    className="text-inherit underline underline-offset-[3px] hover:opacity-70"
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {v}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="flex flex-wrap gap-3 justify-between bg-[#f2efe8]/90 px-6 py-6 text-[11px] uppercase tracking-[0.1em]">
          <span>Colophon — 6-DOF arm · 12-col grid · Rendered in WebGL</span>
          <span>© Kyle Morgan · MMXXII–MMXXVI</span>
          <span>End of document. ∎</span>
        </footer>
      </div>
    </div>
  );
}
