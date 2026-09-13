import SectionRail from "../ui/SectionRail";
import type { BuildingProject as ProjectType } from "@/content/building-projects";

type Props = {
  project: ProjectType;
};

export default function BuildingProject({ project }: Props) {
  const hasLinks =
    project.links.repo || project.links.demo || project.links.writeup;

  return (
    <section className="grid grid-cols-12 border-t border-[#0f0e0c] bg-[#f2efe8]">
      <SectionRail label={project.name} />
      <div className="col-span-11 px-6 md:px-10 py-14 md:py-20">
        <h2 className="font-semibold uppercase tracking-[-0.03em] leading-[0.95] text-[clamp(40px,6vw,80px)]">
          {project.name}
        </h2>
        <p className="mt-4 max-w-3xl text-[clamp(18px,2vw,26px)] italic leading-[1.35] opacity-80">
          {project.tagline}
        </p>

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 md:col-span-8 space-y-9">
            <TextBlock label="Why" text={project.why} />
            <TextBlock label="Current state" text={project.currentState} />
            <TextBlock label="Next" text={project.next} />
            {project.notableDecision && (
              <TextBlock
                label="Notable decision"
                text={project.notableDecision}
              />
            )}
          </div>
          <aside className="col-span-12 md:col-span-3 md:col-start-10 space-y-8 text-sm">
            <MetaBlock label="Stack">
              <ul className="space-y-1.5 text-[13px]">
                {project.stack.map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="h-[2px] w-3 bg-[#0f0e0c]" />
                    {s}
                  </li>
                ))}
              </ul>
            </MetaBlock>
            {hasLinks && (
              <MetaBlock label="Links">
                <ul className="space-y-1">
                  {project.links.repo && (
                    <li>
                      <ExternalLink href={project.links.repo}>
                        Repo ↗
                      </ExternalLink>
                    </li>
                  )}
                  {project.links.demo && (
                    <li>
                      <ExternalLink href={project.links.demo}>
                        Demo ↗
                      </ExternalLink>
                    </li>
                  )}
                  {project.links.writeup && (
                    <li>
                      <ExternalLink href={project.links.writeup}>
                        Write-up ↗
                      </ExternalLink>
                    </li>
                  )}
                </ul>
              </MetaBlock>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function TextBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] uppercase tracking-[0.15em] opacity-60">
        {label}
      </div>
      <p className="text-[clamp(15px,1.25vw,18px)] leading-[1.6]">{text}</p>
    </div>
  );
}

function MetaBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 text-[11px] uppercase tracking-[0.15em] opacity-60">
        {label}
      </div>
      {children}
    </div>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:opacity-70"
    >
      {children}
    </a>
  );
}
