import SectionRail from "../ui/SectionRail";

const ROLE = {
  dates: "2026 - Present",
  title: "Software Engineering Intern",
  org: "DxHub (Cal Poly x AWS)",
};

export default function Bio() {
  return (
    <section
      id="bio"
      className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]"
    >
      <SectionRail label="Bio" />
      <div className="col-span-11 md:col-span-4 md:border-r border-[#0f0e0c] px-6 md:px-8 py-14 md:py-16">
        <div className="mb-4 text-[11px] uppercase tracking-[0.15em] opacity-60">
          Timeline
        </div>
        <div className="text-[clamp(16px,1.3vw,18px)] leading-[1.3]">
          {ROLE.title}
        </div>
        <div className="mt-1 text-sm opacity-75">{ROLE.org}</div>
        <div className="mt-1 text-[13px] tabular-nums opacity-60">
          {ROLE.dates}
        </div>
      </div>
      <div className="col-span-12 md:col-span-7 px-6 md:px-8 py-10 md:py-16 text-[clamp(20px,2.4vw,34px)] leading-[1.3] tracking-[-0.01em] text-pretty">
        I build software that&rsquo;s easy to use and hard to break.
        Here&rsquo;s some of what I&rsquo;ve been working on:
      </div>
    </section>
  );
}
