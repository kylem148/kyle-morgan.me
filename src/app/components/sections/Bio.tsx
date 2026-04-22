import SectionRail from "../ui/SectionRail";

const STACK = ["Python", "React", "Java", "Postgres", "C", "AWS"];

export default function Bio() {
  return (
    <section
      id="bio"
      className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]"
    >
      <SectionRail label="§ 01 — Bio" />
      <div className="col-span-11 md:col-span-7 md:border-r border-[#0f0e0c] px-6 md:px-8 py-14 md:py-16 text-[clamp(20px,2.4vw,34px)] leading-[1.3] tracking-[-0.01em]">
        From immersive web experiences to large-scale agentic systems, I build
        software that is{" "}
        <em className="italic">purposefully engineered</em>, user-focused, and
        secure.
      </div>
      <div className="col-span-12 md:col-span-4 px-6 md:px-8 py-10 md:py-16 text-sm">
        <div className="mb-4 text-[11px] uppercase tracking-[0.15em] opacity-60">
          Stack
        </div>
        <ul className="grid grid-cols-2 gap-y-2">
          {STACK.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="h-[2px] w-3 bg-[#0f0e0c]" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
