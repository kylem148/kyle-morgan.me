"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  active: boolean;
  onEnter: (p: Project, pos?: { x: number; y: number }) => void;
  onLeave: () => void;
};

export default function ProjectRow({ project, active, onEnter, onLeave }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  // Projects without a link render as an <a> with no href: not clickable.
  const isExternal = project.link?.startsWith("http") ?? false;
  const ctaLabel = project.ctaLabel ?? "View";

  return (
    <a
      ref={ref}
      href={project.link}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onPointerEnter={(e) =>
        onEnter(project, { x: e.clientX, y: e.clientY })
      }
      onPointerLeave={onLeave}
      onFocus={(e) => {
        // Keyboard focus has no cursor, so anchor the poster to the row.
        // Focus from a click keeps following the pointer.
        if (e.currentTarget.matches(":focus-visible")) {
          const r = e.currentTarget.getBoundingClientRect();
          onEnter(project, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
        } else {
          onEnter(project);
        }
      }}
      onBlur={onLeave}
      className={`group block border-b border-[#0f0e0c]/20 text-inherit no-underline transition-colors duration-200 ${
        active ? "md:bg-[#0f0e0c]/[0.04]" : ""
      }`}
    >
      {/* Mobile layout — image-led card */}
      <div className="md:hidden flex flex-col gap-3 py-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-[#0f0e0c] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          <Image
            src={project.image}
            alt=""
            fill
            sizes="90vw"
            placeholder="blur"
            className="object-cover"
          />
        </div>
        <div className="text-[11px] uppercase tracking-[0.15em] opacity-70">
          {project.category}
        </div>
        <div className="text-[26px] font-medium leading-[1.1] tracking-[-0.02em]">
          {project.title}
        </div>
        <div className="text-[14px] leading-[1.4] opacity-75">
          {project.description}
        </div>
        <div className="mt-1 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em]">
          {ctaLabel}
          {project.link && <span aria-hidden="true">↗</span>}
        </div>
      </div>

      {/* Desktop layout — tabular row */}
      <div
        className={`hidden md:grid grid-cols-[3fr_2fr_2fr] items-baseline gap-4 py-7`}
      >
        <div>
          <div
            className={`text-[22px] sm:text-[32px] font-medium leading-[1.1] tracking-[-0.02em] transition-transform duration-200 ${
              active ? "translate-x-2" : ""
            }`}
          >
            {project.title}
          </div>
          <div className="mt-2 max-w-xl text-[13px] opacity-75">
            {project.description}
          </div>
        </div>
        <div className="text-sm">{project.category}</div>
        <div className="text-right text-[11px] uppercase tracking-[0.1em]">
          <span className="inline-flex items-center gap-1.5">
            {ctaLabel}
            {project.link && (
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            )}
          </span>
        </div>
      </div>
    </a>
  );
}
