import type { Plugin, ResolvedConfig, Rollup, UserConfig } from 'vite';
import mdx from '@mdx-js/rollup';

export const mdxPlugin = () => {
  return mdx({
    remarkPlugins: [],
    rehypePlugins: [],
  });
};
