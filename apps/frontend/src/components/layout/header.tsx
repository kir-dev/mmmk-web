'use client';

import { GeistSans } from 'geist/font/sans';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import ActionButton from '@/components/ui/action-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProfile } from '@/hooks/useProfile';

export function Header() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('http://localhost:3030/auth/login');
  };

  const userData = useProfile();
  const user = userData.profile;

  return (
    <header className='px-4 py-4 flex items-center justify-between'>
      <Link href='/' className='flex items-center space-x-2'>
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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='relative h-10 w-10 rounded-full'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuItem className='flex flex-col items-start'>
                  <div className='font-medium'>{user.fullName}</div>
                  <div className='text-sm text-zinc-500'>{user.email}</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href='/profile'>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link onClick={userData.fetchProfile} href='/logout'>
                    Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant='outline' onClick={handleLogin}>
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
