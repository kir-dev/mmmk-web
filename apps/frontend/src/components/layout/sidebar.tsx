'use client';
import {
  BarChart3,
  BookAudio,
  CalendarPlus,
  Heart,
  KeyboardMusic,
  ListMusic,
  MicVocal,
  Radio,
  Users2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
              Hírek
            </Link>
          </Button>
          <Button
            variant={pathname.startsWith('/bands') ? 'blastActive' : 'blast'}
            className='w-full justify-start'
            asChild
          >
            <Link href='/bands'>
              <ListMusic className='mr-2 h-4 w-4' />
              Zenekarok
            </Link>
          </Button>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>Rólunk</h2>
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
                Próbaterem
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith('/rules') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/rules'>
                <BookAudio className='mr-2 h-4 w-4' />
                Szabályzat
              </Link>
            </Button>
          </div>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>Tagoknak</h2>
          <div className='space-y-2'>
            <Button
              variant={pathname.startsWith('/reservations') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/reservation'>
                <CalendarPlus className='mr-2 h-4 w-4' />
                Foglalás
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith('/members') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/members'>
                <Users2 className='mr-2 h-4 w-4' />
                Felhasználók
              </Link>
            </Button>
            <Button
              variant={pathname.startsWith('/stats') ? 'blastActive' : 'blast'}
              className='w-full justify-start'
              asChild
            >
              <Link href='/stats'>
                <BarChart3 className='mr-2 h-4 w-4' />
                Statisztika
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
                Admin Nézet
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
