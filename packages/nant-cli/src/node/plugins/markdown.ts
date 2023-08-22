import type { Plugin, PluginOption, ResolvedConfig, Rollup, UserConfig } from 'vite';
import mdx from '@mdx-js/rollup';

export const mdxPlugin = (): PluginOption => {
  return {
    enforce: 'pre',
    ...mdx({
      remarkPlugins: [],
      rehypePlugins: [],
    }),
  };
};
