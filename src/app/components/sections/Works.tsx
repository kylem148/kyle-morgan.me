"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import SectionRail from "../ui/SectionRail";
import ProjectRow from "../ui/ProjectRow";
import ProjectPoster from "../ui/ProjectPoster";
import { PROJECTS, type Project } from "@/content/projects";

type Props = {
  // Ref shared with <GraphScene/> so hovering a row highlights its subgraph.
  hoverIdRef: RefObject<string | null>;
};

export default function Works({ hoverIdRef }: Props) {
  const [hoverProject, setHoverProject] = useState<Project | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const handleEnter = useCallback(
    (p: Project, pos?: { x: number; y: number }) => {
      hoverIdRef.current = p.graphId;
      if (pos) setCursor(pos);
      setHoverProject(p);
    },
    [hoverIdRef],
  );

  const handleLeave = useCallback(() => {
    hoverIdRef.current = null;
    setHoverProject(null);
  }, [hoverIdRef]);

  useEffect(() => {
    if (!hoverProject) return;
    const onMove = (e: PointerEvent) =>
      setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [hoverProject]);

  return (
    <>
      <section
        id="works"
        className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]"
        onPointerLeave={handleLeave}
      >
        <SectionRail label="§ 02 — Works" />
        <div className="col-span-11 p-6">
          <div className="grid grid-cols-[1fr_3fr_2fr_2fr] gap-4 border-b border-[#0f0e0c] py-3 text-[11px] uppercase tracking-[0.1em]">
            <div>Index</div>
            <div>Project</div>
            <div className="hidden sm:block">Category</div>
            <div className="text-right">Link</div>
          </div>
          {PROJECTS.map((p) => (
            <ProjectRow
              key={p.id}
              project={p}
              active={hoverProject?.id === p.id}
              onEnter={handleEnter}
              onLeave={handleLeave}
            />
          ))}
        </div>
      </section>

      {hoverProject && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-30 hidden md:block"
          style={{
            left: cursor.x,
            top: cursor.y,
            transform:
              cursor.x + 320 > window.innerWidth
                ? "translate(calc(-100% - 24px), -50%)"
                : "translate(24px, -50%)",
          }}
        >
          <ProjectPoster project={hoverProject} />
        </div>
      )}
    </>
  );
}
