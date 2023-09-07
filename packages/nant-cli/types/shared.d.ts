export type { DefaultTheme } from './default-theme';

export type Awaitable<T> = T | PromiseLike<T>;

export interface SiteData<ThemeConfig = any> {
  base?: string;
  title?: string;
  description: string;
  themeConfig: ThemeConfig;
  pages?: any[];
}
