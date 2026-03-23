import { LogOut, Pencil, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import BandFormDialog from '@/components/band/band-form-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import getUser from '@/hooks/getUser';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { Band, BandMembership } from '@/types/band';

export default function BandRow({ band, knownGenres }: { band: Band; knownGenres?: string[] }) {
  const { user } = useUser();
  const [memberInfos, setMemberInfos] = useState<{ id?: number; name: string }[]>([]);
  const isMember = useMemo(() => {
    if (!user) return false;
    const m = (band.members || []) as BandMembership[];
    return m.some((bm) => bm.userId === user.id && bm.status === 'ACCEPTED');
  }, [user, band.members]);

  const isPending = useMemo(() => {
    if (!user) return false;
    const m = (band.members || []) as BandMembership[];
    return m.some((bm) => bm.userId === user.id && bm.status === 'PENDING');
  }, [user, band.members]);

  const [editOpen, setEditOpen] = useState(false);
  // edit form is handled by BandFormDialog

  const [users, setUsers] = useState<{ id: number; fullName: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    axiosApi.get('/users').then((res) => {
      const arr = Array.isArray(res.data) ? res.data : res.data.users;
      setUsers(arr || []);
    });
  }, []);

  useEffect(() => {
    const members = band.members;
    if (!members || members.length === 0) {
      setMemberInfos([]);
      return;
    }

    if (typeof (members as any)[0] === 'string') {
      setMemberInfos((members as unknown as string[]).map((name) => ({ name })));
      return;
    }

    let cancelled = false;
    const memberships = members as BandMembership[];
    const userIds = memberships
      .filter((m) => m.status === 'ACCEPTED')
      .map((m) => m.userId)
      .filter((id): id is number => typeof id === 'number');
    Promise.all(
      userIds.map((id) =>
        getUser(id)
          .then((u) => ({ id, name: u.fullName }))
          .catch(() => undefined)
      )
    )
      .then((infos) => infos.filter((info): info is { id: number; name: string } => Boolean(info)))
      .then((infos) => {
        if (!cancelled) setMemberInfos(infos);
      });

    return () => {
      cancelled = true;
    };
  }, [band.members]);

  return (
    <Collapsible key={band.id} asChild>
      <TableBody className='border-b'>
        <TableRow className='border-0'>
          <TableCell colSpan={4}>
            <div className='flex items-center gap-2'>
              <strong className='text-xl'>{band.name}</strong>
              {!band.isApproved && (
                <Badge variant='outline' className='ml-2 text-destructive border-destructive'>
                  Jóváhagyásra vár
                </Badge>
              )}
            </div>
            <h1>{band.genres?.join(' ')}</h1>
          </TableCell>
          <TableCell>{band.webPage}</TableCell>
          <TableCell>
            <a href={`mailto:${band.email}`}>{band.email}</a>
          </TableCell>
          <TableCell>
            {band.members?.filter((m: any) => typeof m === 'string' || m.status === 'ACCEPTED').length || 0} tag
          </TableCell>
          <TableCell>
            <CollapsibleTrigger asChild className='data-[state=open]:rotate-90 transition-all duration-300'>
              <Button size='icon' variant='ghost'>
                <Play className='h-4 w-4' />
              </Button>
            </CollapsibleTrigger>
          </TableCell>
        </TableRow>
        <TableRow className='border-0'>
          <CollapsibleContent asChild>
            <TableCell colSpan={7}>
              <div className='flex flex-col md:flex-row justify-between items-start px-4 gap-4'>
                <div className='order-1 flex-1 md:pr-4 break-words w-full'>{band.description}</div>
                <div className='order-2 flex-1 md:pr-4 w-full'>
                  <strong>Tagok: </strong>
                  <div className='mt-1 flex flex-wrap gap-2'>
                    {memberInfos.map((m, i) => (
                      <Badge key={m.id ?? i} variant='secondary' className='flex items-center gap-1'>
                        {m.name}
                        {user?.role === 'ADMIN' && m.id && (
                          <span
                            className='cursor-pointer text-destructive hover:text-red-700 ml-1 font-bold'
                            onClick={() =>
                              axiosApi.delete(`/bands/${band.id}/members/${m.id}`).then(() => window.location.reload())
                            }
                          >
                            ×
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className='order-3 md:ml-auto flex flex-row items-center gap-2 shrink-0 flex-wrap w-full md:w-auto'>
                  {isPending && (
                    <div className='flex gap-2 mb-4 w-full bg-accent p-3 rounded-md items-center justify-between'>
                      <span className='text-sm font-semibold'>Meghívásod van ebbe a zenekarba!</span>
                      <div className='flex gap-2'>
                        <Button
                          size='sm'
                          className='bg-green-600 hover:bg-green-700'
                          onClick={() =>
                            axiosApi.patch(`/bands/${band.id}/members/${user?.id}`).then(() => window.location.reload())
                          }
                        >
                          Elfogadás
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() =>
                            axiosApi
                              .delete(`/bands/${band.id}/members/${user?.id}`)
                              .then(() => window.location.reload())
                          }
                        >
                          Elutasítás
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Approve button for admins */}
                  {user?.role === 'ADMIN' && !band.isApproved && (
                    <Button
                      size='sm'
                      className='bg-green-600 hover:bg-green-700'
                      onClick={() => {
                        axiosApi.patch(`/bands/${band.id}`, { isApproved: true }).then(() => window.location.reload());
                      }}
                    >
                      Elfogadás
                    </Button>
                  )}
                  {/* Join button removed intentionally */}
                  {(isMember || user?.role === 'ADMIN') && user && (
                    <>
                      <div>
                        <BandFormDialog
                          mode='edit'
                          band={band}
                          open={editOpen}
                          onOpenChange={setEditOpen}
                          onSuccess={() => window.location.reload()}
                          knownGenres={knownGenres}
                          trigger={
                            <Button size='sm' variant='secondary'>
                              <Pencil />
                            </Button>
                          }
                        />
                      </div>
                      <div>
                        {isMember && (
                          <Button
                            size='sm'
                            variant='destructive'
                            onClick={() =>
                              axiosApi
                                .delete(`/bands/${band.id}/members/${user.id}`)
                                .then(() => window.location.reload())
                            }
                          >
                            <LogOut />
                          </Button>
                        )}
                      </div>
                      <div>
                        <Dialog
                          open={addOpen}
                          onOpenChange={(o) => {
                            setAddOpen(o);
                            if (!o) setSelectedUserId('');
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size='sm'>Tag meghívása</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Tag meghívása</DialogTitle>
                            </DialogHeader>
                            <div className='flex flex-col gap-3'>
                              <select
                                className='h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground'
                                value={selectedUserId === '' ? '' : String(selectedUserId)}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSelectedUserId(val ? Number(val) : '');
                                }}
                              >
                                <option value=''>Válassz felhasználót…</option>
                                {users
                                  .filter(
                                    (u) => !((band.members || []) as BandMembership[]).some((m) => m.userId === u.id)
                                  )
                                  .map((u) => (
                                    <option key={u.id} value={u.id}>
                                      {u.fullName}
                                    </option>
                                  ))}
                              </select>
                              <div className='flex justify-end gap-2'>
                                <Button variant='ghost' onClick={() => setAddOpen(false)}>
                                  Mégse
                                </Button>
                                <Button
                                  onClick={() => {
                                    if (selectedUserId === '') return;
                                    axiosApi
                                      .post(`/bands/${band.id}/members/${selectedUserId}`)
                                      .then(() => window.location.reload())
                                      .catch((e) => {
                                        if (e?.response?.status === 409) window.location.reload();
                                      });
                                  }}
                                  disabled={selectedUserId === ''}
                                >
                                  Meghívás
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TableCell>
          </CollapsibleContent>
        </TableRow>
      </TableBody>
    </Collapsible>
  );
}
