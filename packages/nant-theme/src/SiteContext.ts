import { createContext } from 'react';

import siteData from '@siteData';
import { DefaultTheme } from 'nant/theme';

// import { SiteData } from '';

export const initData = (): NantData => {
  return {
    site: siteData.site,
    theme: siteData.site.themeConfig,
    nav: siteData.site.themeConfig.nav,
    sideBar: siteData.site.themeConfig.sidebar,
  };
};

export interface NantData<T = any> {
  site?: any;
  theme?: T;
  nav?: DefaultTheme.NavItem[];
  sideBar?: DefaultTheme.SideBar;
  title?: string;
  lang?: string;
  isDark?: boolean;
  dir?: string;
  localeIndex?: string;
}

export default createContext<NantData<DefaultTheme.SiteConfig>>({});
