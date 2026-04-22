"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const NAV = [
  { href: "/#bio", label: "Bio" },
  { href: "/#works", label: "Works" },
  { href: "/#focus", label: "Focus" },
  { href: "/building", label: "Building" },
  { href: "/#contact", label: "Contact" },
] as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const overlay = (
    <div className="md:hidden fixed left-0 right-0 bottom-0 top-8.5 z-30 flex flex-col bg-[#f2efe8]">
      <nav className="flex flex-1 flex-col justify-center px-6">
        <ul className="divide-y divide-[#0f0e0c]/15 border-y border-[#0f0e0c]/15">
          {NAV.map((n, i) => (
            <li key={n.href}>
              <Link
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-5"
              >
                <span className="text-[10px] tabular-nums uppercase tracking-[0.2em] opacity-40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[clamp(36px,10vw,64px)] font-semibold uppercase tracking-[-0.02em] leading-none">
                  {n.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="grid grid-cols-2 gap-4 border-t border-[#0f0e0c]/15 px-6 py-5 text-[11px] uppercase tracking-[0.2em]">
        <span>Kyle Morgan</span>
        <span className="text-right opacity-60">Portfolio — 2026</span>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="md:hidden relative z-50 flex h-8 w-8 items-center justify-center"
      >
        <span
          className={`absolute block h-[1.5px] w-5 bg-[#0f0e0c] transition-transform duration-300 ease-out ${
            open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
          }`}
        />
        <span
          className={`absolute block h-[1.5px] w-5 bg-[#0f0e0c] transition-opacity duration-200 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute block h-[1.5px] w-5 bg-[#0f0e0c] transition-transform duration-300 ease-out ${
            open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
          }`}
        />
      </button>

      {mounted && open && createPortal(overlay, document.body)}
    </>
  );
}
