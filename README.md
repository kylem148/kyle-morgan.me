# kyle-morgan.me

My personal site. Live at https://kyle-morgan.me

<!-- Hero screenshot pending — add to public/readme-hero.png and restore image tag below -->
<!-- ![kyle-morgan.me](public/readme-hero.png) -->

## What it is

Routes:
- `/` — Hero, Bio, Works, Current Focus, Contact. A 3D force-directed graph
  of the tech, concepts, and projects that anchor my work runs across the
  page as a subtle background. Hovering a project row highlights that
  project's subgraph in the 3D scene.
- `/connect` - my digital business card, replacing a paid dot.cards profile.
  Its own root layout in the `(connect)` route group, so it shares nothing
  with the main site but the domain. One-tap vCard download at
  `/connect/kyle-morgan.vcf`, and an Exchange Contact form that emails me
  through Resend.
- An agent orchestration diagram in the Current Focus section, with
  hover-to-reveal notes on each role (Manager, Worker, Security,
  Action Checker, Data).
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

### /connect email

The Exchange Contact form on `/connect` emails me through [Resend](https://resend.com).
It's the only email the form sends. By default it goes from and to the email on
the card, so that address's domain has to be verified in Resend. Set these in
`.env.local` locally and in the Vercel project settings:

```bash
RESEND_API_KEY=re_...
# Optional overrides. Both default to the email on the card.
CONNECT_FROM_EMAIL="kyle-morgan.me <kyle@themorganization.com>"
CONNECT_NOTIFY_EMAIL=kyle@themorganization.com
```

Without an API key the form still renders, but submitting shows an error that
points people to my email instead.

## License

MIT. See `LICENSE`.
