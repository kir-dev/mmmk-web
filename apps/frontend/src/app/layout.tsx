import './globals.css';

import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

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
      <body className={`${GeistSans.className} bg-zinc-950 text-zinc-50`}>{children}</body>
    </html>
  );
}
