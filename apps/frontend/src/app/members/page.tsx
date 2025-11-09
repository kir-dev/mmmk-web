/* eslint-disable no-nested-ternary */
'use client';

import { Input } from '@components/ui/input';
import { useEffect, useState } from 'react';

import MemberTile from '@/components/member/member-tile';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { ClubMembership } from '@/types/member';
import { User } from '@/types/user';

export default function Members() {
  const { user: me } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([axiosApi.get('/users'), axiosApi.get('/memberships')])
      .then(([usersRes, membershipsRes]) => {
        if (cancelled) return;
        const rawUsers: any[] = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.users || [];
        const memberships: ClubMembership[] = Array.isArray(membershipsRes.data)
          ? membershipsRes.data
          : membershipsRes.data?.memberships || [];

        const usersWithMembership: User[] = rawUsers.map((u: any) => {
          const cm = memberships.find((m) => m.userId === u.id);
          return cm ? { ...u, clubMembership: cm } : u;
        });

        const sortedUsers = [...(usersWithMembership as User[])].sort((a, b) =>
          a.fullName.localeCompare(b.fullName, 'hu', { sensitivity: 'base' })
        );

        setUsers(sortedUsers);
        setFilteredData(sortedUsers);
        setMemberships(memberships);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Nem sikerült betölteni a felhasználókat.');
        setUsers([]);
        setFilteredData([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter((user) => user.fullName.toLowerCase().includes(term));
    const sorted = [...filtered].sort((a, b) => a.fullName.localeCompare(b.fullName, 'hu', { sensitivity: 'base' }));
    setFilteredData(sorted);
  }, [searchTerm, users]);

  if (!me) {
    return (
      <div className='w-full'>
        <div className='p-8 text-center'>Betöltés…</div>
      </div>
    );
  }

  if (!(me as any)?.clubMembership && !(memberships || []).some((m) => m.userId === me.id)) {
    return (
      <div className='w-full'>
        <div className='p-8 text-center text-red-500 font-bold'>Nincs jogosultságod megtekinteni ezt az oldalt.</div>
      </div>
    );
  }

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-col sm:flex-row gap-3 p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary w-full sm:w-auto text-center sm:text-left'>Felhasználók</h1>
        <Input
          placeholder='Keresés...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className='w-full sm:max-w-sm target:ring-0'
        />
      </div>
      {loading ? (
        <div className='h-24 flex items-center justify-center text-center'>Betöltés…</div>
      ) : error ? (
        <div className='h-24 flex items-center justify-center text-center'>{error}</div>
      ) : filteredData.length ? (
        <div className='grid gap-6 py-4 auto-rows-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center'>
          {filteredData.map((user) => (
            <MemberTile user={user} key={user.id} showBadge showContact />
          ))}
        </div>
      ) : (
        <div className='h-24 flex items-center justify-center text-center'>Nincs találat.</div>
      )}
    </div>
  );
}
