import type { Plugin, ResolvedConfig, Rollup, UserConfig } from 'vite';
import { compile } from '@mdx-js/mdx';

import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import remarkFrontMatter from 'remark-frontmatter';
import externalLinks from 'remark-external-links';
import images from 'remark-images';
import unrwapImages from 'remark-unwrap-images';

import { transform } from '@babel/core';

const markdownToReact = async (code: string) => {
  const jsxCode = await compile(code, {
    remarkPlugins: [remarkGfm, remarkFrontMatter, externalLinks, images, unrwapImages],
    rehypePlugins: [
      function rehypeMetaAsAttributes() {
        return (tree) => {
          visit(tree, 'element', (node) => {
            if (node.tagName === 'code' && node.data && node.data.meta) {
              node.properties.meta = node.data.meta;
            }
          });
        };
      },
    ],
  });

  const jsCode = await transform(jsxCode.value, {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    presets: ['@babel/preset-react'],
  }).code;

  console.log(jsCode, 'jsCode');

  const tsxOut = `
  const mdContainer = ${JSON.stringify(code)};
  export default (props) => {
    return props.children({mdContainer, attributes, toc})
  }
  `;

  return {
    code: '',
  };
};

export const markdown = (): Plugin => {
  return {
    name: 'vite-plugin-nant-markdown',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.md$/.test(id)) {
        return;
      }
      try {
        return await markdownToReact(code);
      } catch (error: any) {
        this.error(error);
        return '';
      }
    },
  };
};
