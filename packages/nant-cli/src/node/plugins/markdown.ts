import type { Plugin, ResolvedConfig, Rollup, UserConfig } from 'vite';

const markdownToReact = (code: string) => {
  console.log(code, 'code');
};

export const markdownPlugin: Plugin = {
  name: 'vite-plugin-nant-markdown',
  enforce: 'pre',
  transform(code, id) {
    if (!/\.md$/.test(id)) {
      return;
    }
    try {
      return markdownToReact(code);
    } catch (error: any) {
      this.error(error);
      return '';
    }
  },
};
