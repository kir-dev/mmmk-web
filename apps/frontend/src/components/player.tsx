import {
  Heart,
  ListMusic,
  Mic2,
  MoreHorizontal,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function Player() {
  return (
    <div className='h-20 border-t border-zinc-800 p-4 flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <Image src='/placeholder.svg' alt='Album cover' width={48} height={48} className='rounded' />
        <div>
          <h3 className='font-medium'>Welcome To Horrorwood</h3>
          <p className='text-sm text-zinc-400'>Ice Nine Kills</p>
        </div>
        <Button size='icon' variant='ghost'>
          <Heart className='h-4 w-4' />
        </Button>
      </div>

      <div className='flex flex-col items-center'>
        <div className='flex items-center space-x-4'>
          <Button size='icon' variant='ghost'>
            <Shuffle className='h-4 w-4' />
          </Button>
          <Button size='icon' variant='ghost'>
            <SkipBack className='h-4 w-4' />
          </Button>
          <Button size='icon' className='h-8 w-8 bg-orange-500 hover:bg-orange-600'>
            <Play className='h-4 w-4' />
          </Button>
          <Button size='icon' variant='ghost'>
            <SkipForward className='h-4 w-4' />
          </Button>
          <Button size='icon' variant='ghost'>
            <Repeat className='h-4 w-4' />
          </Button>
        </div>
        <div className='flex items-center space-x-2 text-sm text-zinc-400'>
          <span>1:55</span>
          <div className='w-96 h-1 bg-zinc-800 rounded-full'>
            <div className='w-1/3 h-full bg-orange-500 rounded-full' />
          </div>
          <span>3:47</span>
        </div>
      </div>

      <div className='flex items-center space-x-4'>
        <Button size='icon' variant='ghost'>
          <Mic2 className='h-4 w-4' />
        </Button>
        <Button size='icon' variant='ghost'>
          <ListMusic className='h-4 w-4' />
        </Button>
        <div className='flex items-center space-x-2'>
          <Volume2 className='h-4 w-4' />
          <Slider defaultValue={[66]} max={100} step={1} className='w-24' />
        </div>
        <Button size='icon' variant='ghost'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
