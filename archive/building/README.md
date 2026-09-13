# /building (archived)

The old `/building` page: a progress log of the agentic projects I was working on.
Pulled from the site because keeping it current was too much upkeep.

Nothing in here is built, type-checked, or linted (`archive` is excluded in
`tsconfig.json` and `eslint.config.mjs`), so it can drift out of date with the
rest of the site.

## Restoring it

1. Copy `archive/building/src/` back over `src/`.
2. Add `{ href: "/building", label: "Building" }` back to the nav lists in
   `src/app/(site)/components/layout/Header.tsx` and `MobileNav.tsx`.
3. Add the `/building` entry back to `src/app/sitemap.ts`.
4. Optionally put a link back in
   `src/app/(site)/components/sections/CurrentFocus.tsx`.
5. Run `npx tsc --noEmit` and fix whatever shared components changed since.
