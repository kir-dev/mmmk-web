import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { User } from '@/types/user';

function getRoleLabel(role: string) {
  switch (role) {
    case 'ADMIN':
      return 'Admin';
    case 'GATEKEEPER':
      return 'Beengedő';
    default:
      return 'Felhasználó';
  }
}

function getRoleVariant(role: string) {
  switch (role) {
    case 'ADMIN':
      return 'destructive';
    case 'GATEKEEPER':
      return 'default';
    default:
      return 'secondary';
  }
}

export default function MemberTile({ user }: { user: User }) {
  return (
    <div className='flex flex-col items-center'>
      <Card className='w-full max-w-56 h-64 flex flex-col items-center justify-between p-4 pb-2 shadow-lg'>
        <div className='flex justify-end w-full'>
          <Badge className='py-1 text-xs' variant={getRoleVariant(user.role)}>
            {getRoleLabel(user.role)}
          </Badge>
        </div>
        <div className='flex-1 flex flex-col justify-center items-center mt-2 mb-1'>
          <Avatar className='w-40 h-40'>
            <AvatarImage src={typeof user.profilePicture === 'string' ? user.profilePicture : ''} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='text-left font-semibold text-lg truncate w-full'>{user.name}</div>
      </Card>
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
    </div>
  );
}
