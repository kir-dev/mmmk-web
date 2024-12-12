import { BarChart3, CalendarPlus, Heart, KeyboardMusic, ListMusic, MicVocal, Radio } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Sidebar() {
  return (
    <div className='w-64 p-4 flex flex-col'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Button variant='ghost' className='w-full justify-start' asChild>
            <Link href='/apps/frontend/public'>
              <Radio className='mr-2 h-4 w-4' />
              Feed
            </Link>
          </Button>
          <Button variant='ghost' className='w-full justify-start' asChild>
            <Link href='/apps/frontend/public'>
              <ListMusic className='mr-2 h-4 w-4' />
              Bands
            </Link>
          </Button>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>About Us</h2>
          <div className='space-y-2'>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/apps/frontend/public'>
                <Heart className='mr-2 h-4 w-4' />
                MMMK
              </Link>
            </Button>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/apps/frontend/public'>
                <MicVocal className='mr-2 h-4 w-4' />
                The Room
              </Link>
            </Button>
          </div>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>For Members</h2>
          <div className='space-y-2'>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/apps/frontend/public'>
                <CalendarPlus className='mr-2 h-4 w-4' />
                New Reservations
              </Link>
            </Button>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/apps/frontend/public'>
                <BarChart3 className='mr-2 h-4 w-4' />
                Statistics
              </Link>
            </Button>
          </div>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>Admin</h2>
          <div className='space-y-2'>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/apps/frontend/public'>
                <KeyboardMusic className='mr-2 h-4 w-4' />
                Super View
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Button className='mt-auto' variant='outline'>
        Make new Reservation
      </Button>
    </div>
  );
}
