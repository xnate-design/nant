import type { Plugin } from 'vite';

function markdownToReact(source: string) {
  // const { } = extractComponents(source);
}

export default function markdown(): Plugin {
  return {
    name: 'vite-plugin-nant-markdown',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.md$/.test(id)) {
        return;
      }
      try {
        return markdownToReact(code);
      } catch (e: any) {
        this.error(e);
        return '';
      }
    },
  };
}
