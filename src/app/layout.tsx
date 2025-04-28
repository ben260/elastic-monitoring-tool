import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import type { Metadata } from 'next';
//import { Geist, Geist_Mono } from "next/font/google";

import React from 'react';
import './globals.css';

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/

export const metadata: Metadata = {
  title: 'Elastic Alert Manager',
  description: '',
};

export default function RootLayout({
  breadcrumbs,
  children,
}: Readonly<{
  breadcrumbs: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator
                orientation='vertical'
                className='mr-2 data-[orientation=vertical]:h-4'
              />
              {breadcrumbs}
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
