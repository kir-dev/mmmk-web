import './globals.css';

import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'MMMK',
  description: 'MMMK Rehearsal Room Booking Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={`${GeistSans.className}`}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
