export type Agent = {
  id: string;
  label: string;
  thought: string;
};

export const MANAGER: Agent = {
  id: "manager",
  label: "Manager",
  thought:
    "Reasons, doesn't execute. Full delegation authority, zero tool access.",
};

export const AGENTS: Agent[] = [
  {
    id: "worker",
    label: "Worker",
    thought: "One job, one permission set, one reason to exist.",
  },
  {
    id: "security",
    label: "Security",
    thought:
      "Hardcoded boundary. The one part of the system that can't be talked out of its job.",
  },
  {
    id: "checker",
    label: "Action Checker",
    thought:
      "Last gate before the real world. Reasoning is cheap; execution is permanent.",
  },
  {
    id: "memory",
    label: "Memory",
    thought:
      "Defaults plus overrides. Every behavior is a starting point, not a rule.",
  },
  {
    id: "queue",
    label: "Queue",
    thought:
      "One event at a time. Sequential first; concurrent only when it's earned.",
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
