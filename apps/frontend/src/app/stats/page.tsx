import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockGatekeepings } from '@/mocks/gatekeepings';
import { mockUsers } from '@/mocks/users';
import { User } from '@/types/user';

const currentUser: User = mockUsers[1]; //TODO: replace with real user
const data = mockGatekeepings; //TODO: replace with real data

function isAuthorized(user: User) {
  return user.clubMembership.isGateKeeper || user.role === 'ADMIN';
}

function getCurrentPeriodStart() {
  //TODO: replace with real period
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export default function Stats() {
  if (!isAuthorized(currentUser)) {
    return (
      <div className='w-full'>
        <div className='p-8 text-center text-red-500 font-bold'>
          Access denied. You do not have permission to view this page.
        </div>
      </div>
    );
  }

  const periodStart = getCurrentPeriodStart();
  const gatekeepers = mockUsers.filter((u) => u.clubMembership.isGateKeeper || u.role === 'ADMIN');

  const gatekeepingCounts = gatekeepers.map((gk) => {
    const count = data.filter((gkEvent) => gkEvent.userId === gk.id && new Date(gkEvent.date) >= periodStart).length;
    return { ...gk, count };
  });

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between flex-row p-4'>
        <h1 className='text-2xl font-semibold text-primary'>Beengedési statisztika</h1>
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
