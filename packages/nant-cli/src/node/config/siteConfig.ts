import type { SiteData, Awaitable } from '../../../types/shared';
import type { Logger, UserConfig as ViteConfig } from 'vite';

export type Demo = {
  demoName: string;
  demoSourceCode: string;
};

export type PageItem = {
  path?: string;
  filePath?: string;
  demosMap?: Demo[];
};

export interface NantConfig<ThemeConfig = any> {
  title?: string;
  description?: string;
  pages?: Record<string, PageItem>[];
  themeConfig?: ThemeConfig;
}
export interface UserConfig<ThemeConfig = any> extends NantConfig<ThemeConfig> {
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
  pages: Record<string, any>[];
  logger: Logger;
  userConfig: UserConfig<ThemeConfig>;
}

export function defineConfig(config: NantConfig) {
  return config;
}

export const defaultNantConfig = defineConfig({
  title: 'Nant ui',
  description: 'nant react component ui',
  themeConfig: {
    logo: '',
    nav: [
      { text: 'Guide', link: '/docs/intro', activeMatch: '/docs' },
      { text: 'Components', link: '/components/button', activeMatch: '/components' },
    ],

    sidebar: {
      '/docs': [
        {
          text: 'Guide',
          items: [
            {
              text: 'intro',
              link: '/docs/intro',
            },
            {
              text: 'start',
              link: '/docs/start',
            },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/xnate-design/nant' }],
  },
});
