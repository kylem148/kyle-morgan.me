import type { Project } from "@/content/projects";

type Props = { project: Project };

/**
 * Floating preview card that follows the cursor when a project row is hovered.
 * Image is layered over a gradient — if the image 404s, the gradient still reads.
 */
export default function ProjectPoster({ project }: Props) {
  return (
    <div className="relative h-[200px] w-[280px] overflow-hidden rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${project.imageUrl}), ${project.posterArt}`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 text-white/95 mix-blend-difference">
        <div className="text-[10px] uppercase tracking-[0.2em]">
          {project.category}
        </div>
        <div className="text-[22px] font-semibold leading-[1] tracking-[-0.02em]">
          {project.title}
        </div>
      </div>
    </div>
  );
}
