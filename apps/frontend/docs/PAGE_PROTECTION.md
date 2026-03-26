# Page Protection System

Comprehensive role-based authentication and authorization system for protecting pages and routes.

## Features

- ✅ Server-side route protection via Next.js Middleware
- ✅ Client-side role-based access control via HOC
- ✅ Loading states during authentication check
- ✅ Automatic redirects for unauthorized access
- ✅ Type-safe role definitions

## Components

### 1. Middleware (`src/middleware.ts`)

Server-side protection that runs before pages load. Checks for JWT token presence and redirects to login if missing.

**Protected by default:**

- `/admin/*` - Admin pages
- `/profile` - User profile
- `/settings` - User settings

**To add more protected routes:**

```typescript
const protectedPaths = [
  '/admin',
  '/profile',
  '/settings',
  '/dashboard', // Add your route here
];
```

### 2. `withAuth` HOC (`src/utils/withAuth.tsx`)

Client-side HOC for fine-grained role-based access control.

## Usage Examples

### Admin-Only Page

```tsx
import { withAdminAuth } from '@/utils/withAuth';

function AdminPage() {
  return <div>Admin Content</div>;
}

export default withAdminAuth(AdminPage);
```

### Any Authenticated User

```tsx
import { withUserAuth } from '@/utils/withAuth';

function ProfilePage() {
  return <div>User Profile</div>;
}

export default withUserAuth(ProfilePage);
```

### Custom Role Configuration

```tsx
import { withAuth } from '@/utils/withAuth';

function SpecialPage() {
  return <div>Special Content</div>;
}

export default withAuth(SpecialPage, {
  allowedRoles: ['ADMIN'], // Only admins
  redirectTo: '/login', // Where to send if not logged in
  redirectUnauthorizedTo: '/403', // Where to send if logged in but wrong role
});
```

### Multiple Roles

```tsx
// If you add more roles in the future
export default withAuth(Page, {
  allowedRoles: ['ADMIN', 'MODERATOR'],
});
```

## How It Works

### 1. Middleware (Server-Side)

- Runs on every request before page loads
- Checks for JWT token in cookies
- Redirects to `/login` if token is missing
- Preserves intended destination in URL params

### 2. HOC (Client-Side)

- Runs after page loads
- Fetches current user via `useUser` hook
- Checks user role against allowed roles
- Shows loading spinner while checking
- Redirects if unauthorized
- Renders page if authorized

## Security Notes

1. **Double Protection:** Middleware + HOC provides both server and client-side security
2. **Backend Validation:** Always validate permissions on backend API endpoints too
3. **Token Expiry:** JWT expiration is handled by the backend
4. **Redirect Loop Prevention:** Login page is excluded from middleware matcher

## Customization

### Change Loading UI

Edit the loading component in `withAuth.tsx`:

```tsx
if (loading) {
  return <YourCustomLoadingComponent />;
}
```

### Add More Roles

1. Update the `UserRole` type in `withAuth.tsx`:

```typescript
type UserRole = 'ADMIN' | 'USER' | 'MODERATOR' | 'GUEST';
```

2. Use in your pages:

```tsx
export default withAuth(Page, { allowedRoles: ['MODERATOR'] });
```

## File Structure

```
src/
├── middleware.ts           # Server-side route protection
├── utils/
│   └── withAuth.tsx       # Client-side HOC for role-based access
├── pages/
│   ├── admin/
│   │   └── index.tsx      # Example admin page
│   └── login.tsx          # Login page (public)
└── hooks/
    └── useUser.ts         # Hook for current user data
```

## Testing

1. **As Guest:** Try accessing `/admin` → Should redirect to `/login`
2. **As USER:** Log in, try `/admin` → Should redirect to `/` (unauthorized)
3. **As ADMIN:** Log in, access `/admin` → Should show admin content

## Troubleshooting

**Redirect loop to login:**

- Check that `/login` is excluded in middleware matcher
- Verify `useUser` hook returns `loading: false` eventually

**Page flashes before redirect:**

- Normal behavior - middleware prevents server-side access, HOC prevents client-side
- Consider adding SSR if you need server-side role checks

**Role check not working:**

- Verify user role is correctly set in JWT payload
- Check that role matches exactly (`'ADMIN'` not `'admin'`)
