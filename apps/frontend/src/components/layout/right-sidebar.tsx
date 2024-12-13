import { MoreVertical, Play } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';

export function RightSidebar() {
  return (
    <div className='w-80 p-4 overflow-y-auto'>
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold'>NEW RELEASES</h2>
          <Button variant='link' className='text-orange-400'>
            See all
          </Button>
        </div>
        <div className='space-y-4'>
          {[
            { title: 'Calamity', artist: 'Annisokay', album: 'Calamity', year: '2023' },
            { title: 'Last Resort (Reimagined)', artist: 'Falling in Reverse', album: 'Single', year: '2023' },
          ].map((release) => (
            <div key={release.title} className='flex items-center space-x-3'>
              <Image src='/placeholder.svg' alt={release.title} width={48} height={48} className='rounded' />
              <div className='flex-1 min-w-0'>
                <h3 className='font-medium truncate'>{release.title}</h3>
                <p className='text-sm text-zinc-400 truncate'>
                  {release.artist} • {release.album} • {release.year}
                </p>
              </div>
              <Button size='icon' variant='ghost'>
                <Play className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-bold'>FAVOURITE ARTISTS</h2>
          <Button variant='link' className='text-orange-400'>
            See all
          </Button>
        </div>
        <div className='space-y-4'>
          {[
            { name: 'Ice Nine Kills', subscribers: '432k subscribers' },
            { name: 'Bloodywood', subscribers: '311k subscribers' },
            { name: 'Bad Omens', subscribers: '183k subscribers' },
          ].map((artist, index) => (
            <div key={artist.name} className='flex items-center space-x-3'>
              <div className='relative w-12 h-12'>
                <div className='absolute inset-0 flex items-center justify-center text-2xl font-bold bg-zinc-800 rounded'>
                  {index + 1}
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <h3 className='font-medium truncate'>{artist.name}</h3>
                <p className='text-sm text-zinc-400 truncate'>{artist.subscribers}</p>
              </div>
              <Button size='icon' variant='ghost'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
