import type { Plugin } from 'vite';
import ejs from 'ejs';

export interface HtmlOptions {
  data?: Record<string, string>;
}

export function html(options: HtmlOptions): Plugin {
  return {
    name: 'vite-plugin-nant-html',

    transformIndexHtml: {
      order: 'pre',

      transform(html) {
        return ejs.render(html, options.data);
      },
    },
  };
}
