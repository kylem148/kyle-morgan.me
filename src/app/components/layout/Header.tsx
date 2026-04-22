type Props = {
  progress: number;
  clock: string;
};

const NAV = [
  { href: "#bio", label: "Bio" },
  { href: "#works", label: "Works" },
  { href: "#focus", label: "Focus" },
  { href: "#contact", label: "Contact" },
] as const;

export default function Header({ progress, clock }: Props) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#0f0e0c] bg-[#f2efe8]/85 px-6 py-2 text-[11px] uppercase tracking-[0.1em] backdrop-blur-md">
      <span className="font-medium">Kyle Morgan</span>
      <nav className="hidden md:flex gap-6">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="hover:underline underline-offset-4">
            {n.label}
          </a>
        ))}
      </nav>
      <span className="tabular-nums tracking-[0.05em]">
        {(progress * 100).toFixed(0)}% · {clock || "—"}
      </span>
    </header>
  );
}
