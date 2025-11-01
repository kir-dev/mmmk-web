import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User } from '@/types/user';

function getRoleLabel(user: User) {
  if (user.role === 'ADMIN') return 'Admin';
  if (user.clubMembership?.isGateKeeper) return 'Beengedő';
  return 'Felhasználó';
}

function getRoleVariant(user: User) {
  if (user.role === 'ADMIN') return 'destructive';
  if (user.clubMembership?.isGateKeeper) return 'default';
  return 'secondary';
}

function getTitleLabel(title: string) {
  switch (title) {
    case 'GROUP_LEADER':
      return 'Főispán';
    case 'ROOM_MANAGER':
      return 'Teremispán';
    case 'FINANCE_MANAGER':
      return 'Kincstárnok';
    default:
      return 'Felhasználó';
  }
}

export default function MemberTile({
  user,
  showBadge = false,
  showContact = false,
  showTitle = false,
}: {
  user: User;
  showBadge?: boolean;
  showContact?: boolean;
  showTitle?: boolean;
}) {
  return (
    <div className='flex flex-col items-center'>
      <Card className='w-[228px] min-h-64 flex flex-col items-center justify-between p-4 pb-2 shadow-lg'>
        {showBadge && (
          <div className='flex justify-end w-full'>
            <Badge className='py-1 text-xs' variant={getRoleVariant(user)}>
              {getRoleLabel(user)}
            </Badge>
          </div>
        )}
        <div className='flex-1 flex flex-col justify-center items-center mt-2 mb-1'>
          <Avatar className='w-40 h-40'>
            <AvatarImage src='' alt={user.fullName} />
            <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div
          className='text-center font-semibold text-lg w-full px-2 break-words whitespace-normal'
          title={user.fullName}
        >
          {user.fullName}
        </div>
        {showTitle && (
          <div className='text-center font-semibold text-md truncate w-full pt-1'>
            {getTitleLabel(user.clubMembership.titles[0])}
          </div>
        )}
      </Card>
      {showContact && (
        <div className='flex flex-row justify-between mt-2 text-sm w-full max-w-60'>
          <div className='flex flex-col items-start ml-4'>
            <span>{user.email}</span>
            {user.phone && <span>{user.phone}</span>}
          </div>
          {user.roomNumber && (
            <div className='flex flex-col items-end mr-4'>
              <span>{user.roomNumber}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
