import siteData from '@siteData';

import type { SiteData, DefaultTheme } from 'nant/shared';

export const initData = (): NantData<DefaultTheme.SiteConfig> => {
  return {
    site: siteData.site,
    themeConfig: siteData.site.themeConfig,
    nav: siteData.site.themeConfig.nav,
    sideBar: siteData.site.themeConfig.sidebar,
  };
};

export interface NantData<T> {
  site?: SiteData<T>;
  themeConfig?: T;
  nav?: DefaultTheme.NavItem[];
  sideBar?: DefaultTheme.SideBar;
  title?: string;
  lang?: string;
  isDark?: boolean;
  dir?: string;
  localeIndex?: string;
}
