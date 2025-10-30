'use client';

import './globals.css';

import { GeistSans } from 'geist/font/sans';
import React, { useState } from 'react';

import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { Sidebar } from '@/components/layout/sidebar';
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <html lang='hu'>
      <body className={`${GeistSans.className}`}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <div className='h-screen flex flex-col'>
            <Header />
            <div className='flex-1 flex overflow-hidden relative'>
              {/* Mobile open button */}
              <button
                onClick={() => setOpen(true)}
                className={`md:hidden fixed top-1/2 left-2 z-30 backdrop-blur-lg shadow-lg border border-white/30 p-2 transition-all duration-300 text-black dark:text-white rounded-full ${open ? 'hidden' : 'block'}`}
                aria-label='Open navigation'
              >
                <svg width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M4 12h16M4 6h16M4 18h16' />
                </svg>
              </button>
              {/* Sidebar */}
              <div
                className={`
                  ${open ? 'fixed inset-0 z-50 md:static md:z-auto' : 'hidden md:block'}
                  h-full
                `}
                style={{ width: open ? 260 : undefined }}
                onClick={() => open && setOpen(false)}
              >
                <div
                  className={`
                    h-full
                    bg-slate-300
                    dark:bg-slate-800 md:bg-transparent dark:md:bg-transparent
                    dark:text-white
                    fixed top-0 left-0 z-50
                    transition-transform duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    md:static md:translate-x-0
                    w-64
                  `}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Mobile close button */}
                  <button
                    className='absolute top-4 right-4 md:hidden transition-colors'
                    onClick={() => setOpen(false)}
                    aria-label='Close sidebar'
                  >
                    <svg width='24' height='24' fill='none' stroke='currentColor' strokeWidth='2'>
                      <path d='M18 6L6 18M6 6l12 12' />
                    </svg>
                  </button>
                  <Sidebar />
                </div>
              </div>
              {/* Main content */}
              <div className='flex-1 overflow-auto'>{children}</div>
              {/* RightSidebar: hide on mobile */}
              <div className='hidden md:block'>
                <RightSidebar />
              </div>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
