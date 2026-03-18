'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axiosApi from '@/lib/apiSetup';
import { Role, User } from '@/types/user';

type Props = {
  currentUserId: number;
};

export function UserRoleTable({ currentUserId }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const fetchUsers = async () => {
    try {
      const response = await axiosApi.get<{ users: User[] }>('/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (user: User) => {
    const newRole = user.role === Role.ADMIN ? Role.USER : Role.ADMIN;
    setPendingIds((prev) => new Set(prev).add(user.id));
    try {
      await axiosApi.patch(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
    } catch (error) {
      console.error(error);
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <p className='text-sm text-muted-foreground'>Felhasználók betöltése...</p>;
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Név</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Szerep</TableHead>
            <TableHead className='text-right'>Művelet</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const isPending = pendingIds.has(user.id);
            const isAdmin = user.role === Role.ADMIN;
            let buttonLabel = 'Admin adása';
            if (isPending) buttonLabel = 'Mentés...';
            else if (isAdmin) buttonLabel = 'Admin elvétele';
            return (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>{user.fullName}</TableCell>
                <TableCell className='text-muted-foreground'>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={isAdmin ? 'default' : 'secondary'}>{isAdmin ? 'Admin' : 'Felhasználó'}</Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    size='sm'
                    variant={isAdmin ? 'destructive' : 'outline'}
                    disabled={isSelf || isPending}
                    onClick={() => toggleRole(user)}
                  >
                    {buttonLabel}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
