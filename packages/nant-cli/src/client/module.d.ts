declare module '@siteData' {
  import type { SiteData } from 'nant';
  const data: SiteData;
  export default data;
}

declare module '@theme/index' {
  import type { Theme } from 'nant';
  const theme: Theme;
  export default theme;
}
