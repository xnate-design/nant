import { defineConfig } from '@nant/cli';

export default defineConfig({
  title: 'Nant uioo',
  description: 'nant react ui',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/guide/intro' },
    ],

    sidebar: {
      '/guide': [
        {
          text: '介绍',
          link: '/guide/intro',
        },
        {
          text: '使用',
          link: '/guide/usage',
        },
      ],
      '/components': [
        {
          text: '基础组件',
          items: [
            {
              text: 'Button 按钮',
              link: '/components/button',
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
