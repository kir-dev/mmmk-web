# Product Overview

## Project Purpose

**mmmk-web** is the official web platform of **MMMK** (Muzsika Mívelő Mérnökök Klubja — the music club of a Hungarian university). It serves as the club's central digital hub, combining a public-facing homepage with an internal management system for club operations.

The platform replaces manual coordination (e.g. scheduling rehearsal room usage by message/email) with a structured, self-service system accessible to all club members via university SSO login.

---

## Key Features and Capabilities

### 🔐 Authentication & Access Control

- Single sign-on via **AuthSch**, the university's OAuth provider — no separate account registration required
- Role-based access: **USER** (default) and **ADMIN**
- Club membership is automatically synced from the university's PEK group management system on every login, reflecting current status (Newbie, Active, Senior, or Alumni)

### 📅 Rehearsal Room Booking

- Members can browse available time slots and **book the rehearsal room** for band practice
- Reservations track start time, end time, the booking user, and the associated band
- **Gatekeeping support**: a designated member (`isGateKeeper`) can be assigned to a reservation to supervise access
- Reservation statuses: `NORMAL`, `OVERTIME`, and `ADMINMADE` (reservations created directly by admins bypassing normal booking rules)

### 🏠 Room Information

- A dedicated page documents all **equipment available in the rehearsal room**:
  - **Drum kit** (Ludwig): 14" snare, toms, 22" bass drum, full cymbal set, double pedal
  - **Guitar amp** (Peavey Valveking 112): 50W tube combo
  - **Guitar amp** (Line6 Spider III 120): 120W digital with 12 amp models and built-in effects
  - **Bass amp head** (Gallien-Krueger Backline 600): 300W @ 4Ω
  - **Bass cabinet** (Gallien-Krueger GLX): 4×10"

### 🎸 Band Management

- Members can **create bands**, including name, email, website, description, and genre tags (with real-time autocomplete suggestions based on existing bands)
- Newly created bands require **Admin approval** (`isApproved` flag) to become public. Until approved, they are only visible to band members and admins.
- Admins can **approve, edit, and fully manage members** for any band on the platform.
- Band members and Admins can **invite new users** to their band.
- Band membership invitations start in a `PENDING` state and automatically expire after 7 days.
- Invited users must explicitly **Accept** or **Reject** the invitation; accepted users are officially added to the band.
- Bands can be linked to rehearsal reservations

### 👥 Member Directory

- Searchable **member directory** with name filtering
- Member tiles display badges and contact info
- Club membership attributes: titles, room access rights, leadership status, gatekeeper status

### 📰 News & Posts

- Admins can **publish, edit, and pin news posts** visible to all members
- Posts support pinning to surface important announcements
- Paginated post listing ordered by pinned status then by creation date

### 👤 User Profiles

- Each member has a **profile page** with their personal details
- Optional **profile picture** stored as binary data with MIME type
- Optional **dorm residency** record (room number)
- Profile data is sourced from AuthSch (name, email, phone) and can be updated

### 🛡️ Admin Panel

- Admins have access to a dedicated `/admin` page with two sections:
  - **User role management**: view all users and promote/demote them between `USER` and `ADMIN` roles (admins cannot change their own role)
  - **Reservation limits**: configure per-user and per-band daily/weekly booking hour caps; define **sanction tiers** — point-threshold-based override limits that reduce maximum bookable hours as a user accumulates sanction points
- Config is persisted in the database as a singleton `ReservationConfig` record with associated `SanctionTier` rows
- The admin page is client-side guarded: non-admin users are redirected to `/` automatically

### 📧 Email Notifications (kir-mail)

- The frontend exposes a Next.js API route (`POST /api/kir-mail`) that forwards email requests to the **kir-mail** mailing service
- Used to send reservation confirmation emails to relevant users; sender, recipient, subject, and HTML body are dynamic
- Authentication uses an `Api-Key` token (server-side only, never exposed to the browser)

### 📊 Statistics

- A dedicated `/stats` page for club-level usage statistics (route exists; content driven by reservation/membership data)

### 📋 Rules Page

- A `/rules` page documents club rules for using the rehearsal room

---

## Target Users and Use Cases

### Club Members (Role: USER)

The primary daily users of the platform. They:

- Log in with their university credentials via AuthSch
- Browse and book available rehearsal room time slots for their band
- View and manage their own profile and reservation history
- Look up other members in the member directory
- Read club news and announcements
- Check what equipment is available in the rehearsal room

### Club Leadership & Admins (Role: ADMIN)

Trusted members with elevated privileges who:

- Publish and manage news posts (including pinning important announcements)
- Manage user roles via the admin panel (promote/demote between USER and ADMIN)
- Oversee all reservations across the club; can create `ADMINMADE` reservations
- Assign gatekeepers to reservations
- Configure reservation limits (daily/weekly caps) and define sanction tiers
- Maintain room access and leadership membership flags

### Gatekeepers

A subset of active members responsible for:

- Supervising rehearsal room access during bookings
- Being assigned to specific reservations to confirm presence

### New Members (Club Membership Status: NEWBIE)

Freshly joined members whose status is automatically set based on PEK group title. The platform reflects their limited status until they become full active members.

### Alumni / Senior Members (Club Membership Status: SENIOR)

Former active members who retain platform access and appear in the member directory with their alumni status.
