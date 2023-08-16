export type Awaitable<T> = T | PromiseLike<T>;

export type HeadConfig = [string, Record<string, string>] | [string, Record<string, string>, string];

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