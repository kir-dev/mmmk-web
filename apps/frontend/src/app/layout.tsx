import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Player } from '@/components/player';
import { RightSidebar } from '@/components/right-sidebar';
import { Sidebar } from '@/components/sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MMMK',
  description: 'MMMK Band Music Room Booking Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 h-screen flex flex-col`}>
        <div className='flex-1 flex overflow-hidden'>
          <Sidebar />
          {children}
          <RightSidebar />
        </div>
        <Player />
      </body>
    </html>
  );
}
