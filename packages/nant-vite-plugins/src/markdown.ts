import type { Plugin, ResolvedConfig, Rollup, UserConfig } from 'vite';
import { compile } from '@mdx-js/mdx';

import { visit } from 'unist-util-visit';
import remarkGfm from 'remark-gfm';
import remarkFrontMatter from 'remark-frontmatter';
import externalLinks from 'remark-external-links';
import images from 'remark-images';
import unrwapImages from 'remark-unwrap-images';

import { transform, transformAsync } from '@babel/core';

const markdownToReact = async (code: string) => {
  console.log(typeof code);

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
  console.log(jsxCode, 'jsCode');

  // const jsCode = await transform(jsxCode.value, {
  //   plugins: ['@babel/plugin-transform-modules-commonjs'],
  //   presets: ['@babel/preset-react'],
  // }).code;

  // console.log(jsCode, 'jsCode');

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

const str =
  '/*@jsxRuntime automatic @jsxImportSource react*/\n' +
  'import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";\n' +
  'function _createMdxContent(props) {\n' +
  '  const _components = Object.assign({\n' +
  '    h1: "h1",\n' +
  '    p: "p",\n' +
  '    code: "code"\n' +
  '  }, props.components);\n' +
  '  return _jsxs(_Fragment, {\n' +
  '    children: [_jsx(_components.h1, {\n' +
  '      children: "Runtime API Examples"\n' +
  '    }), "\\n", _jsx(_components.p, {\n' +
  '      children: "This page demonstrates usage of some of the runtime APIs provided by VitePress."\n' +
  '    }), "\\n", _jsxs(_components.p, {\n' +
  '      children: ["The main ", _jsx(_components.code, {\n' +
  '        children: "useData()"\n' +
  '      }), " API can be used to access site, theme, and page data for the current page. It works in both ", _jsx(_components.code, {\n' +
  '        children: ".md"\n' +
  '      }), " and ", _jsx(_components.code, {\n' +
  '        children: ".vue"\n' +
  '      }), " files:"]\n' +
  '    })]\n' +
  '  });\n' +
  '}\n' +
  'function MDXContent(props = {}) {\n' +
  '  const {wrapper: MDXLayout} = props.components || ({});\n' +
  '  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {\n' +
  '    children: _jsx(_createMdxContent, props)\n' +
  '  })) : _createMdxContent(props);\n' +
  '}\n' +
  'export default MDXContent;\n';
