'use client';
/**
 * Example Admin Page
 *
 * This page demonstrates how to use the withAdminAuth HOC
 * to protect admin-only pages.
 */

import { withAdminAuth } from '@/utils/withAuth';

function AdminDashboard() {
  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Settings Management</h2>
          <p className='text-slate-600 dark:text-slate-400'>Configure system-wide settings, quotas, and limits</p>
        </div>

        <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Period Management</h2>
          <p className='text-slate-600 dark:text-slate-400'>Open or close weeks for reservations</p>
        </div>

        <div className='bg-white dark:bg-slate-800 p-6 rounded-lg shadow'>
          <h2 className='text-xl font-semibold mb-2'>Sanction Management</h2>
          <p className='text-slate-600 dark:text-slate-400'>Manage user sanction points</p>
        </div>
      </div>
    </div>
  );
}

// Protect this page - only ADMIN role can access
export default withAdminAuth(AdminDashboard);
