'use client';

import { GeistSans } from 'geist/font/sans';
import Link from 'next/link';

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
    <header className='px-4 py-3 flex items-center justify-between'>
      <Link href='/' className='flex items-center space-x-2'>
        <span className={`${GeistSans.className} text-2xl font-bold tracking-tighter`}>MMMK</span>
      </Link>

      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
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
              <Link href='/'>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button variant='outline'>Log in</Button>
      )}
    </header>
  );
}
