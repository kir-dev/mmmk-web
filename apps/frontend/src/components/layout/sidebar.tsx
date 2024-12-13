import {
  BarChart3,
  BookAudio,
  CalendarPlus,
  Heart,
  KeyboardMusic,
  ListMusic,
  MicVocal,
  Plus,
  Radio,
} from 'lucide-react';
import Link from 'next/link';

import ActionButton from '@/components/ui/action-button';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  return (
    <div className='w-64 p-4 flex flex-col'>
      <div className='mt-10 space-y-10'>
        <div className='space-y-2'>
          <Button variant='blastActive' className='w-full justify-start' asChild>
            <Link href='/'>
              <Radio className='mr-2 h-4 w-4' />
              Feed
            </Link>
          </Button>
          <Button variant='blast' className='w-full justify-start' asChild>
            <Link href='/'>
              <ListMusic className='mr-2 h-4 w-4' />
              Bands
            </Link>
          </Button>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>About Us</h2>
          <div className='space-y-2'>
            <Button variant='blast' className='w-full justify-start' asChild>
              <Link href='/'>
                <Heart className='mr-2 h-4 w-4' />
                MMMK
              </Link>
            </Button>
            <Button variant='blast' className='w-full justify-start' asChild>
              <Link href='/'>
                <MicVocal className='mr-2 h-4 w-4' />
                The Room
              </Link>
            </Button>
            <Button variant='blast' className='w-full justify-start' asChild>
              <Link href='/'>
                <BookAudio className='mr-2 h-4 w-4' />
                Rules
              </Link>
            </Button>
          </div>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>For Members</h2>
          <div className='space-y-2'>
            <Button variant='blast' className='w-full justify-start' asChild>
              <Link href='/'>
                <CalendarPlus className='mr-2 h-4 w-4' />
                New Reservations
              </Link>
            </Button>
            <Button variant='blast' className='w-full justify-start' asChild>
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
            <Button variant='blast' className='w-full justify-start' asChild>
              <Link href='/'>
                <KeyboardMusic className='mr-2 h-4 w-4' />
                Super View
              </Link>
            </Button>
          </div>
        </div>

        <div className='pt-4'>
          <ActionButton text='Make new Reservation' icon={<Plus />} variant='ghostPrimary' />
        </div>
      </div>
    </div>
  );
}
