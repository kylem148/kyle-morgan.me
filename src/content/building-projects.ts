export type BuildingStatus = "prototype" | "active" | "beta" | "paused";

export type BuildingProject = {
  id: string;
  name: string;
  tagline: string;
  status: BuildingStatus;
  why: string;
  currentState: string;
  knownRough: string;
  next: string;
  stack: string[];
  notableDecision: string;
  timeline: string;
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
      "A multi-agent AI secretary that handles email and calendar for you.",
    status: "prototype",
    why: "Executives spend hours a day on email triage and scheduling back-and-forth. This is a personal tool for me that takes over those workflows, with the broader goal of learning how to build production-grade agentic systems under real trust and security constraints.",
    currentState:
      "Fully working end-to-end locally: outbound and inbound scheduling negotiation, email read/write/summarize, calendar CRUD, contact tiers, and schedule-template-aware slot selection. A Claude Sonnet orchestrator delegates to Haiku-based EmailAgent, CalendarAgent, and a SchedulingAgent that acts as its own mini-orchestrator for multi-step negotiations. 485 unit tests pass, backend is containerized at 1.66GB, and AWS deployment to ECS Fargate is in progress.",
    knownRough:
      "Interactive scheduling sometimes sends emails without waiting for approval, and parallel agents can hit rate limits and SSL errors because there are no API concurrency semaphores yet. The real-time SSE streaming also breaks down past 3–4 concurrent agents due to browser connection limits.",
    next: "Finishing the AWS deployment, then re-attempting the unified SSE streaming refactor that I had to roll back after it introduced cascading regressions.",
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
    timeline: "AWS deployment within the next week; streaming retry soon after.",
    links: {},
  },
  {
    id: "cpvc",
    name: "CPVC Agent",
    tagline:
      "AI secretary that runs admin for the Cal Poly Vibe Coding Club.",
    status: "prototype",
    why: "Student club officers burn their hours on email triage, session reminders, and roster wrangling instead of teaching. CPVC Agent is a dedicated agent for the 8 officers who run the club for ~100 members.",
    currentState:
      "Planning phase is done. plan.md, architecture.md, CLAUDE.md, and lessons.md are drafted, with a 12-milestone brain-first build order. Currently mid-prep before M1 implementation: need explicit Postgres DDL in architecture.md and a few stack decisions carried over from the Secretary Agent it extends.",
    knownRough:
      "Nothing is built yet. The Postgres schema is described in prose but not written as DDL, and the plan to reuse infrastructure from the Secretary Agent codebase is decided but not yet wired up.",
    next: "Write the Postgres DDL in architecture.md using Secretary's schema as reference, then start M1 scaffolding.",
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
    timeline:
      "M1 scaffolding within the next 1–2 weeks; first working CLI agent by end of quarter.",
    links: {},
  },
  {
    id: "ledger",
    name: "Ledger",
    tagline:
      "Personal background agent that keeps my academic state coherent across Canvas, Notion, and Calendar.",
    status: "prototype",
    why: "Canvas posts assignments I don't see for days, Day Plans items never make it to My Assignments, and due dates never land on the calendar I actually check. This is a personal tool for reconciling academic state across systems I use, while also being a testbed for building agents that operate across trust boundaries.",
    currentState:
      "Planning phase is complete. Full plan.md, architecture.md, and CLAUDE.md written and audited, with all cross-surface flows, a 3-check write pipeline, and data shapes spec'd. Repo is scaffolded on GitHub and ready for M1 implementation; no agent code written yet.",
    knownRough:
      "Zero implementation so far, so everything is rough in the sense that nothing runs. A few architectural questions are also still open: verifying Notion MCP's last_edited_by exposure, actual cost of metadata-check polling, and real rate-limit values.",
    next: "Scaffolding the Canvas MCP package as a uv workspace with FastMCP stdio transport and module stubs.",
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
      "Dropped the idempotency and loop-detection checks from the write pipeline after realizing the stateless 15-minute cycle design already prevents duplicate writes on its own; adding them was engineering around a failure mode the architecture had already solved.",
    timeline:
      "Canvas MCP done within the next week or two; full reconcile loop a few weeks after.",
    links: {},
  },
];
