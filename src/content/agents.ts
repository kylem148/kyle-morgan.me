export type Agent = {
  id: string;
  label: string;
  thought: string;
};

export const MANAGER: Agent = {
  id: "manager",
  label: "Manager",
  thought:
    "A delegation/orchestrator agent without any other permissions. Keeping the brain away from tools makes the whole system more secure.",
};

export const AGENTS: Agent[] = [
  {
    id: "worker",
    label: "Worker",
    thought:
      "Narrow scope and narrow permissions. Isolated to only what it is specifically designed to do.",
  },
  {
    id: "security",
    label: "Security",
    thought:
      "Agents create a vast variety of threats, so enforcement lives in a multilayered setup.",
  },
  {
    id: "checker",
    label: "Action Checker",
    thought:
      "Deterministic gate before any real-world action. Used to check and enforce the quality of answers from the system before they go out.",
  },
  {
    id: "data",
    label: "Data",
    thought:
      "Creating an ecosystem of data for agents is one of the hardest parts of any project. Often a mix of short-term and long-term data.",
  },
];

// Edges between Manager and each agent, plus a peer edge for visual rhythm.
export const AGENT_EDGES: [string, string][] = [
  ["manager", "worker"],
  ["manager", "security"],
  ["manager", "checker"],
  ["manager", "data"],
  ["security", "checker"],
];
