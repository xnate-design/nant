'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" enableColorScheme={true} defaultTheme="dark">
      {children}
    </NextThemesProvider>
  );
}
