/* eslint-disable no-nested-ternary */
'use client';

import { Input } from '@components/ui/input';
import { useEffect, useState } from 'react';

import MemberTile from '@/components/member/member-tile';
import axiosApi from '@/lib/apiSetup';
import { ClubMembership } from '@/types/member';
import { User } from '@/types/user';

export default function Members() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);
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

        setUsers(usersWithMembership as User[]);
        setFilteredData(usersWithMembership as User[]);
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
    setFilteredData(users.filter((user) => user.fullName.toLowerCase().includes(term)));
  }, [searchTerm, users]);

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-row p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary'>Felhasználók</h1>
        <Input
          placeholder='Keresés...'
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className='max-w-sm target:ring-0'
        />
      </div>
      {loading ? (
        <div className='h-24 flex items-center justify-center text-center'>Betöltés…</div>
      ) : error ? (
        <div className='h-24 flex items-center justify-center text-center'>{error}</div>
      ) : filteredData.length ? (
        <div className='grid gap-8 py-4 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(228px,228px))] justify-center'>
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
