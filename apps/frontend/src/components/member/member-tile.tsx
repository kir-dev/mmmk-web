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

function getTitleLabelForUser(user: User) {
  const titles = user.clubMembership?.titles || [];

  // Support both internal codes and PEK/HU titles
  const has = (needle: string) => titles.some((t) => t.toLowerCase() === needle.toLowerCase());

  if (has('körvezető')) return 'Főispán';
  if (has('teremmester')) return 'Teremispán';
  if (has('gazdaságis')) return 'Kincstárnok';
  if (user.clubMembership?.isGateKeeper || has('beengedő')) return 'Beengedő';
  return 'Felhasználó';
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
    <div className='flex flex-col items-center w-full py-2'>
      <Card className='w-full max-w-[228px] min-h-64 flex flex-col items-center justify-between p-4 pb-2 shadow-lg'>
        {showBadge && (
          <div className='flex justify-end w-full'>
            <Badge className='py-1 text-xs' variant={getRoleVariant(user)}>
              {getRoleLabel(user)}
            </Badge>
          </div>
        )}
        <div className='flex-1 flex flex-col justify-center items-center mt-2 mb-1'>
          <Avatar className='w-28 h-28 sm:w-40 sm:h-40'>
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
          <div className='text-center font-semibold text-md truncate w-full pt-1'>{getTitleLabelForUser(user)}</div>
        )}
      </Card>
      {showContact && (
        <div className='flex flex-row justify-between mt-2 text-sm w-full max-w-[228px] px-2'>
          <div className='flex flex-col items-start'>
            <span className='break-words'>{user.email}</span>
            {user.phone && <span>{user.phone}</span>}
          </div>
          {user.roomNumber && (
            <div className='flex flex-col items-end'>
              <span>{user.roomNumber}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
