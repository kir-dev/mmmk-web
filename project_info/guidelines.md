# Development Guidelines

This document captures the conventions, patterns, and standards used across the **mmmk-web** monorepo — a full-stack application built with NestJS (backend) and Next.js (frontend).

---

## Table of Contents

1. [Code Quality Standards](#code-quality-standards)
2. [Testing Patterns](#testing-patterns)
3. [Error Handling](#error-handling)
4. [Structural Conventions](#structural-conventions)
5. [API Design Patterns](#api-design-patterns)
6. [Common Code Idioms](#common-code-idioms)
7. [Frequently Used Patterns](#frequently-used-patterns)
8. [Configuration Management](#configuration-management)
9. [Logging Practices](#logging-practices)
10. [Version Management](#version-management)
11. [Security Practices](#security-practices)

---

## Code Quality Standards

### Linting

ESLint is enforced across the entire monorepo (`apps/**/*.ts,tsx`) and **zero warnings are tolerated** (`--max-warnings 0`). The CI pipeline blocks merges if linting fails.

**Root-level rules (both apps):**

- `camelcase` — all variable and function names must be camelCase (`properties: 'never'` relaxes object key enforcement)
- `eqeqeq` — always use `===` / `!==`; never `==`
- `prefer-const` — use `const` by default; only use `let` when reassignment is necessary
- `prefer-template` — use template literals over string concatenation
- `no-var` — `var` is banned; use `const`/`let`
- `no-eval`, `no-alert` — forbidden
- `no-nested-ternary`, `no-unneeded-ternary`, `no-negated-condition` — keep conditionals straightforward
- `max-depth`, `max-lines` — avoid deeply nested code and overly long files
- `no-implicit-coercion` — use explicit type conversions (`String(x)`, `Number(x)`)
- `no-underscore-dangle` — no `_prefixed` private fields
- `no-console` — only `console.warn` and `console.error` are permitted
- `simple-import-sort` — imports and exports must be sorted (enforced by plugin)

**Frontend-only React rules:**

- `react/hook-use-state` — hooks must follow naming conventions
- `react/jsx-pascal-case` — component names must be PascalCase
- `react/jsx-no-useless-fragment` — remove redundant `<>` wrappers
- `react/jsx-boolean-value` — boolean props should be explicit (`value={true}`, not just `value`)
- `react/jsx-curly-brace-presence` — avoid unnecessary `{}` in JSX string props
- `react/no-array-index-key` — don't use array index as `key` prop
- `react/no-unstable-nested-components` — don't define components inside render
- `react/prefer-stateless-function` — use function components; no class components
- `react/self-closing-comp` — self-close tags with no children (`<Icon />`)
- `react/no-danger` — `dangerouslySetInnerHTML` is forbidden

### Formatting

Prettier is the single source of truth for formatting. Configuration (`.prettierrc.js`):

```js
{
  semi: true,            // Semicolons required
  singleQuote: true,     // Single quotes in JS/TS
  jsxSingleQuote: true,  // Single quotes in JSX
  trailingComma: 'es5',  // Trailing commas where valid in ES5
  bracketSpacing: true,  // { foo } not {foo}
  bracketSameLine: false,// JSX closing > on its own line
  printWidth: 120,       // Max 120 chars per line
  endOfLine: 'lf',       // Unix line endings
}
```

Run before committing:

```bash
yarn format        # fix
yarn format:check  # verify (used in CI)
```

---

## Testing Patterns

> The project currently has no automated test suite. When tests are added, follow these conventions:

- **Backend**: Use NestJS's built-in testing utilities (`@nestjs/testing`, Jest). Mock `PrismaService` for unit tests; use a test database for integration tests.
- **Frontend**: Use React Testing Library + Jest for component tests. Use `msw` (Mock Service Worker) to stub API calls.
- Place test files adjacent to the files they test, using a `.spec.ts` / `.spec.tsx` suffix.
- CI should run `yarn test` as a gate before build.

---

## Error Handling

### Backend

Services translate Prisma errors into NestJS HTTP exceptions. The standard pattern:

```ts
async findOne(id: number) {
  try {
    return await this.prisma.model.findUniqueOrThrow({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        throw new NotFoundException(`This resource doesn't exist.`);
      }
      throw new InternalServerErrorException('An error occurred.');
    }
  }
}
```

**Key Prisma error codes:**
| Code | Meaning | HTTP Exception |
|------|---------|----------------|
| `P2025` | Record not found | `NotFoundException` (404) |
| Other known | DB-level error | `InternalServerErrorException` (500) |

Always re-throw as a typed NestJS exception — never let raw Prisma errors surface to the client.

Use `Promise.all` for parallel database queries and wrap with a single try/catch:

```ts
const [data, count] = await Promise.all([this.prisma.model.findMany(...), this.prisma.model.count()]);
```

### Frontend

Use `try/catch` in async hook functions. On error, set state to `null` / a safe fallback. Use `console.error` for surface-level debugging (the only permitted `console.*` method besides `console.warn`):

```ts
try {
  const response = await axiosApi.get('/endpoint');
  setData(response.data);
} catch (error) {
  console.error(error);
  setData(null);
}
```

Never swallow errors silently — always log via `console.error` or handle them visibly in the UI.

---

## Structural Conventions

### Monorepo Layout

```
mmmk-web/
├── apps/
│   ├── backend/          # NestJS application
│   │   ├── prisma/       # schema.prisma + migrations
│   │   └── src/
│   │       ├── auth/         # Auth module (strategy, guard, decorators)
│   │       ├── <feature>/    # One directory per domain (posts, users, bands, …)
│   │       │   ├── dto/          # CreateXDto, UpdateXDto
│   │       │   ├── entities/     # Entity class (mirrors Prisma model, adds class-validator)
│   │       │   ├── <feature>.controller.ts
│   │       │   ├── <feature>.module.ts
│   │       │   └── <feature>.service.ts
│   │       ├── dto/          # Shared DTOs (e.g. PaginationDto)
│   │       ├── app.module.ts
│   │       └── main.ts
│   └── frontend/         # Next.js application
│       └── src/
│           ├── app/          # Next.js App Router pages & layouts
│           ├── components/   # Reusable React components (grouped by domain)
│           │   └── ui/       # shadcn/ui primitives
│           ├── hooks/        # Custom React hooks (data fetching, business logic)
│           ├── lib/          # Utility modules (axios setup, helpers)
│           ├── mocks/        # Mock data for development/testing
│           ├── types/        # TypeScript type definitions
│           └── utils/        # Pure utility functions
├── .eslintrc.js          # Root ESLint config (shared base)
├── .prettierrc.js        # Root Prettier config
└── package.json          # Workspace root (Yarn workspaces)
```

### Backend Module Structure

Every backend feature follows the **NestJS module pattern**:

- `<feature>.module.ts` — declares controllers, providers, imports
- `<feature>.controller.ts` — route definitions, guard application, DTO binding
- `<feature>.service.ts` — business logic, Prisma queries
- `entities/<feature>.entity.ts` — class-validator annotated class mirroring the Prisma model
- `dto/create-<feature>.dto.ts` — extends entity using `OmitType` / `PartialType`
- `dto/update-<feature>.dto.ts` — partial update variant

### Frontend Component Structure

Group components by domain in `src/components/<domain>/`. Shared UI primitives live in `src/components/ui/` (shadcn/ui).

Pages live in `src/app/<route>/page.tsx`, following Next.js App Router conventions. The root layout (`src/app/layout.tsx`) wraps child pages with `Header`, `Sidebar`, `RightSidebar`, `Footer`, and `ThemeProvider`.

---

## API Design Patterns

### REST Conventions

- Resources are pluralized nouns: `/posts`, `/users`, `/bands`
- Standard CRUD maps to HTTP verbs: `POST /posts`, `GET /posts`, `GET /posts/:id`, `PATCH /posts/:id`, `DELETE /posts/:id`
- Custom actions use descriptive sub-paths with `PATCH`: `PATCH /posts/:id/pin`
- Route parameters are always parsed with `ParseIntPipe` for numeric IDs

### Pagination

List endpoints accept `?page=<n>&page_size=<n>` query params. Pass `-1` for both to fetch all records without pagination. Services return a `PaginationDto<T>`:

```ts
type PaginationDto<T> = {
  data: T[];
  count: number;
  page: number;
  limit: number; // total pages
};
```

### Swagger / OpenAPI

The backend exposes an OpenAPI spec at `/api`. Annotate protected endpoints with `@ApiBearerAuth()`. The document title is `MMMK Web API v1.0`. Use `@nestjs/swagger` decorators to document request/response shapes.

### DTOs

DTOs are derived from entities using `@nestjs/swagger` utilities:

```ts
// Create DTO: omit server-generated fields
export class CreatePostDto extends OmitType(Post, ['id', 'createdAt']) {}

// Update DTO: all fields optional
export class UpdatePostDto extends PartialType(CreatePostDto) {}
```

This ensures Swagger schema generation and class-validator decorators are inherited automatically.

### Frontend API Client

All API requests go through the shared axios instance at `src/lib/apiSetup.ts`:

```ts
const axiosApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
// Interceptor automatically attaches the JWT from cookies
axiosApi.interceptors.request.use((config) => {
  const token = getCookie('jwt');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});
```

Always import `axiosApi` from `@/lib/apiSetup` — never create ad-hoc axios instances.

---

## Common Code Idioms

### Backend

**Dependency injection via constructor:**

```ts
constructor(private readonly prisma: PrismaService) {}
```

**Guard application order** — authentication first, then authorization:

```ts
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Get('protected')
protectedRoute() { ... }
```

**Upsert pattern for membership sync:**

```ts
await this.prisma.model.upsert({
  where: { userId: user.id },
  update: { ... },
  create: { user: { connect: { id: user.id } }, ... },
});
```

### Frontend

**`cn` utility for conditional Tailwind classes:**

```ts
import { cn } from '@/lib/utils';
// cn() merges clsx + tailwind-merge to avoid class conflicts
<div className={cn('base-class', isActive && 'active-class', className)} />
```

**TypeScript path aliases:** Use `@/` as the root alias for `src/`:

```ts
import { User } from '@/types/user';
import axiosApi from '@/lib/apiSetup';
```

**Enum-based roles mirror the backend exactly:**

```ts
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
```

---

## Frequently Used Patterns

### Custom Data-Fetching Hooks

Hooks in `src/hooks/` follow this structure:

```ts
export function useResource() {
  const [data, setData] = useState<Type | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axiosApi.get('/endpoint');
      setData(response.data);
    } catch (error) {
      console.error(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, refetch: fetchData };
}
```

### NestJS Service CRUD Skeleton

```ts
@Injectable()
export class FeatureService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateFeatureDto) {
    return this.prisma.feature.create({ data: { ...dto } });
  }

  async findOne(id: number) {
    try {
      return await this.prisma.feature.findUniqueOrThrow({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException(`Feature not found.`);
      }
      throw new InternalServerErrorException('An error occurred.');
    }
  }

  async update(id: number, dto: UpdateFeatureDto) {
    /* same pattern */
  }
  async remove(id: number) {
    /* same pattern */
  }
}
```

### AuthSch OAuth Flow

1. `GET /auth/login` → redirects user to AuthSch (handled by `AuthSchStrategy`)
2. AuthSch calls `GET /auth/callback` → strategy validates profile, upserts user + membership in DB
3. Backend redirects to `FRONTEND_CALLBACK_URL?jwt=<token>`
4. Frontend stores JWT in a cookie; subsequent requests use the Bearer token via the axios interceptor

---

## Configuration Management

### Backend Environment Variables

All secrets are consumed via `process.env.*` in services and `main.ts`. No `.env` file is committed. Required variables:

| Variable                | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `DATABASE_URL`          | PostgreSQL connection string                     |
| `JWT_SECRET`            | Secret used to sign/verify JWT tokens            |
| `AUTHSCH_CLIENT_ID`     | AuthSch OAuth client ID                          |
| `AUTHSCH_CLIENT_SECRET` | AuthSch OAuth client secret                      |
| `FRONTEND_URL`          | Allowed CORS origin                              |
| `FRONTEND_CALLBACK_URL` | URL to redirect to after OAuth login             |
| `PORT`                  | Server listen port (default: `3030`)             |
| `PEK_GROUP_NAME`        | PEK group identifier for active membership check |
| `MMMK_GROUP_NAME`       | Group name for alumni/executive membership check |
| `PEK_NEWBIE_TITLE`      | PEK title string for newcomers                   |
| `PEK_MEMBER_TITLE`      | PEK title string for regular members             |
| `PEK_GATEKEEPER_TITLE`  | PEK title string for gatekeepers                 |

### Frontend Environment Variables

Prefix public variables with `NEXT_PUBLIC_`. Set in `.env.local` (never committed).

| Variable              | Purpose                                                     |
| --------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL for backend API                                    |
| `KIR_MAIL_URL`        | Base URL of the kir-mail mailing service (server-side only) |
| `KIR_MAIL_TOKEN`      | API key for authenticating with kir-mail (server-side only) |

Reference `.env.example` for a template of required variables.

> **Note:** `KIR_MAIL_URL` and `KIR_MAIL_TOKEN` are intentionally **not** prefixed with `NEXT_PUBLIC_` — they are consumed exclusively in the Next.js API route (`src/app/api/kir-mail/route.ts`) and are never exposed to the browser.

### Runtime Config vs. Build Config

- **Runtime** (server-side): access via `process.env.VAR` — no special setup needed in NestJS.
- **Frontend build-time**: only `NEXT_PUBLIC_*` variables are embedded at build time and accessible in the browser. Other `process.env.*` on the frontend is server-only (API routes, Server Components).

---

## Logging Practices

### Backend

NestJS provides a built-in logger (`Logger` from `@nestjs/common`). Use it over `console.*` in services and controllers:

```ts
import { Logger } from '@nestjs/common';

@Injectable()
export class FeatureService {
  private readonly logger = new Logger(FeatureService.name);

  async doSomething() {
    this.logger.log('Doing something');
    this.logger.warn('Something might be wrong');
    this.logger.error('Something failed', error.stack);
  }
}
```

ESLint forbids `console.log` in backend code — only `console.warn` and `console.error` are allowed at the root level (and should be replaced by the NestJS logger in production code).

### Frontend

- Use `console.error(error)` in catch blocks for unexpected failures.
- Use `console.warn` for non-critical issues or deprecation notices.
- `console.log` is disallowed by ESLint — remove all debug logs before committing.

---

## Version Management

### Package Versions

The project uses **Yarn 1 (Classic)** as the package manager. The exact version is pinned in `package.json`:

```json
"packageManager": "yarn@1.22.22+sha512..."
```

Use `yarn` (not `npm` or `pnpm`) for all package management commands.

### Node.js

The CI pipeline targets **Node.js 20** (LTS). Use the same version locally.

### Dependency Resolutions

Two packages are pinned via Yarn `resolutions` to avoid version conflicts:

```json
"resolutions": {
  "wrap-ansi": "7.0.0",
  "string-width": "4.1.0"
}
```

Do not remove these unless the underlying conflict is resolved upstream.

### Application Versioning

Both `apps/backend` and `apps/frontend` are pinned at `0.0.0` — versioning is managed at the infrastructure/deployment level, not through `package.json` versions.

### Database Migrations

Prisma migrations live in `apps/backend/prisma/migrations/`. Always generate and apply migrations before building:

```bash
yarn prisma migrate dev    # development
yarn prisma migrate deploy # production
```

The CI checks for unapplied migrations via `.github/workflows/prisma-migrations-check.yml`.

---

## Security Practices

### Authentication

- OAuth is handled via **AuthSch** (`@kir-dev/passport-authsch`), the university SSO provider. Never implement custom username/password auth.
- JWT tokens are signed with `JWT_SECRET` and expire after **7 days**.
- Tokens are extracted from the `Authorization: Bearer <token>` header via `passport-jwt`.
- On the frontend, the JWT is stored in a **cookie** (`jwt`) and attached to every API request via an axios interceptor.

### Authorization

Apply guards in this order on protected endpoints:

1. `@UseGuards(AuthGuard('jwt'))` — verifies the JWT and populates `req.user`
2. `@UseGuards(RolesGuard)` paired with `@Roles(Role.ADMIN)` — checks the user's role

`RolesGuard` grants access if the user is `ADMIN` regardless of the required role, or if their role matches one of the declared roles. Public endpoints require no guards.

### Input Validation

Global `ValidationPipe` is applied with:

- `whitelist: true` — strips any properties not declared in the DTO
- `transform: true` — auto-transforms plain objects into DTO class instances
- `enableImplicitConversion: true` — converts query param strings to the correct primitive types

All DTOs must use `class-validator` decorators (`@IsString()`, `@IsNotEmpty()`, `@IsOptional()`, etc.) on every field.

### CORS

CORS is configured in `main.ts` to allow only the frontend origin (`FRONTEND_URL`). Permitted methods: `GET, POST, PATCH, PUT, DELETE`. Credentials (cookies) are enabled.

### Secrets — Never Commit

- `.env` files are gitignored. Use `.env.example` to document required variables.
- `JWT_SECRET`, `AUTHSCH_CLIENT_SECRET`, `DATABASE_URL` must never appear in source code or logs.
- In services, always read secrets from `process.env` at runtime — do not cache them as module-level constants.

### Dependency Safety

- Keep dependencies up to date; use `yarn audit` to check for vulnerabilities.
- The `no-eval` ESLint rule prevents dynamic code execution.
- The `react/no-danger` rule prevents `dangerouslySetInnerHTML` from being used.
