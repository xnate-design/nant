import { defineConfig } from '@nant/cli';

export default defineConfig({
  title: 'Nant',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/guide/intro' },
    ],

    sidebar: {
      '/guide': [
        {
          text: {
            'zh-CN': '介绍',
            'en-US': 'intro',
          },
          path: '/guide/intro',
        },
        {
          text: {
            'zh-CN': '使用',
            'en-US': 'usage',
          },
          path: '/guide/usage',
        },
      ],
      components: [
        {
          title: '基础组件',
          children: [
            {
              text: {
                'zh-CN': 'Button 按钮',
                'en-US': 'Button',
              },
              path: '/components/button',
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
