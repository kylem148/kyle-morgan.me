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
      "A multi-agent AI secretary that handles email and calendar for you. Focus on prioritizing your time.",
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
      "Anthropic API",
      "MCP",
      "Gmail API",
      "Google Calendar API",
      "SSE",
      "asyncio",
      "AWS ECS Fargate",
      "pytest",
    ],
    notableDecision:
      "All business logic lives in LLM prompts and XML-tagged agent output, not Python conditionals. Python only parses tags like [SPAWN_EMAIL] or [CONFIRMED] and mechanically executes them. This keeps the agents flexible as prompts evolve.",
    links: {},
  },
  {
    id: "cpvc",
    name: "Club Agent",
    tagline: "AI secretary adapted to help run a college club.",
    why: "Student club officers burn their hours on email triage, session reminders, and roster wrangling instead of teaching. This Agent is adapted to manage Google Drive state, sheets, forms and other common club tasks.",
    currentState: "Planning documentation complete; pre-implementation.",
    next: "Finalize the database schema, then begin scaffolding.",
    stack: [
      "Python",
      "FastAPI",
      "Postgres",
      "Redis",
      "Anthropic API",
      "MCP",
      "React",
      "SSE",
    ],
    notableDecision:
      "Direct extension of my earlier Secretary Agent project. Rather than starting from scratch, this project forks proven pieces from Secretary (BaseAgent, orchestrator loop, Action Checker, SSE streaming, session memory, DB patterns) and rebuilds the product surface on top.",
    links: {},
  },
  {
    id: "ledger",
    name: "Ledger",
    tagline:
      "Personal background agent that keeps my academic state coherent across Canvas, Notion, and Calendar.",
    why: "I currently have multiple Notion docs that need to be updated when new homework comes in (e.g. a overall homework tracker document and day plans often both containing new homework). This agent solves that problem through constantly watching Canvas, auto-managing state of Notion documents, then applying them to a calendar. All automatically in the background.",
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
    notableDecision:
      "A different type of agent than above. No user interface, solely background scripts. This means security is heightened compared to before due to being a completely automatic system.",

    links: {},
  },
];
