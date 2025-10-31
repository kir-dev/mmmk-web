'use client';

import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/user';

const url = 'http://localhost:3030/users/';

export default function ProfilePageComponent() {
  const [user, setUser] = useState<User>();
  const userId = useParams().id;
  const finalURL = url + userId;

  const getUser = async () => {
    axios.get<User>(finalURL).then((res) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <Card className='max-w-2xl mx-auto'>
        <CardHeader className='flex flex-row items-center gap-4'>
          <Avatar className='w-20 h-20 items-center justify-center text-5xl font-bold'>
            <AvatarImage src='' alt={user?.fullName} />
            <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
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
                <Badge variant={user?.role === 'ADMIN' || user?.clubMembership.isGateKeeper ? 'default' : 'secondary'}>
                  {user?.role === 'ADMIN' || user?.clubMembership.isGateKeeper ? 'Beengedő' : 'Felhasználó'}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
