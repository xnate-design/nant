export { default as SiteContext } from './SiteContext';
export { default as SiteTheme } from './App';

declare global {
  interface Window {
    __theme: string;
    __setPreferredTheme: (theme: string) => void;
  }
}
