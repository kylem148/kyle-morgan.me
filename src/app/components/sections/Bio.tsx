import SectionRail from "../ui/SectionRail";

const STACK = ["Web", "Games", "Scripts", "Systems", "Agents", "3D"];

export default function Bio() {
  return (
    <section
      id="bio"
      className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]"
    >
      <SectionRail label="§ 01 — Bio" />
      <div className="col-span-12 md:col-span-7 border-r border-[#0f0e0c] px-6 md:px-8 py-14 md:py-16 text-[clamp(20px,2.4vw,34px)] leading-[1.3] tracking-[-0.01em]">
        From immersive web experiences to large-scale agentic systems, I build
        software that is{" "}
        <em className="italic">purposefully engineered</em>, user-focused, and
        secure.
      </div>
      <div className="col-span-12 md:col-span-4 px-6 md:px-8 py-10 md:py-16">
        <div className="mb-5 text-[11px] uppercase tracking-[0.15em] opacity-60">
          Stack
        </div>
        <ul className="divide-y divide-[#0f0e0c]/15 border-t border-[#0f0e0c]/15">
          {STACK.map((s, i) => (
            <li key={s} className="flex items-baseline gap-4 py-2.5">
              <span className="text-[10px] tabular-nums uppercase tracking-[0.2em] opacity-40">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[clamp(16px,1.4vw,22px)] tracking-[-0.01em]">
                {s}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
