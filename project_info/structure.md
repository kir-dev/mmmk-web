# Product Structure

## Directory Organization

```
mmmk-web/                             # Yarn workspace monorepo root
├── .agent/                           # AI agent documentation
├── .github/
│   └── workflows/                    # CI pipelines (lint, format, build, migrations)
├── apps/
│   ├── backend/                      # NestJS application
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Database schema + enum/model definitions
│   │   │   │                         #   Enums: Role, ClubMembershipStatus, ReservationStatus (NORMAL/OVERTIME/ADMINMADE), BandMembershipStatus
│   │   │   │                         #   New models: ReservationConfig, SanctionTier, Period
│   │   │   └── migrations/           # Auto-generated Prisma migration history
│   │   └── src/
│   │       ├── main.ts               # Bootstrap: CORS, validation pipe, Swagger, port
│   │       ├── app.module.ts         # Root module — imports all feature modules
│   │       ├── app.controller.ts     # Health/root endpoint
│   │       ├── app.service.ts        # Root service
│   │       ├── dto/
│   │       │   └── pagination.dto.ts # Shared generic PaginationDto<T>
│   │       ├── auth/                 # Authentication & authorization
│   │       │   ├── auth.module.ts
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.service.ts
│   │       │   ├── authsch.strategy.ts  # AuthSch OAuth 2.0 strategy
│   │       │   ├── jwt.strategy.ts      # JWT Bearer strategy
│   │       │   ├── roles.guard.ts       # Role-based access guard
│   │       │   └── decorators/
│   │       │       └── Roles.decorator.ts
│   │       ├── admin/                # Admin module
│   │       │   ├── dto/              # UpdateConfigDto (reservation limits + sanction tiers), SetRoleDto
│   │       │   ├── entities/         # ReservationConfig entity
│   │       │   ├── admin.controller.ts
│   │       │   ├── admin.module.ts
│   │       │   └── admin.service.ts
│   │       ├── users/
│   │       ├── bands/
│   │       ├── memberships/
│   │       ├── reservations/
│   │       ├── comments/
│   │       └── posts/
│   │           ├── dto/              # CreatePostDto, UpdatePostDto (extend entity)
│   │           ├── entities/         # Post entity (class-validator decorated)
│   │           ├── posts.controller.ts
│   │           ├── posts.module.ts
│   │           └── posts.service.ts
│   └── frontend/                     # Next.js 14 App Router application
│       └── src/
│           ├── app/                  # File-system routing (App Router)
│           │   ├── layout.tsx        # Root layout (Header+Sidebar+Footer shell)
│           │   ├── page.tsx          # Home page (redirects)
│           │   ├── globals.css       # Global Tailwind base styles
│           │   ├── admin/            # Admin panel (role mgmt + reservation config)
│           │   ├── api/
│           │   │   └── kir-mail/     # POST /api/kir-mail — proxies to kir-mail service
│           │   │       └── route.ts
│           │   ├── bands/            # Band management page
│           │   ├── callback/         # OAuth callback (stores JWT cookie)
│           │   ├── logout/           # Logout handler
│           │   ├── members/          # Member directory (searchable)
│           │   ├── mmmk/             # Club info page
│           │   ├── profile/          # User profile page
│           │   ├── reservation/      # Reservation page
│           │   ├── room/             # Equipment catalogue
│           │   ├── rules/            # Club rules
│           │   └── stats/            # Usage statistics
│           ├── components/
│           │   ├── layout/           # Shell components (rendered in root layout)
│           │   │   ├── header.tsx
│           │   │   ├── sidebar.tsx
│           │   │   ├── right-sidebar.tsx
│           │   │   ├── footer.tsx
│           │   │   ├── player.tsx    # Music player widget
│           │   │   └── theme-toggle.tsx
│           │   ├── calendar/         # Reservation calendar system
│           │   │   ├── calendar.tsx          # Root calendar component
│           │   │   ├── day/                  # Day view
│           │   │   ├── week/                 # Week view
│           │   │   ├── month/                # Month view
│           │   │   ├── date-switcher.tsx
│           │   │   ├── interval-swithcer.tsx
│           │   │   ├── add-reservation.tsx   # Booking form
│           │   │   ├── reservation-details.tsx
│           │   │   ├── add-comment.tsx
│           │   │   └── comment-details.tsx
│           │   ├── news/             # News/posts components
│           │   │   ├── news-card.tsx
│           │   │   ├── news-form.tsx
│           │   │   └── news-page.tsx
│           │   ├── band/             # Band-related components
│           │   ├── admin/            # Admin page components
│           │   │   ├── user-role-table.tsx       # Table for managing user roles
│           │   │   └── reservation-limits-form.tsx # Form to configure booking limits & sanction tiers
│           │   ├── member/           # Member tile and detail components
│           │   ├── ui/               # shadcn/ui primitives (owned, not node_modules)
│           │   │   ├── button.tsx, card.tsx, dialog.tsx, input.tsx …
│           │   │   └── (14 primitive components total)
│           │   ├── main-content.tsx  # Page content wrapper with scroll
│           │   ├── profile-page.tsx  # Profile display component
│           │   └── theme-provider.tsx
│           ├── hooks/                # Data fetching and business logic hooks
│           │   ├── useProfile.ts     # Current user profile + logout
│           │   ├── useUser.tsx       # Current user (lightweight)
│           │   ├── useAdminConfig.ts # Fetch & update ReservationConfig (admin only)
│           │   ├── use-post.tsx      # Single post
│           │   ├── useReservationDetails.ts
│           │   ├── useResrvationsThisWeek.tsx
│           │   ├── collisionWithAdminRes.tsx
│           │   ├── check-actuality-day.tsx
│           │   ├── deleteReservation.tsx
│           │   ├── getUser.tsx
│           │   └── isComment.tsx
│           ├── lib/
│           │   ├── apiSetup.ts       # Axios instance + JWT interceptor
│           │   ├── reservationSubmitter.ts  # Reservation creation logic
│           │   └── utils.ts          # cn() Tailwind class merge utility
│           ├── mocks/                # Static mock data (used until API is wired)
│           ├── types/                # TypeScript interface/type definitions
│           │   ├── user.ts, band.ts, member.ts, post.ts,
│           │   ├── reservation.ts, comment.ts, gatekeeping.ts
│           │   └── admin.ts          # ReservationConfig, SanctionTier, UpdateConfigInput types
│           └── utils/                # Pure utility functions
├── .eslintrc.js                      # Root ESLint config (extends to both apps)
├── .prettierrc.js                    # Shared Prettier config
└── package.json                      # Workspace root + shared scripts
```

