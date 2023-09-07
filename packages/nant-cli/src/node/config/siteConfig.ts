import type { Logger, UserConfig as ViteConfig } from 'vite';
import type { SiteData, Awaitable } from '../../../types/shared';

export interface LocaleSpecificConfig<ThemeConfig = any> {
  title?: string;
  description?: string;
  themeConfig?: ThemeConfig;
}
export interface UserConfig<ThemeConfig = any> extends LocaleSpecificConfig<ThemeConfig> {
  extends?: RawConfigExports<ThemeConfig>;

  base?: string;
  srcDir?: string;
  srcExclude?: string[];
  outDir?: string;
  assetsDir?: string;
  cacheDir?: string;
  /**
   * Vite config
   */
  vite?: ViteConfig & { configFile?: string | false };
}

export type RawConfigExports<ThemeConfig = any> =
  | Awaitable<UserConfig<ThemeConfig>>
  | (() => Awaitable<UserConfig<ThemeConfig>>);

export interface SiteConfig<ThemeConfig = any> extends Pick<UserConfig, 'vite'> {
  root: string;
  srcDir: string;
  site: SiteData<ThemeConfig>;
  configPath: string | undefined;
  configDeps: string[];
  themeDir: string;
  outDir: string;
  assetsDir: string;
  cacheDir: string;
  tempDir: string;
  pages: string[];
  logger: Logger;
  userConfig: UserConfig<ThemeConfig>;
}
