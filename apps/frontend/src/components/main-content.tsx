import { MoreVertical, Play } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function MainContent() {
  return (
    <main className='flex-1 overflow-y-auto p-8'>
      <div className='flex items-center justify-between mb-8'>
        <div className='relative w-96'>
          <Input placeholder='Search by artists, songs or albums' className='pl-8 bg-zinc-900' />
          <svg
            className='absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <Button variant='outline' className='ml-auto'>
          My channel
        </Button>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div className='bg-zinc-900/50 p-6 rounded-lg'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-2xl font-bold mb-1'>Playlist of the day</h2>
              <p className='text-sm text-zinc-400'>69 tracks • 4 hours 37 minutes</p>
            </div>
          </div>
          <Image src='/placeholder.svg' alt='Playlist cover' width={200} height={200} className='rounded-md' />
        </div>

        <div className='bg-zinc-900/50 p-6 rounded-lg'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-sm text-zinc-400'>Brand of Sacrifice • April, 2023</p>
              <h2 className='text-2xl font-bold'>Between Death and Dreams</h2>
            </div>
            <Button size='icon' variant='ghost'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </div>
          <div className='relative'>
            <Image
              src='/placeholder.svg'
              alt='Album cover'
              width={400}
              height={200}
              className='rounded-md w-full object-cover'
            />
            <Button size='icon' className='absolute bottom-4 right-4 rounded-full h-12 w-12'>
              <Play className='h-6 w-6' />
            </Button>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <div className='flex items-center space-x-4 mb-4'>
          <Button variant='ghost' className='text-orange-400'>
            Playlists
          </Button>
          <Button variant='ghost'>Artists</Button>
          <Button variant='ghost'>Albums</Button>
          <Button variant='ghost'>Streams</Button>
          <Button variant='ghost'>Friends`&apos;` playlists</Button>
        </div>

        <div className='space-y-2'>
          {[
            { name: 'Workout at the gym', tracks: '29 tracks • 2h 15m', date: '23 June, 2023' },
            { name: 'Tracks without lyrics', tracks: '35 tracks • 2h 15m', date: '27 April, 2023' },
            { name: 'Funny stuff', tracks: '108 tracks • 6h 48m', date: '12 February, 2023' },
          ].map((playlist) => (
            <div key={playlist.name} className='flex items-center justify-between p-3 rounded-md hover:bg-zinc-900/50'>
              <div className='flex items-center space-x-3'>
                <Image src='/placeholder.svg' alt={playlist.name} width={48} height={48} className='rounded' />
                <div>
                  <h3 className='font-medium'>{playlist.name}</h3>
                  <p className='text-sm text-zinc-400'>{playlist.tracks}</p>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-zinc-400'>{playlist.date}</span>
                <Button size='icon' variant='ghost'>
                  <Play className='h-4 w-4' />
                </Button>
                <Button size='icon' variant='ghost'>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
