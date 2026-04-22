import SectionRail from "../ui/SectionRail";

const NOW = [
  {
    tag: "Reading",
    body: "Recent writing on agent architectures — where reasoning belongs vs. where execution lives.",
  },
  {
    tag: "Building",
    body: "Multi-agent systems with guardrails in code, not prompts.",
  },
  {
    tag: "Playing",
    body: "Drums. Chasing the way a steady pocket holds everything else together — same instinct that makes good systems.",
  },
];

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
      <div className="col-span-12 md:col-span-4 px-6 md:px-8 py-10 md:py-16 text-sm">
        <div className="mb-6 flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.15em] opacity-60">
            Now
          </span>
          <span className="text-[11px] uppercase tracking-[0.15em] opacity-40">
            Apr 2026
          </span>
        </div>
        <ul className="space-y-5">
          {NOW.map((item) => (
            <li key={item.tag}>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-60">
                {item.tag}
              </div>
              <div className="mt-1 leading-[1.45]">{item.body}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
