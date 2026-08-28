'use client';

import Calendar from '@components/calendar/calendar';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { withGatekeeperAuth } from '@/utils/withAuth';

function AdmissionPage() {
  const router = useRouter();

  return (
    <div className='w-full flex flex-col gap-4 main-content-scroll h-full'>
      <div className='flex items-center justify-between flex-col sm:flex-row gap-2 p-4 bg-background sticky top-0 z-10'>
        <div>
          <h1 className='text-2xl font-semibold text-primary text-center sm:text-left'>Beengedés</h1>
          <p className='text-sm text-muted-foreground text-center sm:text-left'>
            Válaszd ki a naptárból azt a foglalást, amelyikhez beengedőnek jelentkezel.
          </p>
        </div>
        <div className='flex gap-2 w-full sm:w-auto flex-col sm:flex-row'>
          <Button variant='outline' onClick={() => router.push('/my-gatekeeps')}>
            Beengedéseim
          </Button>
          <Button variant='outline' onClick={() => router.push('/stats')}>
            Statisztika
          </Button>
        </div>
      </div>
      <Calendar />
    </div>
  );
}

export default withGatekeeperAuth(AdmissionPage);
