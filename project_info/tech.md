# Tech Stack

## Programming Languages

| Language          | Version  | Usage                                             |
| ----------------- | -------- | ------------------------------------------------- |
| **TypeScript**    | `^5.4.5` | All source code — backend and frontend            |
| **HTML / JSX**    | —        | Frontend templating via React/Next.js             |
| **CSS**           | —        | Global styles (`globals.css`), Tailwind utilities |
| **Prisma Schema** | —        | Declarative database schema definition            |

TypeScript is configured differently per app:

- **Backend** (`tsconfig.json`): `target: ES2017`, `module: CommonJS`, `emitDecoratorMetadata: true`, `experimentalDecorators: true` (required for NestJS decorators), `strictNullChecks: false`
- **Frontend** (`tsconfig.json`): `strict: true`, `module: ESNext`, `jsx: preserve`, `noEmit: true`, `isolatedModules: true`; path aliases `@/*` → `src/*` and `@components/*` → `src/components/*`

---

## Core Dependencies

### Backend (`apps/backend`)

| Package                     | Version    | Role                                               |
| --------------------------- | ---------- | -------------------------------------------------- |
| `@nestjs/core`              | `^10.3.8`  | NestJS application framework                       |
| `@nestjs/common`            | `^10.4.16` | Decorators, pipes, guards, exceptions              |
| `@nestjs/platform-express`  | `^10.3.8`  | Express.js HTTP adapter                            |
| `@nestjs/jwt`               | `^10.2.0`  | JWT signing and verification                       |
| `@nestjs/passport`          | `^10.0.3`  | Passport integration for NestJS                    |
| `@nestjs/swagger`           | `^7.3.1`   | OpenAPI spec generation + Swagger UI               |
| `@kir-dev/passport-authsch` | `^2.2.2`   | AuthSch university OAuth 2.0 strategy              |
| `passport`                  | `^0.7.0`   | Authentication middleware                          |
| `passport-jwt`              | `^4.0.1`   | JWT Passport strategy                              |
| `@prisma/client`            | `6.3.1`    | Type-safe database client (auto-generated)         |
| `prisma`                    | `6.3.1`    | ORM + migration toolkit                            |
| `nestjs-prisma`             | `^0.23.0`  | PrismaModule/PrismaService integration for NestJS  |
| `class-validator`           | `^0.14.1`  | Decorator-based DTO validation                     |
| `class-transformer`         | `^0.5.1`   | Plain object ↔ class instance transformation      |
| `rxjs`                      | `^7.8.1`   | Reactive primitives (required by NestJS internals) |
| `reflect-metadata`          | `^0.2.2`   | Metadata reflection (required by decorators)       |

### Frontend (`apps/frontend`)

