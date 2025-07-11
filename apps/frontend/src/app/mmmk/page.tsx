import MemberTile from '@/components/member/member-tile';
import { Card, CardContent } from '@/components/ui/card';
import { mockUsers } from '@/mocks/users';

export default function MMMK() {
  //TODO: get these from pek
  const groupLeader = mockUsers[0];
  const roomManager = mockUsers[1];
  const financeManager = mockUsers[2];

  return (
    <div className='w-full overflow-y-auto'>
      <div className='flex items-center justify-between flex-row p-4'>
        <h1 className='text-2xl font-semibold text-primary'>Muzsika Mívelő Mérnökök Klubja</h1>
      </div>
      <Card className='m-4'>
        <CardContent>
          <h1 className='text-2xl font-semibold mt-8 mb-4'>Rólunk</h1>
          <p className='mb-4'>
            Az MMMK lényegében egy zenekari próbatermet üzemeltet a kollégium első emeletén, a 119-es teremben, ami fel
            van szerelve sok jó dologgal a gyakorláshoz. Vannak gitárerősítők, mikrofonok, és van dob. Előre megadott
            időpontokra lehet jelentkezni a honlapunkon, utána lehet menni próbálni - akár egyénileg akár egész
            zenekarral. Emellett a kör több zenés rendezvényt is szokott szervezni a kollégiumon belül, amiken az
            élőzenét kedvelő kollégisták kielégíthetik vágyaikat.
          </p>
          <h1 className='text-2xl font-semibold mt-8 mb-4'>Vezetőség</h1>
          <div className='grid grid-cols-3 gap-4'>
            <MemberTile user={groupLeader} />
            <MemberTile user={roomManager} />
            <MemberTile user={financeManager} />
          </div>
          <h1 className='text-2xl font-semibold mt-8 mb-4'>Beengedők</h1>
          <div className='grid grid-cols-3 gap-4'>
            {mockUsers
              .filter((user) => user.role === 'GATEKEEPER')
              .map((user) => (
                <MemberTile user={user} key={user.id} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
