/// <reference types="vite/client" />

declare module '@pcRoute';
declare module '@mobileRoute';
declare module '@siteData';
declare module '@public';

declare module '@theme/index' {
  import type { Theme } from 'nant';
  const theme: Theme;
  export default theme;
}
