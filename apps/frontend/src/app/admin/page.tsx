'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { UserRoleTable } from '@/components/admin/user-role-table';
import { useProfile } from '@/hooks/useProfile';
import { Role } from '@/types/user';

import OpenedWeeksPanel from '../../components/admin/OpenedWeeksPanel';
import PeriodsPanel from '../../components/admin/PeriodsPanel';
import SettingsPanel from '../../components/admin/SettingsPanel';

export default function AdminPage() {
  const router = useRouter();
  const { profile, loading } = useProfile();

  useEffect(() => {
    if (!loading && (!profile || profile.role !== Role.ADMIN)) {
      router.replace('/');
    }
  }, [loading, profile, router]);

  if (loading || !profile || profile.role !== Role.ADMIN) {
    return null;
  }

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-row p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary'>Admin panel</h1>
      </div>
      <div className='p-4 space-y-8 max-w-4xl mx-auto'>
        <section className='space-y-3'>
          <h2 className='text-lg font-semibold'>Felhasználói szerepek</h2>
          <p className='text-sm text-muted-foreground'>
            Admin jogosultság adása vagy elvétele. Saját magad szerepét nem módosíthatod.
          </p>
          <UserRoleTable currentUserId={profile.id} />
        </section>

        <section className='space-y-3'>
          <h2 className='text-lg font-semibold'>Megnyitott hetek</h2>
          <p className='text-sm text-muted-foreground' />
          <OpenedWeeksPanel />
        </section>

        <section className='space-y-3'>
          <h2 className='text-lg font-semibold'>Félévek</h2>
          <p className='text-sm text-muted-foreground' />
          <PeriodsPanel />
        </section>

        <section className='space-y-3'>
          <h2 className='text-lg font-semibold'>Beállítások</h2>
          <p className='text-sm text-muted-foreground' />
          <SettingsPanel />
        </section>
      </div>
    </div>
  );
}
