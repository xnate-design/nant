import RouterApp from './App';

export { default as SiteContext } from './SiteContext';

export const SiteTheme = () => {
  return <RouterApp />;
};

declare global {
  interface Window {
    __theme: string;
    __setPreferredTheme: (theme: string) => void;
  }
}
