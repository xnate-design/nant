export type SiteConfig = typeof siteConfig;
import { LogoTailwindcss, LogoVite, LogoAppleAppstore, LogoAmazon } from '@nant-design/nant-icons';

const siteConfig = {
  title: 'Nant UI',
  name: 'Beautiful, fast and modern React UI Library',
  description: 'An open source mobile UI components for building modern, high quality website',
  startUrl: '/docs/intro',
  logo: '/logo.png',
  author: 'Nate Wang',
  email: 'wangbaoqi8839@gmail.com',
  siteUrl: 'https://nant.wangbaoqi.tech',
  creator: '@baoqiwang',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nant.wangbaoqi.tech',
    siteName: 'NextUI',
    description: 'Beautiful, fast and modern React UI Library',
    images: [
      {
        url: 'https://nextui.org/twitter-cards/nextui.jpeg',
        width: 1200,
        height: 630,
        alt: 'NextUI',
      },
    ],
  },
  featureLists: [
    // {
    //   icon: (props: any) => <LogoTailwindcss {...props} />,
    //   title: 'Enjoy the Vite',
    //   description: 'Instant server start, lightning fast hot updates, and leverage Vite ecosystem plugins.',
    // },
    // {
    //   icon: (props: any) => <LogoVite {...props} />,
    //   title: 'Use the Unocss',
    //   description: 'Instant On-demand Atomic CSS Engine Customizable · Powerful · Fast · Joyful',
    // },
    // {
    //   icon: (props: any) => <LogoAppleAppstore {...props} />,
    //   title: 'Custom the Content',
    //   description: 'Effortlessly create beautiful documentation sites with just markdown.',
    // },
    // {
    //   icon: (props: any) => <LogoAmazon {...props} />,
    //   title: 'Customize with React',
    //   description: 'Use JSX syntax and components directly in markdown',
    // },
  ],
  nav: [
    { text: 'Guide', link: '/docs/intro', activeMatch: '/docs' },
    { text: 'Components', link: '/components/button', activeMatch: '/components' },
    { text: 'Icons', link: '/icons', activeMatch: '/icons' },
  ],
  sidebar: {
    '/docs': [
      {
        text: '指南',
        icon: '',
        items: [
          {
            text: '介绍',
            icon: 'intro',
            link: '/docs/intro',
          },
          {
            text: '快速开始',
            icon: '',
            link: '/docs/start',
          },
        ],
      },
    ],
    '/components': [
      {
        text: '基础组件',
        icon: '',
        collapsed: false,
        items: [
          {
            text: 'Button 按钮',
            link: '/components/button',
          },
          {
            text: 'Card 卡片',
            link: '/components/card',
          },
        ],
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextUI - Beautiful, fast and modern React UI Library',
    description: 'Make beautiful websites regardless of your design experience.',
    image: 'https://nextui.org/twitter-cards/nextui.jpeg',
    creator: '@getnextui',
  },
  links: {
    github: 'https://github.com/nextui-org/nextui',
    twitter: 'https://twitter.com/getnextui',
    docs: 'https://nextui-docs-v2.vercel.app',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
    portfolio: 'https://jrgarciadev.com',
  },
};

export default siteConfig;
