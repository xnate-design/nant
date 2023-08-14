import type { Logger, UserConfig as ViteConfig } from 'vite';

export type Awaitable<T> = T | PromiseLike<T>;

export type HeadConfig = [string, Record<string, string>] | [string, Record<string, string>, string];

export interface PageData {
  relativePath: string;
  filePath: string; // differs from relativePath in case of path rewrites
  title: string;
  titleTemplate?: string | boolean;
  description: string;
  headers: Header[];
  frontmatter: Record<string, any>;
  params?: Record<string, any>;
  isNotFound?: boolean;
  lastUpdated?: number;
}

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

export interface TransformContext {
  page: string;
  siteConfig: SiteConfig;
  siteData: SiteData;
  pageData: PageData;
  title: string;
  description: string;
  head: HeadConfig[];
  content: string;
  assets: string[];
}

export interface LocaleSpecificConfig<ThemeConfig = any> {
  lang?: string;
  dir?: string;
  title?: string;
  titleTemplate?: string | boolean;
  description?: string;
  head?: HeadConfig[];
  themeConfig?: ThemeConfig;
}

export type LocaleConfig<ThemeConfig = any> = Record<
  string,
  LocaleSpecificConfig<ThemeConfig> & { label: string; link?: string }
>;

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

  /**
   * Configure the scroll offset when the theme has a sticky header.
   * Can be a number or a selector element to get the offset from.
   * Can also be an array of selectors in case some elements will be
   * invisible due to responsive layout. VitePress will fallback to the next
   * selector if a selector fails to match, or the matched element is not
   * currently visible in viewport.
   */
  scrollOffset?: number | string | string[] | { selector: string | string[]; padding: number };

  /**
   * Enable MPA / zero-JS mode.
   * @experimental
   */
  mpa?: boolean;

  /**
   * Extracts metadata to a separate chunk.
   * @experimental
   */
  metaChunk?: boolean;

  /**
   * Don't fail builds due to dead links.
   *
   * @default false
   */
  ignoreDeadLinks?: boolean | 'localhostLinks' | (string | RegExp | ((link: string) => boolean))[];

  /**
   * Don't force `.html` on URLs.
   *
   * @default false
   */
  cleanUrls?: boolean;

  /**
   * Use web fonts instead of emitting font files to dist.
   * The used theme should import a file named `fonts.(s)css` for this to work.
   * If you are a theme author, to support this, place your web font import
   * between `webfont-marker-begin` and `webfont-marker-end` comments.
   *
   * @default true in webcontainers, else false
   */
  useWebFonts?: boolean;

  /**
   * @experimental
   *
   * source -> destination
   */
  rewrites?: Record<string, string>;

  /**
   * Build end hook: called when SSG finish.
   * @param siteConfig The resolved configuration.
   */
  buildEnd?: (siteConfig: SiteConfig) => Awaitable<void>;

  /**
   * Head transform hook: runs before writing HTML to dist.
   *
   * This build hook will allow you to modify the head adding new entries that cannot be statically added.
   */
  transformHead?: (context: TransformContext) => Awaitable<HeadConfig[] | void>;

  /**
   * HTML transform hook: runs before writing HTML to dist.
   */
  transformHtml?: (code: string, id: string, ctx: TransformContext) => Awaitable<string | void>;

  /**
   * PageData transform hook: runs when rendering markdown to vue
   */
  transformPageData?: (
    pageData: PageData,
    ctx: TransformPageContext,
  ) => Awaitable<Partial<PageData> | { [key: string]: any } | void>;
}

export interface TransformPageContext {
  siteConfig: SiteConfig;
}

export type RawConfigExports<ThemeConfig = any> =
  | Awaitable<UserConfig<ThemeConfig>>
  | (() => Awaitable<UserConfig<ThemeConfig>>);

export interface Header {
  /**
   * The level of the header
   *
   * `1` to `6` for `<h1>` to `<h6>`
   */
  level: number;
  /**
   * The title of the header
   */
  title: string;
  /**
   * The slug of the header
   *
   * Typically the `id` attr of the header anchor
   */
  slug: string;
  /**
   * Link of the header
   *
   * Typically using `#${slug}` as the anchor hash
   */
  link: string;
  /**
   * The children of the header
   */
  children: Header[];
}

export interface SiteData<ThemeConfig = any> {
  base: string;
  cleanUrls?: boolean;
  lang: string;
  dir: string;
  title: string;
  titleTemplate?: string | boolean;
  description: string;
  head: HeadConfig[];
  appearance: boolean | 'dark';
  themeConfig: ThemeConfig;
  scrollOffset: number | string | string[] | { selector: string | string[]; padding: number };
  locales: LocaleConfig<ThemeConfig>;
  localeIndex?: string;
  contentProps?: Record<string, any>;
}

export interface SiteConfig<ThemeConfig = any>
  extends Pick<
    UserConfig,
    | 'markdown'
    | 'vite'
    | 'shouldPreload'
    | 'mpa'
    | 'metaChunk'
    | 'lastUpdated'
    | 'ignoreDeadLinks'
    | 'cleanUrls'
    | 'useWebFonts'
    | 'buildEnd'
    | 'transformHead'
    | 'transformHtml'
    | 'transformPageData'
  > {
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
