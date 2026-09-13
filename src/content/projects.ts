import type { StaticImageData } from "next/image";
import secretaryImage from "@/assets/projects/secretary_agent.png";
import coManagerImage from "@/assets/projects/co_manager.png";
import prismImage from "@/assets/projects/PRISM.png";
import sjsuImage from "@/assets/projects/sjsu_navigator.png";

export type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  // Static import: next/image resizes it, generates the blur-up, and serves it
  // from a hashed URL that caches forever.
  image: StaticImageData;
  link?: string;
  ctaLabel?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Personal Secretary Agent",
    category: "Multi-Agent System",
    description:
      "Runs email negotiations to schedule meetings. Bulit to value your time, not just fill it up. ",
    image: secretaryImage,
    link: "https://github.com/kylem148/secretary-agent",
    ctaLabel: "View Source",
  },
  {
    id: 2,
    // Non-breaking hyphen so "Co-Manager" never splits across lines.
    title: "Development Co‑Manager",
    category: "Github Orchestration",
    description:
      "Researches and dispatches coding agents into isolated git worktrees for parallel feature development.",
    image: coManagerImage,
    link: "https://github.com/kylem148/manager-agent",
    ctaLabel: "View Source",
  },
  {
    id: 3,
    title: "PRISM",
    category: "AI Visualization Software",
    description:
      "Turns live lecture audio into diagrams and notes as the teacher talks.",
    image: prismImage,
    link: "https://www.linkedin.com/posts/kyle-morgan0_proud-to-share-%F0%9D%97%A3%F0%9D%97%A5%F0%9D%97%9C%F0%9D%97%A6%F0%9D%97%A0-built-at-cal-polys-ugcPost-7432113960662990848-mRLp",
    ctaLabel: "View Study",
  },
  {
    id: 4,
    title: "SJSU Student Success Navigator",
    category: "RAG Assistant",
    description:
      "Points San José State students to the campus office that can help them. RAG over 238 curated sjsu.edu pages.",
    image: sjsuImage,
    link: "https://github.com/cal-poly-dxhub/sjsu-success-navigator",
    ctaLabel: "View Source",
  },
];
