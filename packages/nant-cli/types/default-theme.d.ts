export namespace DefaultTheme {
  // nav
  export type NavItem = NavItemWithLink | NavItemWithChildren;

  export interface NavItemWithLink {
    text?: string;
    link?: string;
    activeMatch?: string;
    target?: string;
    rel?: string;
  }

  export interface NavItemWithChildren {
    text?: string;
    link?: string;
    items: (NavItemWithChildren | NavItemWithLink)[];
    activeMatch?: string;
  }

  // SideBar
  export type SideBar = SideBarItem[] | SideBarMulti;

  export interface SideBarItem {
    text?: string;
    link?: string;
    items?: SideBarItem[];
    collapsed?: boolean;
    base?: string;
    docFooterText?: string;
  }

  export interface SideBarMulti {
    [path: string]: SideBarItem[] | { items: SideBarItem[]; base: string };
  }

  // EditLink

  //SocialLink

  export interface SocialLink {
    icon: SocialLinkIcon;
    link: string;
    ariaLabel?: string;
  }
  export type SocialLinkIcon =
    | 'discord'
    | 'facebook'
    | 'github'
    | 'instagram'
    | 'linkedin'
    | 'mastodon'
    | 'slack'
    | 'twitter'
    | 'x'
    | 'youtube'
    | { svg: string };

  export interface Footer {
    message?: string;
    copyright?: string;
  }

  export interface SiteConfig {
    logo?: string;
    logoUrl?: string;
    siteTitle?: string;
    outLine?: string;
    nav?: NavItem[];
    sidebar?: SideBar;
    socialLinks?: SocialLink[];
    footer?: Footer;
    externalLinkIcon?: boolean;
  }
}
