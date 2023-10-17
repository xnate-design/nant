export { default as SiteContext } from './SiteContext';
export { default as SiteTheme } from './App';
export { default as SiteMobileTheme } from './MobileApp';

declare global {
  interface Window {
    __theme: string;
    __setPreferredTheme: (theme: string) => void;
  }
}
