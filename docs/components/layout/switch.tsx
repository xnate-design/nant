import { useTheme } from 'next-themes';
import { MoonIcon, SunFilledIcon } from '@/components/icons';

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Use Light Mode"
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
      className="active:scale-95 transition-transform flex px-2 items-center justify-center hover:text-link hover:dark:text-link-dark outline-link"
    >
      {theme === 'light' ? <MoonIcon /> : <SunFilledIcon />}
    </button>
  );
};
