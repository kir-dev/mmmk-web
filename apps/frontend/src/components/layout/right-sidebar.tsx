import { mockUsers } from '@/mocks/users';

export function RightSidebar() {
  const gatekeepers = mockUsers.filter((user) => user.clubMembership?.isGateKeeper);

  return (
    <div className='w-full p-4 ml-auto overflow-y-auto'>
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold'>Aktuális beengedők</h2>
        </div>
        {gatekeepers.length === 0 ? (
          <p className='text-sm text-muted-foreground'>Jelenleg nincs beengedő</p>
        ) : (
          <ul className='space-y-2'>
            {gatekeepers.map((user) => (
              <li key={user.id} className='text-sm'>
                <div className='font-medium'>{user.fullName}</div>
                <div className='text-muted-foreground'>
                  {user.email}
                  {user.phone ? ` · ${user.phone}` : ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
