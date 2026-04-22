import Link from "next/link";
import MobileNav from "./MobileNav";

type Props = {
  progress: number;
  clock: string;
};

const NAV = [
  { href: "/#bio", label: "Bio" },
  { href: "/#works", label: "Works" },
  { href: "/#focus", label: "Focus" },
  { href: "/building", label: "Building" },
  { href: "/#contact", label: "Contact" },
] as const;

export default function Header({ progress, clock }: Props) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#0f0e0c] bg-[#f2efe8]/85 px-6 py-2 text-[11px] uppercase tracking-[0.1em] backdrop-blur-md">
      <Link href="/" className="font-medium hover:opacity-70">
        Kyle Morgan
      </Link>
      <nav className="hidden md:flex gap-6">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="hover:underline underline-offset-4"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <span className="hidden md:inline tabular-nums tracking-[0.05em]">
        {(progress * 100).toFixed(0)}% · {clock || "—"}
      </span>
      <MobileNav />
    </header>
  );
}
