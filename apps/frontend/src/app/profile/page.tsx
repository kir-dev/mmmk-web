'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { withAuth } from '@/utils/withAuth';

type SanctionRecordWithDetails = {
  id: number;
  userId?: number;
  bandId?: number;
  points: number;
  reason: string;
  awardedBy: number;
  awardedAt: string;
  type: 'user' | 'band';
  bandName?: string;
  gateKeeper?: {
    user?: {
      fullName: string;
    };
  };
};

type SanctionData = {
  userSanctions: SanctionRecordWithDetails[];
  bandSanctions: SanctionRecordWithDetails[];
  allSanctions: SanctionRecordWithDetails[];
  totalUserPoints: number;
  totalBandPoints: number;
};

function ProfilePage() {
  const { user } = useUser();
  const [sanctionData, setSanctionData] = useState<SanctionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSanctions = async () => {
      try {
        setLoading(true);
        const res = await axiosApi.get<SanctionData>('/sanction-records/me');
        setSanctionData(res.data);
      } catch (err) {
        console.error('Error fetching sanctions:', err);
        setError('Nem sikerült betölteni a szankciós előzményeket');
      } finally {
        setLoading(false);
      }
    };

    fetchSanctions();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('hu-HU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='w-full p-8'>
        <h1 className='text-2xl font-semibold text-primary mb-6'>Profilom</h1>
        <p className='text-center'>Betöltés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full p-8'>
        <h1 className='text-2xl font-semibold text-primary mb-6'>Profilom</h1>
        <p className='text-center text-red-500'>{error}</p>
      </div>
    );
  }

  const totalPoints = (sanctionData?.totalUserPoints || 0) + (sanctionData?.totalBandPoints || 0);

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-col sm:flex-row gap-2 p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary text-center sm:text-left'>Profilom</h1>
      </div>

      <div className='p-4 space-y-6 max-w-4xl mx-auto'>
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>{user?.fullName}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-primary/10 rounded-lg'>
                <p className='text-3xl font-bold text-primary'>{sanctionData?.totalUserPoints || 0}</p>
                <p className='text-sm text-muted-foreground'>Saját szankciós pont</p>
              </div>
              <div className='text-center p-4 bg-primary/10 rounded-lg'>
                <p className='text-3xl font-bold text-primary'>{sanctionData?.totalBandPoints || 0}</p>
                <p className='text-sm text-muted-foreground'>Banda szankciós pont</p>
              </div>
              <div className='text-center p-4 bg-secondary rounded-lg'>
                <p className='text-3xl font-bold text-secondary-foreground'>{totalPoints}</p>
                <p className='text-sm text-muted-foreground'>Összes pont</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sanction History */}
        <Card>
          <CardHeader>
            <CardTitle>Szankciós előzmények</CardTitle>
            <CardDescription>A kapott szankciós pontok és indoklásaik</CardDescription>
          </CardHeader>
          <CardContent>
            {sanctionData?.allSanctions.length === 0 ? (
              <p className='text-center text-muted-foreground py-4'>Nincs szankciós előzmény</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dátum</TableHead>
                    <TableHead>Típus</TableHead>
                    <TableHead className='text-center'>Pont</TableHead>
                    <TableHead>Indoklás</TableHead>
                    <TableHead>Beengedő</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sanctionData?.allSanctions.map((sanction) => (
                    <TableRow key={sanction.id}>
                      <TableCell className='whitespace-nowrap'>{formatDate(sanction.awardedAt)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded ${
                            sanction.type === 'user'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          {sanction.type === 'user' ? 'Saját' : sanction.bandName || 'Banda'}
                        </span>
                      </TableCell>
                      <TableCell className='text-center font-semibold'>{sanction.points}</TableCell>
                      <TableCell>{sanction.reason}</TableCell>
                      <TableCell>{sanction.gateKeeper?.user?.fullName || 'Ismeretlen'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