| Package                    | Version             | Role                                               |
| -------------------------- | ------------------- | -------------------------------------------------- |
| `next`                     | `14.2.35`           | React meta-framework with App Router               |
| `react` / `react-dom`      | `^18.2.0`           | UI rendering                                       |
| `axios`                    | `^1.10.0`           | HTTP client (wrapped in `lib/apiSetup.ts`)         |
| `swr`                      | `^2.3.4`            | Stale-while-revalidate data fetching               |
| `cookies-next`             | `^6.1.0`            | Cookie access in Next.js (SSR + client)            |
| `js-cookie`                | `^3.0.5`            | Client-side cookie management                      |
| `geist`                    | `^1.3.1`            | Geist Sans font (Vercel's typeface)                |
| `next-themes`              | `^0.4.4`            | Dark/light mode switching                          |
| `framer-motion`            | `^11.15.0`          | Animation library                                  |
| `lucide-react`             | `^0.468.0`          | Icon library                                       |
| `react-icons`              | `^5.5.0`            | Additional icon sets                               |
| `@tanstack/react-table`    | `^8.20.5`           | Headless table primitives                          |
| **Tailwind & shadcn/ui**   |                     |                                                    |
| `tailwindcss`              | `^3.4.3`            | Utility-first CSS framework                        |
| `tailwindcss-animate`      | `^1.0.7`            | Animation utilities for Tailwind                   |
| `tailwind-merge`           | `^2.5.5`            | Conflict-safe Tailwind class merging               |
| `clsx`                     | `^2.1.1`            | Conditional className composition                  |
| `class-variance-authority` | `^0.7.1`            | Type-safe component variants (CVA)                 |
| `@radix-ui/react-*`        | various             | Headless accessible UI primitives (shadcn/ui base) |
| `shadcn` / `@shadcn/ui`    | `^2.1.7` / `^0.0.4` | CLI for generating UI component code               |

---

## Infrastructure Technologies

| Technology                  | Version                | Role                                                            |
| --------------------------- | ---------------------- | --------------------------------------------------------------- |
| **PostgreSQL**              | `13.10` (Docker image) | Primary relational database                                     |
| **Docker**                  | —                      | Backend containerisation                                        |
| **Docker Compose**          | —                      | Local multi-service orchestration (backend app + database)      |
| **Docker Buildx**           | —                      | Multi-platform image builds (`linux/amd64`)                     |
| **Private Docker Registry** | —                      | Image storage and distribution (credentials via GitHub Secrets) |

The backend is containerised as a two-stage Docker build:

- **Stage 1 (`build`)**: `node:22-alpine` — installs deps, runs `prisma generate`, compiles TypeScript → `dist/`
- **Stage 2 (`production`)**: `node:22-alpine` — copies only compiled output + production deps, runs `node dist/main`

The database is a persistent PostgreSQL 13.10 container. Data is stored in a named external Docker volume (`mmmk_db_folder`), which must be created outside of Compose.

---

## Build Systems

### Backend

| Tool                           | Config file                             | Role                                                       |
| ------------------------------ | --------------------------------------- | ---------------------------------------------------------- |
| **NestJS CLI** (`@nestjs/cli`) | `nest-cli.json`                         | Builds NestJS app, watches for changes, generates scaffold |
| **TypeScript compiler**        | `tsconfig.json` / `tsconfig.build.json` | Transpiles TS → CommonJS JS in `dist/`                     |
| **Prisma CLI**                 | `prisma/schema.prisma`                  | Generates type-safe DB client, manages migrations          |

The `@nestjs/swagger` compiler plugin is enabled in `nest-cli.json` with `introspectComments: true` — JSDoc comments on controller methods are automatically included in the OpenAPI spec without requiring explicit decorators.

Test spec file generation is disabled (`"spec": false`) in the NestJS schematics config.

### Frontend

| Tool                   | Config file          | Role                                                      |
| ---------------------- | -------------------- | --------------------------------------------------------- |
| **Next.js** (built-in) | `next.config.mjs`    | Compiles, bundles, and serves React app                   |
| **PostCSS**            | `postcss.config.mjs` | Processes Tailwind directives                             |
| **Tailwind CSS**       | `tailwind.config.ts` | Scans `src/**/*.{ts,tsx}` for used classes, generates CSS |

The Tailwind config extends a semantic colour token system using HSL CSS variables, so light/dark theme switching works by swapping CSS variable values — all colour tokens (`background`, `foreground`, `primary`, `card`, etc.) map to `hsl(var(--token))`.

---

## Development Tools

| Tool                               | Config file                     | Role                                                    |
| ---------------------------------- | ------------------------------- | ------------------------------------------------------- |
| **ESLint** `^8.57.0`               | `.eslintrc.js` (root + per-app) | Linting with zero-warning policy                        |
| **Prettier** `^3.2.5`              | `.prettierrc.js`                | Code formatting                                         |
| `eslint-plugin-simple-import-sort` | root `.eslintrc.js`             | Enforces sorted imports/exports                         |
| `eslint-plugin-prettier`           | root `.eslintrc.js`             | Runs Prettier as an ESLint rule                         |
| `eslint-config-next`               | frontend `.eslintrc.js`         | Next.js-specific lint rules                             |
| `eslint-plugin-react`              | frontend `.eslintrc.js`         | React-specific lint rules                               |
| `@typescript-eslint/*`             | both apps                       | TypeScript-aware linting                                |
| **shadcn CLI**                     | `components.json`               | Generates local UI components into `src/components/ui/` |
| **Yarn** `1.22.22`                 | `package.json`                  | Package manager (classic, workspace-aware)              |

---

## Development Commands

All commands are run from the **monorepo root** unless noted.

### Monorepo-level

```bash
yarn install              # Install all workspace dependencies

yarn lint                 # ESLint across all .ts/.tsx files (0 warnings allowed)
yarn lint:fix             # Fix auto-fixable lint issues

yarn format               # Prettier write all files in apps/
yarn format:check         # Verify formatting (used in CI)

yarn start:backend        # Start backend in watch mode
yarn start:frontend       # Start frontend dev server

yarn build:backend        # Build NestJS → dist/
yarn build:frontend       # Build Next.js for production
```

### Backend (`apps/backend`)

```bash
yarn start:dev            # Nest watch mode (hot reload)
yarn start:debug          # Watch mode with Node inspector attached
yarn start:prod           # Run compiled bundle (node dist/main)
yarn build                # Compile TypeScript (rimraf dist first)

yarn prisma generate      # Regenerate Prisma Client from schema
yarn prisma migrate dev   # Create and apply a new migration (dev)
yarn prisma migrate deploy # Apply pending migrations (production)
yarn prisma studio        # Open Prisma Studio GUI for DB inspection
```

### Frontend (`apps/frontend`)

```bash
yarn dev                  # Next.js dev server with HMR
yarn build                # Production build
yarn start                # Serve production build
yarn lint                 # Next.js lint (wraps ESLint)
```

---

## Release Management

Releases are driven entirely by **Git branch pushes** and **GitHub Actions**:

| Trigger                      | Workflow                      | Action                                                      |
| ---------------------------- | ----------------------------- | ----------------------------------------------------------- |
| Push / PR to `main` or `dev` | `analysis.yml`                | Run ESLint + Prettier checks, then build                    |
| Push to `main`               | `deploy.yml`                  | Build multi-platform Docker image, push to private registry |
| Push / PR to `main` or `dev` | `prisma-migrations-check.yml` | Verify no unapplied Prisma migrations                       |

The Docker image is tagged `:latest` (`mmmk-backend:latest`) and pushed to the private registry on every merge to `main`. There is no semantic versioning of releases — deployment is continuous.

Both `apps/backend` and `apps/frontend` `package.json` files are pinned at `version: 0.0.0`. Operational versioning is handled at the infrastructure level.

---

## Runtime Environment

### Backend

| Property              | Value                                                                    |
| --------------------- | ------------------------------------------------------------------------ |
| **Runtime**           | Node.js 22 (production Docker image: `node:22-alpine`)                   |
| **Process**           | `node dist/main` (plain Node — no PM2 or cluster in container)           |
| **Default port**      | `3030` (configurable via `PORT` env var)                                 |
| **Container restart** | `always` (Docker Compose)                                                |
| **ORM**               | Prisma Client (library engine mode: `PRISMA_CLIENT_ENGINE_TYPE=library`) |
| **Database**          | PostgreSQL 13                                                            |

### Frontend

| Property             | Value                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime**          | Node.js 20 (CI target)                                                                                                                                              |
| **Framework server** | Next.js (`next start` — serves SSR + static assets)                                                                                                                 |
| **Default port**     | `3000` (Next.js default)                                                                                                                                            |
| **Rendering modes**  | App Router: Server Components by default; `'use client'` for interactive pages                                                                                      |
| **Font**             | Geist Sans (loaded via `geist` npm package, no external font CDN)                                                                                                   |
| **Theme**            | Dark mode default (`defaultTheme='dark'`), system preference supported                                                                                              |
| **API Routes**       | `src/app/api/kir-mail/route.ts` — server-side proxy to the kir-mail mailing service; env vars `KIR_MAIL_URL` + `KIR_MAIL_TOKEN` required (never exposed to browser) |

### CI Runner

All GitHub Actions workflows run on `ubuntu-latest` with **Node.js 20**.
