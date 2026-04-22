"use client";

import { useRef } from "react";
import type { Project } from "@/content/projects";

type Props = {
  project: Project;
  active: boolean;
  onEnter: (p: Project, pos?: { x: number; y: number }) => void;
  onLeave: () => void;
};

export default function ProjectRow({ project, active, onEnter, onLeave }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  return (
    <a
      ref={ref}
      href={project.link}
      target={project.link.startsWith("http") ? "_blank" : undefined}
      rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
      onPointerEnter={(e) =>
        onEnter(project, { x: e.clientX, y: e.clientY })
      }
      onPointerLeave={onLeave}
      onFocus={() => onEnter(project)}
      onBlur={onLeave}
      className={`group grid grid-cols-[1fr_3fr_2fr_2fr] items-baseline gap-4 border-b border-[#0f0e0c]/20 py-7 text-inherit no-underline transition-colors duration-200 ${
        active ? "bg-[#0f0e0c]/[0.04]" : ""
      }`}
    >
      <div className="tabular-nums tracking-[0.05em]">
        № {String(project.id).padStart(2, "0")}
      </div>
      <div>
        <div
          className={`text-[22px] sm:text-[32px] font-medium leading-[1.1] tracking-[-0.02em] transition-transform duration-200 ${
            active ? "translate-x-2" : ""
          }`}
        >
          {project.title}
        </div>
        <div className="mt-1 text-[13px] opacity-70 sm:hidden">
          {project.category}
        </div>
        <div className="mt-2 max-w-xl text-[13px] opacity-75">
          {project.description}
        </div>
      </div>
      <div className="hidden sm:block text-sm">{project.category}</div>
      <div className="text-right text-[11px] uppercase tracking-[0.1em]">
        <span className="inline-flex items-center gap-1.5">
          {project.ctaLabel ?? "View"}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">↗</span>
        </span>
      </div>
    </a>
  );
}
