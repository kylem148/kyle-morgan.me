import SectionRail from "../ui/SectionRail";

const LINKS = [
  { label: "Email", value: "kyle@themorganization.com", href: "mailto:kyle@themorganization.com" },
  { label: "GitHub", value: "kylem148", href: "https://github.com/kylem148" },
  { label: "LinkedIn", value: "in/kyle-morgan0", href: "https://linkedin.com/in/kyle-morgan0" },
] as const;

export default function Contact() {
  return (
    <section
      id="contact"
      className="grid grid-cols-12 border-t border-b border-[#0f0e0c] bg-[#f2efe8]"
    >
      <SectionRail label="Contact" />
      <div className="col-span-12 md:col-span-4 md:border-r border-[#0f0e0c] flex items-center px-6 md:px-8 py-16 md:py-32 text-[clamp(20px,2.4vw,34px)] leading-[1.3] tracking-[-0.01em]">
        Let&rsquo;s get in touch.
      </div>
      <div className="col-span-12 md:col-span-7 flex flex-col justify-center px-8 md:px-10 py-12 md:py-20">
        <div className="grid gap-6 text-[clamp(16px,1.3vw,18px)]">
          {LINKS.map(({ label, value, href }) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-[#0f0e0c]/25 pb-3"
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
