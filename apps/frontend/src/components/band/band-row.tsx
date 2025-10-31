import { LogOut, Pencil, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { TextArea } from '@/components/ui/textarea';
import getUser from '@/hooks/getUser';
import { useUser } from '@/hooks/useUser';
import axiosApi from '@/lib/apiSetup';
import { Band, BandMembership } from '@/types/band';

export default function BandRow({ band }: { band: Band }) {
  const { user } = useUser();
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const isMember = useMemo(() => {
    if (!user) return false;
    const m = (band.members || []) as BandMembership[];
    return m.some((bm) => bm.userId === user.id);
  }, [user, band.members]);

  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(band.name || '');
  const [email, setEmail] = useState(band.email || '');
  const [webPage, setWebPage] = useState(band.webPage || '');
  const [description, setDescription] = useState(band.description || '');
  const [genresInput, setGenresInput] = useState((band.genres || []).join(', '));

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
      setMemberNames([]);
      return;
    }

    if (typeof (members as any)[0] === 'string') {
      setMemberNames(members as unknown as string[]);
      return;
    }

    let cancelled = false;
    const memberships = members as BandMembership[];
    const userIds = memberships.map((m) => m.userId).filter((id): id is number => typeof id === 'number');
    Promise.all(
      userIds.map((id) =>
        getUser(id)
          .then((u) => u.fullName)
          .catch(() => undefined)
      )
    )
      .then((names) => names.filter((n): n is string => Boolean(n)))
      .then((names) => {
        if (!cancelled) setMemberNames(names);
      });

    return () => {
      cancelled = true;
    };
  }, [band.members]);

  return (
    <Collapsible key={band.id} asChild>
      <>
        <TableRow className='border-0'>
          <TableCell colSpan={4}>
            <div>
              <strong className='text-xl'>{band.name}</strong>
              <h1>{band.genres?.join(' ')}</h1>
            </div>
          </TableCell>
          <TableCell>{band.webPage}</TableCell>
          <TableCell>
            <a href={`mailto:${band.email}`}>{band.email}</a>
          </TableCell>
          <TableCell>{band.members?.length || 0} tag</TableCell>
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
              <div className='flex flex-row justify-between items-start px-4 gap-4'>
                <div className='order-1 flex-1 pr-4 break-words'>{band.description}</div>
                <div className='order-2 flex-1 pr-4'>
                  <strong>Tagok: </strong>
                  {memberNames.join(', ')}
                </div>
                <div className='order-3 ml-auto flex flex-row items-center gap-2 shrink-0 flex-wrap'>
                  {!isMember && user && (
                    <Button
                      size='sm'
                      onClick={() =>
                        axiosApi.post(`/bands/${band.id}/members/${user.id}`).then(() => window.location.reload())
                      }
                    >
                      Csatlakozás
                    </Button>
                  )}
                  {isMember && user && (
                    <>
                      <div>
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                          <DialogTrigger asChild>
                            <Button size='sm' variant='secondary'>
                              <Pencil />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Zenekar szerkesztése</DialogTitle>
                            </DialogHeader>
                            <div className='flex flex-col gap-3'>
                              <Input placeholder='Nev' value={name} onChange={(e) => setName(e.target.value)} />
                              <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                              <Input
                                placeholder='Weboldal'
                                value={webPage}
                                onChange={(e) => setWebPage(e.target.value)}
                              />
                              <TextArea
                                placeholder='Leirás'
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                              <Input
                                placeholder='Műfajok (vesszővel elvalásztva)'
                                value={genresInput}
                                onChange={(e) => setGenresInput(e.target.value)}
                              />
                              <div className='flex justify-end gap-2 mt-2'>
                                <Button variant='ghost' onClick={() => setEditOpen(false)}>
                                  Megse
                                </Button>
                                <Button
                                  onClick={() => {
                                    const genres = genresInput
                                      .split(',')
                                      .map((g) => g.trim())
                                      .filter((g) => g.length > 0);
                                    axiosApi
                                      .patch(`/bands/${band.id}`, { name, email, webPage, description, genres })
                                      .then(() => window.location.reload());
                                  }}
                                >
                                  Mentes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() =>
                            axiosApi.delete(`/bands/${band.id}/members/${user.id}`).then(() => window.location.reload())
                          }
                        >
                          <LogOut />
                        </Button>
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
                            <Button size='sm'>Tag hozzáadása</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Tag hozzáadása</DialogTitle>
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
                                      .then(() => window.location.reload());
                                  }}
                                  disabled={selectedUserId === ''}
                                >
                                  Hozzáadás
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
      </>
    </Collapsible>
  );
}
