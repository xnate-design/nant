import type { Logger, UserConfig as ViteConfig } from 'vite';
import type {
  LocaleSpecificConfig,
  SiteData,
  PageData,
  HeadConfig,
  Awaitable,
  LocaleConfig,
} from '../../../types/shared';

interface UserRouteConfig {
  params: Record<string, string>;
  content?: string;
}

export type ResolvedRouteConfig = UserRouteConfig & {
  /**
   * the raw route (relative to src root), e.g. foo/[bar].md
   */
  route: string;
  /**
   * the actual path with params resolved (relative to src root), e.g. foo/1.md
   */
  path: string;
  /**
   * absolute fs path
   */
  fullPath: string;
};

export interface UserConfig<ThemeConfig = any> extends LocaleSpecificConfig<ThemeConfig> {
  extends?: RawConfigExports<ThemeConfig>;

  base?: string;
  srcDir?: string;
  srcExclude?: string[];
  outDir?: string;
  assetsDir?: string;
  cacheDir?: string;

  shouldPreload?: (link: string, page: string) => boolean;

  locales?: LocaleConfig<ThemeConfig>;

  appearance?: boolean | 'dark';
  lastUpdated?: boolean;
  contentProps?: Record<string, any>;

  /**
   * TODO: MarkdownIt options
   */
  markdown?: string;
  /**
   * Options to pass on to `@vitejs/plugin-vue`
   */
  /**
   * Vite config
   */
  vite?: ViteConfig & { configFile?: string | false };
}

export type RawConfigExports<ThemeConfig = any> =
  | Awaitable<UserConfig<ThemeConfig>>
  | (() => Awaitable<UserConfig<ThemeConfig>>);

export interface SiteConfig<ThemeConfig = any> extends Pick<UserConfig, 'markdown' | 'vite'> {
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
  dynamicRoutes?: {
    routes: ResolvedRouteConfig[];
    fileToModulesMap: Record<string, Set<string>>;
  };
  rewrites?: {
    map: Record<string, string | undefined>;
    inv: Record<string, string | undefined>;
  };
  logger: Logger;
  userConfig: UserConfig;
}
