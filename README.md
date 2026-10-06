# Miko's Portfolio

Personal portfolio of **Michael Angelou C. Quinit ("Miko")** — IT student
majoring in Database Systems and Full-Stack Web Development. Built with
Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, React
Three Fiber, and a Prisma/PostgreSQL-backed CMS with a hidden `/admin`
dashboard.

Design language: a dark editorial systems aesthetic — anodized charcoal
surfaces, signal-lime accents, directional glass borders, and oversized
typography — with Emil Kowalski-style spring physics, a low-latency magnetic
cursor, and tactile interactions throughout.

---

## 1. Getting started in GitHub Codespaces

1. **Open in Codespaces**: `Code` -> `Codespaces` -> `Create codespace on main`.
   The devcontainer runs `npm install` automatically.
2. Provision a Postgres database — Neon (neon.tech) or Supabase
   (supabase.com) both work unchanged and give you a connection string in
   under a minute, no local Postgres needed.
3. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — your Postgres connection string
   - `SESSION_SECRET` — generate with `openssl rand -base64 32`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your own admin login
4. Push the schema and seed the database:
   ```bash
   npx prisma db push
   npm run seed
   ```
   (Optional) set `RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`, and
   `CONTACT_FROM_EMAIL` in `.env` to get an email when someone submits the
   contact form. Leave them unset and the form still works — messages are
   always saved and readable at `/admin/inquiries`.
5. Start the dev server:
   ```bash
   npm run dev
   ```
6. Visit the forwarded port-3000 preview for the public site, and
   `/admin/login` to sign in and manage projects.

---

## 2. Dependencies

| Package | Used for |
|---|---|
| `next`, `react`, `react-dom` | App Router, Server Components, Server Actions |
| `framer-motion` | Every spring/gesture/layoutId animation |
| `lenis` | Smooth momentum scroll |
| `three`, `@react-three/fiber`, `@react-three/drei` | The hero's 3D relational topology canvas |
| `@prisma/client`, `prisma` | ORM + migrations for the CMS |
| `zod` | Validates every Server Action's input |
| `bcryptjs` | Admin password hashing |
| `jose` | Signs/verifies the admin session (Edge-runtime compatible, required by `middleware.ts`) |
| `tsx` | Runs the TypeScript seed script |
| `tailwindcss`, `postcss`, `autoprefixer` | Styling |

---

## 3. Project structure

```
app/
  layout.tsx                      Fonts, metadata/OG, providers, Footer
  (site)/                         Public pages, wrapped in the sidebar shell
    layout.tsx
    page.tsx                      Home: headline, tools strip, bento tiles
    projects/ stack/ about/ contact/   Inner pages on the shared PageHeader + PagePanel template
  globals.css                     Dark system styles, cursor rules, focus ring
  admin/
    login/page.tsx                Public login screen (no shared layout)
    (dashboard)/                  Route group - everything below shares the admin topbar
      layout.tsx
      page.tsx                    Project list (CRUD entry point)
      studio/page.tsx             Profile, experience, and skills studio
      projects/new/page.tsx
      projects/[id]/edit/page.tsx

components/
  noise-overlay.tsx, smooth-scroll-provider.tsx, custom-cursor.tsx
  shell/           Sidebar, mobile bar, nav, shared PageHeader / PagePanel template
  home/            Tools strip, bento tiles
  hero/            3D relational-topology canvas, headline reveal, CTA pieces
  work/            Bento grid, project inspector, mobile swipe carousel
  about/           Canvas2D particle field + filterable skills grid
  contact/         Glass contact form with validation and status states
  layout/          Person JSON-LD
  projects/ stack/ about/ contact/   Page bodies (bento + inspector, topology + layers, bio, FAQ + form)
  admin/           Project create/edit form, delete confirmation, studio forms

lib/
  motion.ts                Every spring preset in the app - single source of truth
  project.ts, skill.ts     Front-end TypeScript schemas
  projects-data.ts         Public read path (Prisma row -> front-end Project shape)
types/
  portfolio.ts                 Shared contracts for profile, projects, case studies,
                               experiences, skills, and spring-driven content surfaces
  contact-validation.ts    Dependency-free contact-form validation
  site-config.ts           SEO/OG constants - Miko's real name/links go here
  profile.ts               Sidebar/home/about details: email, location, photo path, bio
  stack.ts, faqs.ts        Content for /stack and the contact FAQ
  admin-categories.ts      Category enum <-> display-label helpers
  db.ts                    Prisma client singleton
  auth.ts                  Admin session issue/verify (jose)
  actions/
    auth-actions.ts        loginAction, logoutAction
    project-actions.ts     createProject, updateProject, deleteProject (all auth-guarded)

prisma/
schema.prisma    Profile, Project, Experience, Skill, AdminUser, ContactInquiry models
  seed.ts          Seeds SwiftDo, The Safehouse, Glaze & Gaze, CareerCenter+

middleware.ts      Protects every /admin route except /admin/login
```

---

## 4. What to customize before shipping

1. **`lib/site-config.ts`** — already set to Miko's name; update `url` and
   `social` links to the real ones.
2. **`prisma/seed.ts`** — the four seeded projects use placeholder
   summaries/descriptions/metrics. Edit them to match the real project
   details, then re-run `npm run seed` (safe to run repeatedly — it
   upserts).
3. Alternatively, once seeded once, **edit projects directly through
   `/admin`** instead of touching the seed file again — that's the whole
   point of the CMS.
4. **`public/`** — add `favicon.ico`, `apple-touch-icon.png`, and
   `og-image.png` (1200x630).
5. **`components/contact/contact-form.tsx`** -> `submitInquiry()` — currently
   simulated. Wire it to write into the `ContactInquiry` table (already
   modeled in `schema.prisma`) via a new Server Action, and/or send an
   email.
