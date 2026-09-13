"use client";

import { useCallback, useState, type RefObject } from "react";
import SectionRail from "../ui/SectionRail";
import ProjectRow from "../ui/ProjectRow";
import ProjectPoster, { POSTER } from "../ui/ProjectPoster";
import { PROJECTS, type Project } from "@/content/projects";
import { useCursorFollow } from "@/lib/useCursorFollow";

type Props = {
  // Ref shared with <GraphScene/> so hovering a row highlights its subgraph.
  hoverIdRef: RefObject<string | null>;
};

export default function Works({ hoverIdRef }: Props) {
  const [hoverProject, setHoverProject] = useState<Project | null>(null);
  // The poster keeps its last project while fading out. `instant` skips the
  // crossfade when it was fully hidden, so a stale image never flashes in.
  const [poster, setPoster] = useState({ project: PROJECTS[0], instant: true });
  const { ref: posterRef, show, hide } = useCursorFollow<HTMLDivElement>({
    width: POSTER.width,
    height: POSTER.height,
    offset: 24,
    hideMs: POSTER.fadeMs,
  });

  const handleEnter = useCallback(
    (p: Project, pos?: { x: number; y: number }) => {
      hoverIdRef.current = p.graphId;
      const instant = show(pos);
      setPoster({ project: p, instant });
      setHoverProject(p);
    },
    [hoverIdRef, show],
  );

  const handleLeave = useCallback(() => {
    hoverIdRef.current = null;
    hide();
    setHoverProject(null);
  }, [hoverIdRef, hide]);

  return (
    <>
      <section
        id="works"
        className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]"
        onPointerLeave={handleLeave}
      >
        <SectionRail label="Works" />
        <div className="col-span-11 p-6">
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

      <ProjectPoster
        ref={posterRef}
        projects={PROJECTS}
        active={poster.project}
        visible={hoverProject !== null}
        instant={poster.instant}
      />
    </>
  );
}
