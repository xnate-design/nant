import type { Metadata } from 'next';
import { Providers } from './provider';
import { cn } from '@/utils/cn';
import { fontOutfit } from '@/config/font';
import '@/styles/globals.css';
import { Navbar } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const bodyClsx = cn(fontOutfit.className, 'min-h-screen text-[16px] bg-background scroll-smooth antialiased');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bodyClsx}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
