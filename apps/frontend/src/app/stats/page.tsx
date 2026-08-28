'use client';

import { useEffect, useMemo, useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { ClubMembership } from '@/types/member';
import { Reservation } from '@/types/reservation';
import { Role, User } from '@/types/user';
import { withGatekeeperAuth } from '@/utils/withAuth';

function Stats() {
  const { user: me } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [memberships, setMemberships] = useState<ClubMembership[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      axiosApi.get('/users'),
      axiosApi.get('/memberships'),
      axiosApi.get('/reservations', { params: { page: -1, page_size: -1 } }),
    ])
      .then(([usersRes, membershipsRes, reservationsRes]) => {
        if (cancelled) return;

        const rawUsers: any[] = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data?.users || [];
        const ms: ClubMembership[] = Array.isArray(membershipsRes.data)
          ? membershipsRes.data
          : membershipsRes.data?.memberships || [];
        const rs: Reservation[] = Array.isArray(reservationsRes.data)
          ? (reservationsRes.data as Reservation[])
          : reservationsRes.data?.data || [];

        // Attach membership to users by userId (same pattern as members page)
        const usersWithMembership: User[] = rawUsers.map((u: any) => {
          const cm = ms.find((m) => m.userId === u.id);
          return cm ? { ...u, clubMembership: cm } : u;
        });

        setUsers(usersWithMembership as User[]);
        setMemberships(ms);
        setReservations(rs);
      })
      .catch(() => {
        if (cancelled) return;
        setError('Nem sikerült betölteni a statisztikához szükséges adatokat.');
        setUsers([]);
        setMemberships([]);
        setReservations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isAuthorized = useMemo(() => {
    if (!me) return false;
    // Az adminnak minden beengedői joga megvan, akkor is, ha nincs köri tagsága.
    if (me.role === Role.ADMIN) return true;
    if ((me as any)?.clubMembership) return true;
    return (memberships || []).some((m) => m.userId === me.id);
  }, [me, memberships]);

  const gatekeepingCounts = useMemo(() => {
    const eligibleUsers = users.filter((u) => (u as any)?.clubMembership?.isGateKeeper);

    // One admission == one hour-long block, so a 3-hour reservation counts as 3 admissions.
    // Counts are cumulative (all-time), per the spec's "eddigi beengedés".
    const counts = new Map<number, number>();
    reservations.forEach((r) => {
      const mid = (r as any).gateKeeperId as number | undefined;
      if (!mid) return;
      const durationMs = new Date((r as any).endTime).getTime() - new Date((r as any).startTime).getTime();
      const blocks = Math.round(durationMs / (1000 * 60 * 60));
      counts.set(mid, (counts.get(mid) || 0) + blocks);
    });

    return eligibleUsers.map((u) => {
      const mid = (u as any)?.clubMembership?.id as number | undefined;
      const count = mid ? counts.get(mid) || 0 : 0;
      return { id: u.id, fullName: u.fullName, count };
    });
  }, [users, reservations]);

  if (loading) {
    return (
      <div className='w-full'>
        <div className='p-8 text-center'>Betöltés…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full'>
        <div className='p-8 text-center text-red-500 font-bold'>{error}</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className='w-full'>
        <div className='p-8 text-center text-red-500 font-bold'>
          Access denied. You do not have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-col sm:flex-row gap-2 p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary text-center sm:text-left'>Beengedési statisztika</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='font-semibold'>Név</TableHead>
            <TableHead className='font-semibold'>Beengedések</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gatekeepingCounts.map((gk) => (
            <TableRow key={gk.id}>
              <TableCell className='font-medium'>{gk.fullName}</TableCell>
              <TableCell>{gk.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default withGatekeeperAuth(Stats);
