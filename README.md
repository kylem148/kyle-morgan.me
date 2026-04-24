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
  - A 3D force-directed graph of tech, concepts, and projects that runs as a
  subtle background on the main page. Hovering a project row in the Works
  section highlights that project's subgraph in the 3D scene.
- An agent orchestration diagram in the Current Focus section, with
  hover-to-reveal notes on each role (Manager, Worker, Security,
  Action Checker, Memory, Queue).
- Content lives in `src/content/*.ts` as data, not markup.
- Reduced-motion support throughout.


## Stack

- Next.js 16 (App Router)
- React 19 with the React Compiler (babel-plugin-react-compiler)
- TypeScript
- Tailwind CSS v4
- Three.js (hand-rolled scenes, no helper libraries)


## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## License

MIT. See `LICENSE`.
