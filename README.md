# kyle-morgan.me

My personal site. Live at https://kyle-morgan.me

<!-- Hero screenshot pending — add to public/readme-hero.png and restore image tag below -->
<!-- ![kyle-morgan.me](public/readme-hero.png) -->

## What it is

Two routes:
- `/` — Hero, Bio, Works, Current Focus, Contact. A 3D force-directed graph
  of the tech, concepts, and projects that anchor my work runs across the
  page as a subtle background. Hovering a project row highlights that
  project's subgraph in the 3D scene.
- `/building` — a living progress log of the agentic systems I'm currently
  shipping. Honest state, rough edges included.

## Stack

- Next.js 16 (App Router)
- React 19 with the React Compiler (babel-plugin-react-compiler)
- TypeScript
- Tailwind CSS v4
- Three.js (hand-rolled scenes, no helper libraries)

## Notable bits

- `GraphScene.tsx` — hand-written force-directed graph physics (pairwise
  repulsion + spring forces + x-anchor pinning for the mountain-range
  composition). 180-iteration warmup before first paint so nothing snaps
  into place. Scroll-driven opacity fade. A shared `hoverIdRef` with the
  Works section means hovering a project row highlights that project's
  1-hop subgraph in the 3D scene.
- `AgentGlobe.tsx` — Fibonacci-sphere node distribution, smootherstep
  color easing, idle auto-cycle vs user-hover with separate transition
  speeds.
- Content lives in `src/content/*.ts` (projects, agents, building
  projects) treated as data, not markup.
- Reduced-motion support throughout.

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## License

MIT. See `LICENSE`.
