'use client';

import Calendar from '@components/calendar/calendar';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function ReservationPage() {
  const router = useRouter();

  return (
    <div className='w-full flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='font-bold text-orange-600 text-3xl'>Foglalások</h1>
        <Button variant='outline' onClick={() => router.push('/my-reservations')}>
          Beengedéseim
        </Button>
      </div>
      <Calendar />
    </div>
  );
}
