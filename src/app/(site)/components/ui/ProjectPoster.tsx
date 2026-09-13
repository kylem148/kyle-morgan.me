"use client";

import Image from "next/image";
import type { Ref } from "react";
import type { Project } from "@/content/projects";

// fadeMs matches the duration-300 / delay-300 classes below.
export const POSTER = { width: 280, height: 160, fadeMs: 300 };

type Props = {
  ref: Ref<HTMLDivElement>;
  projects: Project[];
  /** Project whose image is showing. Stays set while the poster fades out. */
  active: Project;
  visible: boolean;
  /** Swap images without a crossfade, used when the poster was fully hidden. */
  instant: boolean;
};

/**
 * Floating preview that follows the cursor over the Works rows.
 *
 * Every project image stays mounted, and next/image decodes each one as soon
 * as it loads, so a hover only flips opacity and never waits on the network or
 * a decode. The images are lazy: on desktop the invisible poster sits inside
 * the viewport so they load right away, and on phones it's display:none so
 * they never load at all.
 *
 * Crossfade: the incoming image fades in on top while outgoing ones wait
 * (delay-300) before fading, so there's no dip to the background between them.
 */
export default function ProjectPoster({
  ref,
  projects,
  active,
  visible,
  instant,
}: Props) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden will-change-transform md:block"
    >
      <div
        className={`relative overflow-hidden rounded-sm bg-[#0f0e0c] shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition-[opacity,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
        }`}
        style={{ width: POSTER.width, height: POSTER.height }}
      >
        {projects.map((p) => (
          <Image
            key={p.id}
            src={p.image}
            alt=""
            fill
            sizes={`${POSTER.width}px`}
            placeholder="blur"
            className={`object-cover ${
              instant ? "transition-none" : "transition-opacity duration-300"
            } ${p.id === active.id ? "z-10 opacity-100" : "z-0 opacity-0 delay-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
