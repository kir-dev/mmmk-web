import MemberTile from '@/components/member/member-tile';
import { Card, CardContent } from '@/components/ui/card';
import { mockUsers } from '@/mocks/users';

export default function MMMK() {
  //TODO: get these from pek
  const groupLeader = mockUsers[0];
  const roomManager = mockUsers[1];
  const financeManager = mockUsers[2];

  return (
    <div className='w-full main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-row p-4 bg-background sticky top-0 z-10'>
        <h1 className='text-2xl font-semibold text-primary'>Muzsika Mívelő Mérnökök Klubja</h1>
      </div>
      <div className='mx-auto px-4 pb-8'>
        <h1 className='text-2xl font-semibold mt-8 mb-4'>Rólunk</h1>
        <Card>
          <CardContent>
            <p className='leading-relaxed pt-6'>
              Az MMMK lényegében egy zenekari próbatermet üzemeltető kollégium első emeletén, a 119-es teremben, ami fel
              van szerelve sok jó dologgal a gyakorláshoz. Vannak gitárerősítők, mikrofonok, és van dob. Előre megadott
              időpontokra lehet jelentkezni a honlapunkon, utána lehet menni próbálni - akár egyénileg akár egész
              zenekarral. Emellett a kör több zenés rendezvényt is szokott szervezni a kollégiumon belül, amiken az
              előzőeket kedvelő kollégisták kielégíthetik vágyaikat.
            </p>
          </CardContent>
        </Card>
        <h1 className='text-2xl font-semibold mt-8 mb-4'>Vezetőség</h1>
        <div className='grid grid-cols-3 gap-4'>
          <MemberTile user={groupLeader} showTitle showContact />
          <MemberTile user={roomManager} showTitle showContact />
          <MemberTile user={financeManager} showTitle showContact />
        </div>
        <h1 className='text-2xl font-semibold mt-8 mb-4'>Beengedők</h1>
        <div className='grid gap-4 py-4 auto-rows-fr grid-cols-[repeat(auto-fill,minmax(228px,228px))] justify-center'>
          {mockUsers
            .filter((user) => user.clubMembership?.isGateKeeper)
            .map((user) => (
              <MemberTile user={user} key={user.id} />
            ))}
        </div>
      </div>
    </div>
  );
}
