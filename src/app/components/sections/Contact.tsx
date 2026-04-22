import SectionRail from "../ui/SectionRail";

const LINKS = [
  { label: "Email", value: "kyle@themorganization.com", href: "mailto:kyle@themorganization.com" },
  { label: "GitHub", value: "kylem148", href: "https://github.com/kylem148" },
  { label: "LinkedIn", value: "in/kyle-morgan", href: "https://www.linkedin.com/in/kyle-morgan" },
  { label: "Instagram", value: "@kyle.morgan", href: "https://instagram.com" },
] as const;

export default function Contact() {
  return (
    <section
      id="contact"
      className="grid grid-cols-12 border-t border-b border-[#0f0e0c] bg-[#f2efe8]"
    >
      <SectionRail label="§ 04 — Contact" />
      <div className="col-span-12 md:col-span-7 overflow-hidden border-r border-[#0f0e0c] px-6 md:px-8 py-16 md:py-20">
        <div className="font-black uppercase leading-[0.9] tracking-[-0.05em] text-[clamp(64px,10.5vw,148px)]">
          Let&rsquo;s
          <br />
          <em className="font-light italic">connect.</em>
        </div>
      </div>
      <div className="col-span-12 md:col-span-4 flex flex-col justify-center p-8 md:p-10">
        <div className="grid gap-4 text-[15px]">
          {LINKS.map(({ label, value, href }) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-[#0f0e0c]/25 pb-2.5"
            >
              <span className="tabular-nums tracking-[0.05em] text-[12px] uppercase">
                {label}
              </span>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-inherit underline underline-offset-[3px] hover:opacity-70"
              >
                {value}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
