'use client';

import { GeistSans } from 'geist/font/sans';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import ActionButton from '@/components/ui/action-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const isLoggedIn = true;
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    image: '/placeholder.svg',
  };

  return (
    <header className='px-4 py-4 flex items-center justify-between'>
      <Link href='/apps/frontend/public' className='flex items-center space-x-2'>
        <span className={`${GeistSans.className} text-2xl font-bold tracking-tighter`}>MMMK</span>
      </Link>

      <div className='w-80 pl-8 flex items-center justify-between'>
        <ActionButton
          text='My Bands'
          icon={<ChevronRight />}
          variant='outline'
          className='h-10 rounded-full font-light hover:bg-transparent'
        />

        <div className='flex gap-3 items-center'>
          <ThemeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='relative h-10 w-10 rounded-full'>
                  <Avatar className='h-8 w-8'>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuItem className='flex flex-col items-start'>
                  <div className='font-medium'>{user.name}</div>
                  <div className='text-sm text-zinc-500'>{user.email}</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/apps/frontend/public'>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant='outline'>Log in</Button>
          )}
        </div>
      </div>
    </header>
  );
}
