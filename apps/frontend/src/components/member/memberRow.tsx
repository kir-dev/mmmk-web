import { Collapsible } from '@components/ui/collapsible';
import { TableCell, TableRow } from '@components/ui/table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/user';

export default function MemberRow({ user }: { user: User }) {
  return (
    <Collapsible key={user.id} asChild>
      <TableRow className='border-0'>
        <TableCell>
          <Card>
            <div className='flex justify-between'>
              <div>
                <CardHeader>
                  <div className='col-span-full'>
                    <div>
                      <CardTitle className='text-xl'>{user?.name}</CardTitle>
                      <dd className='text-muted-foreground flex flex-wrap gap-2'>
                        <p>{user?.email}</p>
                        <p>{user?.phone}</p>
                      </dd>
                      <p className='text-muted-foreground'>{user?.roomNumber}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='col-span-full'>
                    <dd className='flex flex-wrap gap-2'>
                      {user.role === 'ADMIN' && <Badge variant='destructive'>Admin</Badge>}
                      <Badge variant={user?.role === 'ADMIN' || user?.role === 'GATEKEEPER' ? 'default' : 'secondary'}>
                        {user?.role === 'ADMIN' || user?.role === 'GATEKEEPER' ? 'Beengedő' : 'Felhasználó'}
                      </Badge>
                      <Badge variant={user?.isDormResident ? 'default' : 'secondary'}>
                        {user?.isDormResident ? 'Kolis' : 'Nem kolis'}
                      </Badge>
                    </dd>
                  </div>
                </CardContent>
              </div>
              <div className='col-span-full flex items-center mr-5'>
                <Avatar className='w-24 h-24'>
                  <AvatarImage src='' alt={user?.name} />
                  <AvatarFallback>
                    {user?.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </Card>
        </TableCell>
      </TableRow>
    </Collapsible>
  );
}
