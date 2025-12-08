# Product Overview

## Project Purpose

**mmmk-web** is the official web platform of **MMMK** (Mérnöki Muzsikusok Művelődési Köre — the music club of a Hungarian university). It serves as the club's central digital hub, combining a public-facing homepage with an internal management system for club operations.

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
- Reservation statuses: `NORMAL` and `OVERTIME`

### 🏠 Room Information
- A dedicated page documents all **equipment available in the rehearsal room**:
  - **Drum kit** (Ludwig): 14" snare, toms, 22" bass drum, full cymbal set, double pedal
  - **Guitar amp** (Peavey Valveking 112): 50W tube combo
  - **Guitar amp** (Line6 Spider III 120): 120W digital with 12 amp models and built-in effects
  - **Bass amp head** (Gallien-Krueger Backline 600): 300W @ 4Ω
  - **Bass cabinet** (Gallien-Krueger GLX): 4×10"

### 🎸 Band Management
- Members can **create and manage bands**, including name, email, website, description, and genre tags
- Band membership with approval flow: `PENDING` → `ACCEPTED`
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
- Manage user roles and membership data
- Oversee all reservations across the club
- Assign gatekeepers to reservations
- Maintain room access and leadership membership flags

### Gatekeepers
A subset of active members responsible for:
- Supervising rehearsal room access during bookings
- Being assigned to specific reservations to confirm presence

### New Members (Club Membership Status: NEWBIE)
Freshly joined members whose status is automatically set based on PEK group title. The platform reflects their limited status until they become full active members.

### Alumni / Senior Members (Club Membership Status: SENIOR)
Former active members who retain platform access and appear in the member directory with their alumni status.
