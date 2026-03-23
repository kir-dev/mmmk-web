'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { ClubMembership } from '@/types/member';
import { Reservation } from '@/types/reservation';
import { withGatekeeperAuth } from '@/utils/withAuth';

function MyGatekeepsPage() {
  const { user } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sanctionInputs, setSanctionInputs] = useState<{ [key: number]: string }>({});
  const [sanctionReasons, setSanctionReasons] = useState<{ [key: number]: string }>({});
  const [updatingReservation, setUpdatingReservation] = useState<number | null>(null);
  const [myGatekeeperId, setMyGatekeeperId] = useState<number | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosApi.get('/reservations', { params: { page: -1, page_size: -1 } });
      const allReservations = res.data.data as Reservation[];

      const gateKeeperQuery = await axiosApi.get('/memberships');
      // Memberships endpoint returns a plain array directly
      const memberships = gateKeeperQuery.data || [];
      const myGatekeeper = memberships.find((membership: ClubMembership) => membership.userId === user?.id);
      setMyGatekeeperId(myGatekeeper?.id || null);


      // Filter for reservations where current user is the gatekeeper
      const gateKeeperReservations = allReservations.filter((reservation) => {
        const matches =
          reservation.gateKeeperId === myGatekeeper?.id;
        return matches;
      });

      setReservations(gateKeeperReservations);
    } catch (err) {
      setError('Nem sikerült betölteni a beengedéseket');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleSanctionInputChange = (reservationId: number, value: string) => {
    setSanctionInputs((prev) => ({ ...prev, [reservationId]: value }));
  };

  const handleReasonChange = (reservationId: number, value: string) => {
    setSanctionReasons((prev) => ({ ...prev, [reservationId]: value }));
  };

  const handleAwardSanctionPoints = async (reservation: Reservation) => {
    const inputValue = sanctionInputs[reservation.id] || '';
    const pointsToAdd = parseInt(inputValue, 10);
    const reason = sanctionReasons[reservation.id] || '';

    if (isNaN(pointsToAdd) || pointsToAdd <= 0) {
      toast.error('Kérlek adj meg egy pozitív egész számot!');
      return;
    }

    if (!reason.trim()) {
      toast.error('Kérlek add meg az indoklást!');
      return;
    }

    if (!myGatekeeperId) {
      toast.error('Nem található a beengedő azonosító');
      return;
    }

    // Determine if this is a user or band sanction
    const isUserReservation = Boolean(reservation.user?.id);
    const isBandReservation = Boolean(reservation.band?.id);

    if (!isUserReservation && !isBandReservation) {
      toast.error('Nem található felhasználó vagy banda a foglaláshoz');
      return;
    }

    try {
      setUpdatingReservation(reservation.id);

      // Use the new sanction-records API
      await axiosApi.post('/sanction-records', {
        userId: isUserReservation ? reservation.user?.id : undefined,
        bandId: isBandReservation ? reservation.band?.id : undefined,
        points: pointsToAdd,
        reason: reason,
        awardedBy: myGatekeeperId,
      });

      // Clear inputs and refresh reservations
      setSanctionInputs((prev) => ({ ...prev, [reservation.id]: '' }));
      setSanctionReasons((prev) => ({ ...prev, [reservation.id]: '' }));
      await fetchReservations();

      const targetName = isUserReservation ? reservation.user?.fullName : reservation.band?.name;
      toast.success(`Sikeresen ${pointsToAdd} szankciós pontot adtál ${targetName} számára!`);
    } catch (err) {
      console.error('Error awarding sanction points:', err);
      toast.error('Hiba történt a szankciós pontok hozzáadása során');
    } finally {
      setUpdatingReservation(null);
    }
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      NORMAL: 'Normál',
      OVERTIME: 'Túlóra',
      ADMINMADE: 'Admin által létrehozva',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className='w-full p-8'>
        <h1 className='text-2xl font-semibold text-primary mb-6'>Beengedéseim</h1>
        <p className='text-center'>Betöltés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full p-8'>
        <h1 className='text-2xl font-semibold text-primary mb-6'>Beengedéseim</h1>
        <p className='text-center text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-col sm:flex-row gap-2 p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary text-center sm:text-left'>Beengedéseim</h1>
      </div>

      <div className='p-4'>
        {reservations.length === 0 ? (
          <p className='text-center text-muted-foreground'>Nem található beengedésed</p>
        ) : (
          <div className='flex flex-col gap-4 max-w-4xl mx-auto'>
            {reservations.map((reservation) => {
              const reserverName = reservation.user?.fullName || reservation.band?.name || 'Ismeretlen';

              return (
                <Card key={reservation.id}>
                  <CardHeader>
                    <CardTitle className='text-lg'>{reserverName}</CardTitle>
                    <CardDescription>
                      <span className='inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary'>
                        {getStatusLabel(reservation.status)}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className='space-y-2'>
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>Kezdés:</p>
                      <p className='text-sm'>{formatDateTime(reservation.startTime)}</p>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>Befejezés:</p>
                      <p className='text-sm'>{formatDateTime(reservation.endTime)}</p>
                    </div>
                  </CardContent>

                  <CardFooter className='flex-col gap-3'>
                    <div className='flex w-full gap-2'>
                      <input
                        type='number'
                        min='1'
                        placeholder='Pontok száma'
                        value={sanctionInputs[reservation.id] || ''}
                        onChange={(e) => handleSanctionInputChange(reservation.id, e.target.value)}
                        className='w-32 px-3 py-2 text-sm border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800'
                        disabled={updatingReservation === reservation.id}
                      />
                      <input
                        type='text'
                        placeholder='Indoklás'
                        value={sanctionReasons[reservation.id] || ''}
                        onChange={(e) => handleReasonChange(reservation.id, e.target.value)}
                        className='flex-1 px-3 py-2 text-sm border border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800'
                        disabled={updatingReservation === reservation.id}
                      />
                      <Button
                        onClick={() => handleAwardSanctionPoints(reservation)}
                        disabled={
                          updatingReservation === reservation.id ||
                          !sanctionInputs[reservation.id] ||
                          !sanctionReasons[reservation.id]?.trim()
                        }
                        size='sm'
                      >
                        {updatingReservation === reservation.id ? 'Folyamatban...' : 'Pont adása'}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default withGatekeeperAuth(MyGatekeepsPage);