---

## Core Component Relationships

### Backend Module Graph

```
AppModule
├── PrismaModule (global)   ← provides PrismaService to all modules
├── AuthModule
│   ├── AuthSchStrategy     ← validates AuthSch OAuth profile
│   ├── JwtStrategy         ← validates Bearer JWT on protected routes
│   ├── AuthService         ← issues JWT, upserts user, syncs PEK membership
│   └── AuthController      ← GET /auth/login, GET /auth/callback
├── UsersModule
│   ├── UsersService        ← findAll, findMe, findOne, update
│   └── UsersController     ← GET /users, /users/me, /users/:id, PATCH /users/:id
├── BandsModule
│   ├── BandsService        ← Filters bands based on isApproved and user role
│   └── BandsController     ← CRUD /bands (Uses OptionalJwtAuthGuard for public access)
├── MembershipsModule
│   ├── MembershipsService
│   └── MembershipsController ← CRUD /memberships
├── ReservationsModule
│   ├── ReservationsService
│   └── ReservationsController ← CRUD /reservations (all routes JWT-guarded)
├── CommentsModule
│   ├── CommentsService
│   └── CommentsController  ← CRUD /comments
├── PostsModule
│   ├── PostsService
│   └── PostsController     ← CRUD /posts + PATCH /posts/:id/pin
└── AdminModule
    ├── AdminService        ← getConfig, updateConfig (with upsert + transaction), setUserRole
    └── AdminController     ← GET /admin/config, PATCH /admin/config, PATCH /admin/users/:id/role (ADMIN only)
```

### Frontend Component Hierarchy

```
RootLayout (app/layout.tsx)
├── ThemeProvider            ← dark mode context
│   ├── Header               ← top navigation bar, user avatar, theme toggle
│   ├── Sidebar              ← primary navigation links (collapsible)
│   ├── <page>               ← route-specific page content
│   │   └── MainContent      ← scrollable content wrapper
│   ├── RightSidebar         ← contextual sidebar (upcoming reservations etc.)
│   └── Footer
```

### Data Flow: Authentication

```
Browser → GET /auth/login
       → AuthSch OAuth (external SSO)
       → GET /auth/callback
         → AuthSchStrategy.validate()
           → AuthService.findOrCreateUser()   ← upsert in DB
           → AuthService.syncClubMembership() ← sync from PEK
         → AuthService.login()               ← sign JWT
       → Redirect to FRONTEND_CALLBACK_URL?jwt=<token>
       → Frontend stores JWT in cookie
       → axiosApi interceptor attaches Bearer token to all requests
```

### Data Flow: API Requests

