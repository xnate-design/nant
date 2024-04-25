import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { visit } from 'unist-util-visit';

export const Docs = defineDocumentType(() => ({
  name: 'Docs',
  filePathPattern: `docs/**/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/docs/${post._raw.flattenedPath}` },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Docs],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      () => (tree) => {
        visit(tree, 'element', (node) => {
          if (node.tagName === 'code' && node.data && node.data.meta) {
            node.properties.meta = node.data.meta;
          }
        });
      },
    ],
  },
});
