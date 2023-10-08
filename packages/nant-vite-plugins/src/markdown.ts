import type { Plugin } from 'vite';

import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import remarkFrontMatter from 'remark-frontmatter';
import externalLinks from 'remark-external-links';
import images from 'remark-images';
import unrwapImages from 'remark-unwrap-images';
import withSlugs from 'rehype-slug';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

import { VFile } from 'vfile';
import { createFilter } from '@rollup/pluginutils';
import { compile } from '@mdx-js/mdx';

export type CompileOptions = Omit<import('@mdx-js/mdx').CompileOptions, 'SourceMapGenerator'>;
/**
 * Extra configuration.
 */
export type RollupPluginOptions = {
  /**
   * List of picomatch patterns to include
   */
  include?: import('@rollup/pluginutils').FilterPattern | undefined;
  /**
   * List of picomatch patterns to exclude
   */
  exclude?: import('@rollup/pluginutils').FilterPattern | undefined;
};
/**
 * Configuration.
 */

type Components = {
  componentKeys?: string[];
};

export type Options = Components & CompileOptions & RollupPluginOptions;

export type { Toc } from '@stefanprobst/rehype-extract-toc';

function rehypeMetaAsAttributes() {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'code' && node.data && node.data.meta) {
        node.properties.meta = node.data.meta;
      }
    });
  };
}

export const nantMdx = (options?: Options): Plugin => {
  const remarkPlugins = [remarkGfm, remarkFrontMatter, externalLinks, images, unrwapImages];
  const rehypePlugins = [rehypeMetaAsAttributes, rehypeAutolinkHeadings, withSlugs, withToc];
  const { include, exclude, development, ...rest } = options || {};
  const extnames: string[] = ['.md', '.mdx'];
  const jsxEnv = development || development === undefined ? '_jsxDEV' : '_jsx';

  const filter = createFilter(include, exclude);
  return {
    name: 'vite-plugin-nant-mdx',
    enforce: 'pre',
    async transform(value, path) {
      const file: any = new VFile({ value, path });
      if (file.extname && filter(file.path) && extnames.includes(file.extname)) {
        const compiled = await compile(value, {
          rehypePlugins,
          remarkPlugins,
          development,
          ...rest,
        });
        const { data } = compiled;
        const toc = JSON.stringify({ toc: data.toc ?? [] });
        const pagePath = JSON.stringify({ path: path });
        const jsxCode = String(compiled.value);
        const suffix = `export default function MdxDocument (props) {
          return ${jsxEnv}("div", { children: ${jsxEnv}(MDXContent, Object.assign({}, props, ${toc}, ${pagePath})) })
        }`;

        const code = jsxCode.replace('export default MDXContent;', suffix);
        const result = { code, map: compiled.map };
        return result;
      }
    },
  };
};
