'use client';
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
  Users2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ActionButton from '@/components/ui/action-button';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div className='w-64 p-4 flex flex-col'>
      <div className='mt-10 space-y-10'>
        <div className='space-y-2'>
          <Button variant={pathname === '/' ? 'blastActive' : 'blast'} className='w-full justify-start' asChild>
            <Link href='/'>
              <Radio className='mr-2 h-4 w-4' />
              Feed
            </Link>
          </Button>
          <Button
            variant={pathname.startsWith('/bands') ? 'blastActive' : 'blast'}
            className='w-full justify-start'
            asChild
          >
            <Link href='/bands'>
              <ListMusic className='mr-2 h-4 w-4' />
              Bands
            </Link>
          </Button>
          <Button
            variant={pathname.startsWith('/members') ? 'blastActive' : 'blast'}
            className='w-full justify-start'
            asChild
          >
            <Link href='/members'>
              <Users2 className='mr-2 h-4 w-4' />
              Members
            </Link>
          </Button>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>About Us</h2>
          <div className='space-y-2'>
            <Button
              variant={pathname.startsWith('/about') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/about'>
                <Heart className='mr-2 h-4 w-4' />
                MMMK
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith('/room') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/room'>
                <MicVocal className='mr-2 h-4 w-4' />
                The Room
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith('/rules') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/rules'>
                <BookAudio className='mr-2 h-4 w-4' />
                Rules
              </Link>
            </Button>
          </div>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>For Members</h2>
          <div className='space-y-2'>
            <Button
              variant={pathname.startsWith('/reservations') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/reservations'>
                <CalendarPlus className='mr-2 h-4 w-4' />
                New Reservations
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith('/stats') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/stats'>
                <BarChart3 className='mr-2 h-4 w-4' />
                Statistics
              </Link>
            </Button>
          </div>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>Admin</h2>
          <div className='space-y-2'>
            <Button
              variant={pathname.startsWith('/super') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/super'>
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
