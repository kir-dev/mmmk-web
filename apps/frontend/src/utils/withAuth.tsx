import { useRouter } from 'next/navigation';
import { ComponentType, useEffect } from 'react';

import { useUser } from '@/hooks/useUser';

type UserRole = 'ADMIN' | 'USER' | 'GATEKEEPER';

interface WithAuthOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
  redirectUnauthorizedTo?: string;
}

/**
 * Higher-Order Component for page-level authentication and authorization
 *
 * @param Component - The component to protect
 * @param options - Configuration options
 * @param options.allowedRoles - Array of roles that can access this page. If undefined, any authenticated user can access.
 * @param options.redirectTo - Where to redirect if not authenticated (default: '/login')
 * @param options.redirectUnauthorizedTo - Where to redirect if authenticated but not authorized (default: '/')
 *
 * @example
 * ```tsx
 * // Admin-only page
 * export default withAuth(AdminDashboard, { allowedRoles: ['ADMIN'] });
 *
 * // Any authenticated user
 * export default withAuth(ProfilePage);
 * ```
 */
export function withAuth<P extends object>(Component: ComponentType<P>, options: WithAuthOptions = {}) {
  const { allowedRoles, redirectTo = '/login', redirectUnauthorizedTo = '/' } = options;

  return function ProtectedRoute(props: P) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        // Not authenticated - redirect to login
        if (!user) {
          router.push(redirectTo);
          return;
        }

        // Determine the user's effective role
        // Priority: ADMIN > GATEKEEPER > USER
        let effectiveRole: UserRole = user.role as UserRole;

        // If user has gatekeeper status and isn't already an admin, treat as GATEKEEPER role
        if (effectiveRole !== 'ADMIN' && user.clubMembership?.isGateKeeper) {
          effectiveRole = 'GATEKEEPER';
        }

        // Check if user's effective role is in the allowed roles
        if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
          router.push(redirectUnauthorizedTo);
          return;
        }
      }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4' />
            <p className='text-slate-600 dark:text-slate-400'>Betöltés...</p>
          </div>
        </div>
      );
    }

    // Don't render anything if not authenticated
    if (!user) {
      return null;
    }

    // Calculate effective role for rendering check (same logic as redirect)
    let effectiveRole: UserRole = user.role as UserRole;
    if (effectiveRole !== 'ADMIN' && user.clubMembership?.isGateKeeper) {
      effectiveRole = 'GATEKEEPER';
    }

    // Don't render anything if not authorized
    if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
      return null;
    }

    // User is authenticated and authorized
    return <Component {...props} />;
  };
}

/**
 * HOC specifically for admin-only pages
 */
export function withAdminAuth<P extends object>(Component: ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ['ADMIN'] });
}

/**
 * HOC for gatekeeper or admin pages (gatekeepers have intermediate permissions)
 */
export function withGatekeeperAuth<P extends object>(Component: ComponentType<P>) {
  return withAuth(Component, { allowedRoles: ['ADMIN', 'GATEKEEPER'] });
}

/**
 * HOC for any authenticated user (no role restriction)
 * This includes USER, GATEKEEPER, and ADMIN
 */
export function withUserAuth<P extends object>(Component: ComponentType<P>) {
  return withAuth(Component);
}
