'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosApi from '@/lib/apiSetup';
import { SanctionRecord } from '@/types/sanction-record';
import { User } from '@/types/user';

export default function ProfilePageComponent() {
  const [user, setUser] = useState<User>();
  const [sanctions, setSanctions] = useState<SanctionRecord[]>([]);
  const params = useParams();
  const userId = params?.id as string;

  const getUser = async () => {
    if (!userId) return;
    axiosApi.get<User>(`/users/${userId}`).then((res) => {
      setUser(res.data);
    });
    axiosApi.get<SanctionRecord[]>(`/sanction-records/user/${userId}`).then((res) => {
      setSanctions(res.data);
    });
  };

  useEffect(() => {
    if (userId) getUser();
  }, [userId]);

  return (
    <div className='container mx-auto p-4'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader className='flex flex-row items-center gap-4'>
          <Avatar className='w-20 h-20 items-center justify-center text-5xl font-bold'>
            <AvatarImage src='' alt={user?.fullName} />
            <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className='text-2xl'>{user?.fullName}</CardTitle>
            <p className='text-muted-foreground'>{user?.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div>
              <dt className='font-medium text-muted-foreground'>Phone Number</dt>
              <dd>{user?.phone}</dd>
            </div>
            <div>
              <dt className='font-medium text-muted-foreground'>Room Number</dt>
              <dd>{user?.roomNumber}</dd>
            </div>
            <div className='col-span-full'>
              <dd className='flex flex-wrap gap-2'>
                <Badge variant={user?.isDormResident ? 'default' : 'secondary'}>
                  {user?.isDormResident ? 'Kolis' : 'Nem kolis'}
                </Badge>
                <Badge variant={user?.role === 'ADMIN' || user?.clubMembership?.isGateKeeper ? 'default' : 'secondary'}>
                  {user?.role === 'ADMIN' || user?.clubMembership?.isGateKeeper ? 'Beengedő' : 'Felhasználó'}
                </Badge>
              </dd>
            </div>
          </dl>
          {sanctions.length > 0 && (
            <div className='mt-6'>
              <h3 className='text-lg font-semibold mb-2'>Szankciós előzmények</h3>
              <div className='space-y-2'>
                {sanctions.map((sanction) => (
                  <div key={sanction.id} className='p-3 bg-muted rounded-md text-sm'>
                    <p className='font-medium'>{sanction.points} pont</p>
                    <p className='text-muted-foreground'>{sanction.reason}</p>
                    <p className='text-xs text-muted-foreground'>
                      Dátum: {new Date(sanction.awardedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
