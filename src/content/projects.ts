export type Project = {
  id: number;
  graphId: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  link: string;
  ctaLabel?: string;
  posterArt: string;
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    graphId: "prism",
    title: "PRISM",
    category: "AI Visualization Software",
    description:
      "An AI-powered visualization tool that transforms live speech into intuitive visual narratives.",
    imageUrl: "/PRISM.png",
    link: "https://www.linkedin.com/posts/kyle-morgan0_proud-to-share-%F0%9D%97%A3%F0%9D%97%A5%F0%9D%97%9C%F0%9D%97%A6%F0%9D%97%A0-built-at-cal-polys-ugcPost-7432113960662990848-mRLp",
    ctaLabel: "View Study",
    posterArt:
      "radial-gradient(90% 70% at 20% 20%, #7c5bff55 0%, transparent 60%), linear-gradient(135deg, #1b1736 0%, #0b0a1f 60%, #050410 100%)",
  },
  {
    id: 2,
    graphId: "vibe",
    title: "Club Landing Page",
    category: "Web Development",
    description: "A dynamic website built for the Cal Poly Vibe Coding Club.",
    imageUrl: "/club_website_NEW.png",
    link: "https://www.calpolyvibecoding.com/",
    ctaLabel: "View Website",
    posterArt:
      "radial-gradient(120% 80% at 10% 0%, #4c8bff55 0%, transparent 60%), linear-gradient(135deg, #0f1b2d 0%, #061024 60%, #000814 100%)",
  },
  {
    id: 3,
    graphId: "resources",
    title: "Cal Poly Resources",
    category: "Full Stack Web Development",
    description:
      "A resource hub for the Cal Poly Resources Club with clear navigation and student-focused content.",
    imageUrl: "/student_resources.png",
    link: "https://calpolyresources.vercel.app/",
    ctaLabel: "View Website",
    posterArt:
      "radial-gradient(80% 60% at 80% 20%, #7ad39f66 0%, transparent 65%), linear-gradient(160deg, #14331a 0%, #0a1f11 70%, #04110a 100%)",
  },
  {
    id: 4,
    graphId: "surf",
    title: "Operation Surf",
    category: "Full Stack Application",
    description:
      "Ease-of-life tooling for Operation Surf members. Built on a Hack4Impact team.",
    imageUrl: "/operation_surf.png",
    link: "#",
    ctaLabel: "In Development",
    posterArt:
      "radial-gradient(90% 70% at 50% 90%, #e8a97266 0%, transparent 65%), linear-gradient(180deg, #2b2114 0%, #1a150e 70%, #0d0a07 100%)",
  },
];
