import { Heart, History, ListMusic, Mic2, PlayCircle, Radio } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function Sidebar() {
  return (
    <div className='w-64 border-r border-zinc-800 p-4 flex flex-col'>
      <Link href='/' className='mb-8'>
        <h1 className='text-2xl font-bold tracking-tighter'>MELO</h1>
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
              Playlists
            </Link>
          </Button>
          <Button variant='ghost' className='w-full justify-start' asChild>
            <Link href='/'>
              <PlayCircle className='mr-2 h-4 w-4' />
              Statistics
            </Link>
          </Button>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>Your Music</h2>
          <div className='space-y-2'>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/'>
                <Heart className='mr-2 h-4 w-4' />
                Favourites
              </Link>
            </Button>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/'>
                <History className='mr-2 h-4 w-4' />
                History
              </Link>
            </Button>
            <Button variant='ghost' className='w-full justify-start' asChild>
              <Link href='/'>
                <Mic2 className='mr-2 h-4 w-4' />
                Podcasts
              </Link>
            </Button>
          </div>
        </div>

        <div className='pt-4'>
          <h2 className='text-xs uppercase text-zinc-400 font-bold mb-2'>Your Playlists</h2>
          <div className='space-y-2'>
            <Button variant='ghost' className='w-full justify-start text-orange-400'>
              Metalcore
            </Button>
            <Button variant='ghost' className='w-full justify-start'>
              Electro
            </Button>
            <Button variant='ghost' className='w-full justify-start'>
              Funk
            </Button>
            <Button variant='ghost' className='w-full justify-start'>
              Disco
            </Button>
          </div>
        </div>
      </div>

      <Button className='mt-auto' variant='outline'>
        Create new playlist
      </Button>
    </div>
  );
}
