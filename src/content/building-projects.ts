

export type BuildingProject = {
  id: string;
  name: string;
  tagline: string;
  why: string;
  currentState: string;
  next: string;
  stack: string[];
  notableDecision?: string;
  links: {
    repo?: string;
    demo?: string;
    writeup?: string;
  };
};

// Ordered most-developed → least, so the reader meets the strongest work first.
export const BUILDING_PROJECTS: BuildingProject[] = [
  {
    id: "secretary",
    name: "Personal Secretary Agent",
    tagline:
      "A multi-agent AI secretary that handles email and calendar for you. Focus on prioritizing your time",
    why: "Executives spend hours a day on email triage and scheduling back-and-forth. This is a personal tool for me that takes over those workflows, with the broader goal of learning how to build production-grade agentic systems under real trust and security constraints.",
    currentState:
      "Working end-to-end locally with scheduling, email, and calendar flows under an orchestrator-and-sub-agents architecture. Cloud deployment in progress.",
    next: "Finish cloud deployment.",
    stack: [
      "Python",
      "FastAPI",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Claude API (Sonnet + Haiku)",
      "MCP",
      "Gmail API",
      "Google Calendar API",
      "SSE",
      "asyncio",
      "AWS ECS Fargate",
      "pytest",
    ],
    notableDecision:
      "All business logic lives in LLM prompts and XML-tagged agent output, not Python conditionals. Python only parses tags like [SPAWN_EMAIL] or [CONFIRMED] and mechanically executes them. This keeps the agents flexible as prompts evolve, but it shifted almost every bug I hit from 'code wrong' to 'prompt wrong,' which is a very different debugging skill than I expected.",
    links: {},
  },
  {
    id: "cpvc",
    name: "CPVC Agent",
    tagline:
      "AI secretary that runs admin for the Cal Poly Vibe Coding Club.",
    why: "Student club officers burn their hours on email triage, session reminders, and roster wrangling instead of teaching. CPVC Agent is a dedicated agent for the 8 officers who run the club for ~100 members.",
    currentState: "Planning documentation complete; pre-implementation.",
    next: "Finalize the database schema, then begin scaffolding.",
    stack: [
      "Python",
      "FastAPI",
      "Postgres",
      "Redis",
      "Claude Sonnet",
      "MCP",
      "React",
      "SSE",
    ],
    notableDecision:
      "This is a direct extension of my earlier Secretary Agent project. Rather than starting from scratch, CPVC forks proven pieces from Secretary (BaseAgent, orchestrator loop, Action Checker, SSE streaming, session memory, DB patterns) and rebuilds the product surface on top. The lesson: when the hard parts of an agent already work in one codebase, copy the infrastructure and iterate on the product, don't rewrite the plumbing.",
    links: {},
  },
  {
    id: "ledger",
    name: "Ledger",
    tagline:
      "Personal background agent that keeps my academic state coherent across Canvas, Notion, and Calendar.",
    why: "Ive sparesed out into usin Notion, Caldner, and Canvas to be able to mange my hw. the official assignments, a handful of Notion documents are where I actually write down my homework and plan out my day, and my calendar is what I check to know where I need to be. The problem is that none of these systems know about each other, so assignments posted on Canvas never make it into my homework notes, things I plan for the day in Notion never land on the calendar, and due dates quietly slip past me. Keeping all of that in sync by hand is the exact step where my homework tracking and daily planning fall apart. Ledger is a background agent that manages the state across those systems for me, so the documents I already rely on stay current without me having to babysit them.",
    currentState:
      "Planning documentation complete; repo scaffolded, pre-implementation.",
    next: "Scaffold the Canvas MCP package and its module stubs.",
    stack: [
      "Python 3.12",
      "uv workspace",
      "FastMCP",
      "Pydantic",
      "httpx",
      "Anthropic API",
      "Notion MCP",
      "Google Calendar API",
      "pytest",
      "AWS Fargate",
    ],
    links: {},
  },
];
