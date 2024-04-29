'use client';
import { useTheme } from 'next-themes';
import { MoonIcon, SunFilledIcon } from '@/components/icons';
import { useIsSSR } from '@react-aria/ssr';

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  return (
    <div
      suppressHydrationWarning
      aria-label="Use Light Mode"
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
      className="active:scale-95 transition-transform flex px-2 items-center justify-center outline-link cursor-pointer"
    >
      {theme === 'light' || isSSR ? <MoonIcon /> : <SunFilledIcon />}
    </div>
  );
};
