/* eslint-disable no-nested-ternary */
'use client';
import { useEffect, useState } from 'react';

import axiosApi from '@/lib/apiSetup';
import { ClubMembership } from '@/types/member';
import { User } from '@/types/user';

export function RightSidebar() {
  const [gatekeepers, setGatekeepers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [usersRes, membershipsRes] = await Promise.all([axiosApi.get('/users'), axiosApi.get('/memberships')]);

        if (cancelled) return;

        const rawUsers: any[] = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.users || [];
        const memberships: ClubMembership[] = Array.isArray(membershipsRes.data)
          ? membershipsRes.data
          : membershipsRes.data?.memberships || [];

        const usersWithMembership: User[] = rawUsers.map((u: any) => {
          const cm = memberships.find((m) => m.userId === u.id);
          return cm ? { ...u, clubMembership: cm } : u;
        });

        const gks = usersWithMembership.filter((u) => u.clubMembership?.isGateKeeper);
        setGatekeepers(gks);
      } catch {
        if (!cancelled) setGatekeepers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className='w-full p-4 ml-auto overflow-y-auto'>
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold'>Aktuális beengedők</h2>
        </div>
        {loading ? (
          <p className='text-sm text-muted-foreground'>Betöltés…</p>
        ) : gatekeepers.length === 0 ? (
          <p className='text-sm text-muted-foreground'>Jelenleg nincs beengedő</p>
        ) : (
          <ul className='space-y-2'>
            {gatekeepers.map((user) => (
              <li key={user.id} className='text-sm'>
                <div className='font-medium'>{user.fullName}</div>
                <div className='text-muted-foreground'>
                  {user.email}
                  {user.phone ? ` · ${user.phone}` : ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
