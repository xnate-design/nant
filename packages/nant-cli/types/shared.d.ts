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
  head: Header[];
  appearance: boolean | 'dark';
  themeConfig: ThemeConfig;
  scrollOffset: number | string | string[] | { selector: string | string[]; padding: number };
  locales: string;
  localeIndex?: string;
  contentProps?: Record<string, any>;
}