6. **`components/layout/footer.tsx`** — replace the placeholder GitHub/
   LinkedIn/X links.

---

## 5. The CMS — how project management works

- Every project lives in Postgres (`Project` model), not in code.
- The public homepage (`app/page.tsx`) is a **Server Component** that reads
  via `getPublicProjects()` — no client-side fetch, no loading spinner.
- `/admin` (behind login) gives full CRUD: create, edit, and delete projects,
  including client, role, deployment, tech-stack tags, metrics, links, accent
  color, and which one is the flagship.
- Set a project's **Live demo URL** in the create/edit form to show that
  project's deployed site inside the public project preview. The deployment
  must allow framing with `Content-Security-Policy: frame-ancestors` (or
  equivalent hosting settings); otherwise visitors can still use the **View
  live demo** link in the project inspector.
- `/admin/studio` manages the editable profile signal, experience log, and
  capability graph through authenticated Server Actions.
- Every mutation calls `revalidatePath("/")`, so a change made in `/admin`
  appears on the public site immediately — no rebuild or redeploy needed.
- **Security model**: `middleware.ts` redirects an unauthenticated visitor
  away from any `/admin` page, but every Server Action in
  `project-actions.ts` *also* re-checks the session itself
  (`requireAdmin()`) — because a Server Action is its own network-reachable
  endpoint independent of which page called it. The middleware is a UX
  convenience on top of that real guard, not a substitute for it.

---

## 6. The 3D hero — relational topology

`components/hero/topology-canvas.tsx` replaces generic abstract geometry
with a small, real schema-shaped graph:

```
Client -> API Layer -> Auth
              |           |
           Database <-----+
          /    |    \
     Users  Projects  Schema
```

- Small pulses continuously travel along the edges (data/requests in
  flight).
- **Cursor velocity** (smoothed, tracked in a ref) speeds up the pulses —
  move the mouse fast, the system looks "busier."
- **Scroll position** slowly tilts the whole graph, revealing it from a
  different angle as you scroll the page.
- The node/edge content lives in `topology-data.ts`, separate from the
  rendering code — add a node or rewire an edge there without touching the
  3D component.

---

## 7. Design system conventions

- **All spring physics live in `lib/motion.ts`.** Never inline a new spring
  config.
- **Color tokens, not literals.** `surface-*`, `ink-*`, `accent`, `glass-*`
  are defined once in `tailwind.config.ts` for the light/natural palette —
  soft off-whites (`#FAFAFA`/`#F5F5F0`), sage accent (`#8A9A82`), warm
  charcoal ink (`#2B2B26`) for text. If a second theme were ever needed,
  this is the one file that would change.
- **`.specular-border` and `.focus-ring`** (in `globals.css`) are the shared
  hairline-border and keyboard-focus treatments — reuse them rather than
  inlining new border/outline colors.
- **`data-cursor="link" | "view" | "drag"`** on an element makes it morph
  the custom cursor.
- **`will-change` hygiene**: only ever set while an element is actively
  hovered/dragged, reset to `auto` on leave.
- **Reduced motion**: every animation-heavy component checks Framer
  Motion's `useReducedMotion()`.
- The magnetic cursor's white circle + `mix-blend-difference` is
  intentionally theme-agnostic (it inverts whatever is beneath it) — it
  needed zero changes during the light-theme conversion.

---

## 8. What changed in the light-theme conversion (for context)

The whole site was originally built dark-mode-first, then converted here.
Two kinds of change were involved:

1. **Token remap** (`tailwind.config.ts`): `surface-*`, `ink-*`, and
   `glass-*` were redefined from dark to light values. Every component that
   used those semantic tokens picked up the new palette automatically with
   zero per-file edits.
2. **Hardcoded literals**: anything written as a raw `white/X` or `black/X`
   opacity utility, or a literal hex like `#f5f4f1`, doesn't go through the
   token system and had to be found and flipped by hand — active-pill fills
   (now tinted sage instead of plain white), SVG icon strokes, the CTA
   spotlight glow, success/error status colors, the particle-field dot
   color, and the grain overlay's blend mode (`overlay` + white becoming
   `multiply` + warm-gray, since multiply reads as texture on a light
   surface while overlay + white barely shows).

If you add new components going forward, prefer the semantic tokens
(`bg-surface-900`, `text-ink-400`, `border-black/[0.08]` style arbitrary
values) over reaching for `white`/`black` Tailwind color names directly —
it's what makes a future theme change a one-file edit again instead of a
repeat of this audit.

---

## 9. Known follow-ups

- `app/robots.ts` / `app/sitemap.ts` — trivial once the real domain is set
  in `site-config.ts`.
- Image upload for project thumbnails (would add a storage dependency).
- Drag-to-reorder for the project list's `sortOrder`.
- ~~Email notification when a message arrives~~ — done in Phase 7, optional via `RESEND_API_KEY`.
- Automated tests.
- Rate limiting on the public contact form beyond the honeypot field.

## 10. SEO and error handling (Phase 7)

- `app/robots.ts`, `app/sitemap.ts`: generated automatically from
  `lib/site-config.ts`'s `url` — update that one value and both follow.
- Favicon, Apple touch icon, and the OG share-card are all generated by code
  (`app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`) rather
  than static files, so there's nothing to forget to upload before launch.
  Add a real photo later by dropping a static file at the same path (e.g.
  `app/icon.png`) — Next prefers it automatically.
- `app/(site)/not-found.tsx` and `app/(site)/error.tsx` handle a mistyped
  URL or a broken page inside the sidebar shell; `app/not-found.tsx` is a
  minimal fallback for anything outside it.
