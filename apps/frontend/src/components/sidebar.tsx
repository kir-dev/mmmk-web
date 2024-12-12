import { BarChart3, CalendarPlus, Heart, KeyboardMusic, ListMusic, MicVocal, Radio } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Sidebar() {
  return (
    <div className='w-64 border-r border-zinc-800 p-4 flex flex-col'>
      <Link href='/' className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tighter'>MMMK</h1>
      </Link>

      <div className='space-y-4'>
        <div className='space-y-2'>
          <Button variant='ghost' className='w-full justify-start' asChild>
            <Link href='/'>
              <Radio className='mr-2 h-4 w-4' />
              Feed
            </Link>
          </Button>
          <Button variant='ghost' className='w-full justify-start' asChild>
            <Link href='/'>
              <ListMusic className='mr-2 h-4 w-4' />
              Bands
            </Link>
          </Button>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>About Us</h2>
          <div className='space-y-2'>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/'>
                <Heart className='mr-2 h-4 w-4' />
                MMMK
              </Link>
            </Button>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/'>
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
              <Link href='/'>
                <CalendarPlus className='mr-2 h-4 w-4' />
                New Reservations
              </Link>
            </Button>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/'>
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
              <Link href='/'>
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
