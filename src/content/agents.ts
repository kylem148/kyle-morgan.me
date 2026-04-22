export type Agent = {
  id: string;
  label: string;
  thought: string;
};

export const MANAGER: Agent = {
  id: "manager",
  label: "Manager",
  thought:
    "Orchestrator-worker pattern. Reasoning lives here, execution doesn't. Keeping the brain away from tools makes the whole system easier to trust.",
};

export const AGENTS: Agent[] = [
  {
    id: "worker",
    label: "Worker",
    thought:
      "Narrow scope, narrow permissions. Blast radius is capped by what this agent is allowed to touch, not by what it decides to do.",
  },
  {
    id: "security",
    label: "Security",
    thought:
      "The lethal trifecta problem. Prompt injection can't be reasoned away, so enforcement lives in code, not in a prompt.",
  },
  {
    id: "checker",
    label: "Action Checker",
    thought:
      "Deterministic gate before any real-world action. Reasoning is cheap, execution is permanent, and tool output is the new attack surface.",
  },
  {
    id: "memory",
    label: "Memory",
    thought:
      "Defaults plus overrides. Still working out where user control ends and poisoned context begins.",
  },
  {
    id: "queue",
    label: "Queue",
    thought:
      "Sequential first. Concurrency gets earned once tracing and failure modes are solid, not before.",
  },
];

// Edges between Manager and each agent, plus a few peer edges for visual rhythm.
export const AGENT_EDGES: [string, string][] = [
  ["manager", "worker"],
  ["manager", "security"],
  ["manager", "checker"],
  ["manager", "memory"],
  ["manager", "queue"],
  ["queue", "worker"],
  ["security", "checker"],
];
