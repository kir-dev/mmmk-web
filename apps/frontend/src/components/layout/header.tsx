'use client';

import { GeistSans } from 'geist/font/sans';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ThemeToggle } from '@/components/layout/theme-toggle';
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
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
  };

  const userData = useProfile();
  const user = userData.profile;

  return (
    <header className='px-4 py-4 flex items-center justify-between'>
      <Link href='/' className='flex items-center space-x-2'>
        <span className={`${GeistSans.className} text-2xl font-bold tracking-tighter`}>MMMK</span>
      </Link>

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
                <Button onClick={userData.logout}>Log out</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant='outline' onClick={handleLogin}>
            Log in
          </Button>
        )}
      </div>
    </header>
  );
}
