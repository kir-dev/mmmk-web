import './globals.css';

import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Sidebar } from '@/components/layout/sidebar';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'MMMK',
  description: 'MMMK Homepage and Rehearsal Room Booking Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='hu'>
      <body className={`${GeistSans.className}`}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <div className='h-screen flex flex-col'>
            <Header />
            <div className='flex-1 flex overflow-hidden'>
              <Sidebar />
              {children}
              <RightSidebar />
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
