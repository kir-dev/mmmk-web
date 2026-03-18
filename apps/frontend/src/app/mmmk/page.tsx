'use client';

import { useEffect, useMemo, useState } from 'react';

import MemberTile from '@/components/member/member-tile';
import { Card, CardContent } from '@/components/ui/card';
import axiosApi from '@/lib/apiSetup';
import { ClubMembership } from '@/types/member';
import { User } from '@/types/user';

export default function MMMK() {
  const [users, setUsers] = useState<User[]>([]);
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

        setUsers(usersWithMembership);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const leaders = useMemo(() => {
    const hasTitle = (u: User, title: string) => u.clubMembership?.titles?.some((t) => t.toLowerCase() === title);
    const list = users.filter(
      (u) =>
        hasTitle(u, 'körvezető') ||
        hasTitle(u, 'teremmester') ||
        hasTitle(u, 'gazdaságis') ||
        u.clubMembership?.isLeadershipMember
    );
    const seen = new Set<number>();
    const deduped = list.filter((u) => (seen.has(u.id) ? false : (seen.add(u.id), true)));
    deduped.sort((a, b) => Number(hasTitle(b, 'körvezető')) - Number(hasTitle(a, 'körvezető')));
    return deduped;
  }, [users]);
  const gatekeepers = useMemo(
    () =>
      users
        .filter((u) => u.clubMembership?.isGateKeeper)
        .slice()
        .sort((a, b) => a.fullName.localeCompare(b.fullName, 'hu')),
    [users]
  );

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-col sm:flex-row gap-2 p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary text-center sm:text-left'>Muzsika Mívelő Mérnökök Klubja</h1>
      </div>
      <div className='mx-auto px-4 pb-8'>
        <h1 className='text-2xl font-semibold mt-8 mb-4'>Rólunk</h1>
        <Card>
          <CardContent>
            <p className='leading-relaxed pt-6'>
              Az MMMK lényegében egy zenekari próbatermet üzemeltető kollégium első emeletén, a 119-es teremben, ami fel
              van szerelve sok jó dologgal a gyakorláshoz. Vannak gitárerősítők, mikrofonok, és van dob. Előre megadott
              időpontokra lehet jelentkezni a honlapunkon, utána lehet menni próbálni - akár egyénileg akár egész
              zenekarral. Emellett a kör több zenés rendezvényt is szokott szervezni a kollégiumon belül, amiken az
              előzőeket kedvelő kollégisták kielégíthetik vágyaikat.
            </p>
          </CardContent>
        </Card>

        <h1 className='text-2xl font-semibold mt-8 mb-4'>Vezetőség</h1>
        {loading ? (
          <p className='text-sm text-muted-foreground'>Betöltés…</p>
        ) : (
          <div className='grid gap-2 auto-rows-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center'>
            {leaders.map((leader) => (
              <MemberTile user={leader} key={leader.id} showTitle showContact />
            ))}
          </div>
        )}

        <h1 className='text-2xl font-semibold mt-8 mb-4'>Beengedők</h1>
        {loading ? (
          <p className='text-sm text-muted-foreground'>Betöltés…</p>
        ) : (
          <div className='grid gap-6 auto-rows-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center'>
            {gatekeepers.map((user) => (
              <MemberTile user={user} key={user.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