```
React Component
  → Custom Hook (hooks/)
    → axiosApi (lib/apiSetup.ts)
      → axios interceptor adds Authorization: Bearer <jwt_cookie>
      → NestJS Controller
        → AuthGuard('jwt') validates token → populates req.user
        → RolesGuard checks role if @Roles() applied
        → Service method
          → PrismaService → PostgreSQL
        ← Returns entity/DTO
      ← JSON response
    ← Response data
  ← State update → re-render
```

---

## Architectural Patterns

### Backend: Feature Module Pattern (NestJS)

Every domain area is a self-contained **NestJS module**. Each module bundles its own controller, service, entities, and DTOs:

```
<feature>/
├── <feature>.module.ts      # Declares the module boundary
├── <feature>.controller.ts  # HTTP layer: routes, guards, pipe binding
├── <feature>.service.ts     # Business logic, Prisma queries
├── entities/
│   └── <feature>.entity.ts  # Class-validator decorated class (mirrors Prisma model)
└── dto/
    ├── create-<feature>.dto.ts  # OmitType(Entity, [...serverFields])
    └── update-<feature>.dto.ts  # PartialType(CreateDto)
```

The entity class is the single source of truth for field declarations. DTOs inherit from it using `@nestjs/swagger` mapped types, ensuring validation decorators and OpenAPI schema are derived automatically without duplication.

```
Entity ──extends──► CreateDto ──extends──► UpdateDto (all fields optional)
  │
  └── class-validator decorators propagate to all DTOs automatically
```

### Backend: Layered Request Lifecycle

```
HTTP Request
  1. Global ValidationPipe   ← strips unknown fields (whitelist), transforms types
  2. Guard(s)                ← AuthGuard (authentication), RolesGuard (authorization)
  3. Controller method       ← extracts params, body, query; delegates to service
  4. Service method          ← business logic, Prisma ORM
  5. Prisma / PostgreSQL     ← database
  ← Response (plain object / entity)
```

### Frontend: App Router Pages + Custom Hooks

Pages in `src/app/<route>/page.tsx` are thin — they render components and import custom hooks. Business logic and data fetching live exclusively in `src/hooks/`:

```
page.tsx
  └── imports hook (hooks/)          ← owns state, fetching, error handling
        └── axiosApi (lib/apiSetup)  ← configured axios instance
  └── renders component (components/<domain>/)
        └── uses shadcn/ui primitives (components/ui/)
```

### Frontend: Shared UI Primitives (shadcn/ui)

`src/components/ui/` contains **owned** (not package-imported) shadcn/ui components. They are styled with Tailwind + CVA (class-variance-authority) and are customisable. All consuming components import from this local directory:

```
components/ui/
  button.tsx, card.tsx, dialog.tsx, input.tsx,
  badge.tsx, avatar.tsx, table.tsx, pagination.tsx, …
```

The `cn()` utility (`lib/utils.ts`) merges Tailwind classes safely using `clsx` + `tailwind-merge`, preventing conflicting utility classes.

### Database: Prisma Schema as the Canonical Data Model

The Prisma schema (`prisma/schema.prisma`) is the authoritative definition for all data shapes. Backend entity classes mirror schema models to add runtime validation, but the schema drives:

- **Migrations** (via `prisma migrate`)
- **Type generation** (via `prisma generate` → `@prisma/client`)
- **Enum definitions** shared across the application (`Role`, `ClubMembershipStatus`, `ReservationStatus`, `BandMembershipStatus`)

**New models added in this merge:**
| Model | Purpose |
|---|---|
| `Band` (updated) | Added `isApproved` flag to gate visibility on the public bands page. |
| `BandMembership` (updated) | Added `createdAt` timestamp to enable 7-day automatic expiration for `PENDING` invitations. |
| `ReservationConfig` | Singleton config record (id=1): default daily/weekly hour caps for users and bands |
| `SanctionTier` | Linked to `ReservationConfig`; defines tighter caps for users with ≥ N sanction points |
| `Period` | Date range record (start/end dates); used for scheduling periods |

The `ReservationStatus` enum was extended with a third value: `ADMINMADE` — for reservations created by admins outside normal booking rules.

Frontend type definitions in `src/types/` are manually maintained TypeScript mirrors of the Prisma models, keeping the frontend decoupled from the backend's generated client.

### CI: Gate-and-Build Pipeline

```
Push / PR to main or dev
  ├── ESLint Check  ─────┐
  ├── Prettier Check ────┤──► (both must pass)
  └── Build              │        └── prisma generate && nest build
       └── needs: [lint-check, format-check]
```

Migrations are checked in a separate workflow (`prisma-migrations-check.yml`) to ensure no unapplied schema changes are merged.
