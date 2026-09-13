import Link from "next/link";
import MobileNav from "./MobileNav";

const NAV = [
  { href: "/#bio", label: "Bio" },
  { href: "/#works", label: "Works" },
  { href: "/#focus", label: "Focus" },
  { href: "/#contact", label: "Contact" },
] as const;

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#0f0e0c] bg-[#f2efe8]/85 px-6 h-8.5 text-[11px] uppercase tracking-[0.1em] backdrop-blur-md">
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
      <MobileNav />
    </header>
  );
}
