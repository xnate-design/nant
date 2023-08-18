import fg from 'fast-glob';
import type { UserConfig } from '../config/siteConfig.js';

const ROOT_DOCS_RE = /\/docs\/([-\w]+)(?:.draft)?\.md/;
const COMPONENT_DOCS_RE = /\/src\/([-\w]+)\/docs\/([-\w]+)(?:.draft)?\.md/;

export async function compilePage(srcDir: string, userConfig: UserConfig) {
  const allMarkdownFiles = (
    await fg(['**.md'], {
      cwd: srcDir,
      ignore: ['**/node_modules', ...(userConfig.srcExclude || [])],
    })
  ).sort();

  const pages: any[] = [];

  allMarkdownFiles.forEach((file) => {
    const docsPath = `/${file}`.match(ROOT_DOCS_RE);
    const componentDocsPath = `/${file}`.match(COMPONENT_DOCS_RE);
    if (componentDocsPath) {
      const [, routePath] = componentDocsPath;
      const path = `${srcDir}/${file}`;
      pages.push({
        path: `/components/${routePath}`,
        filePath: path,
        component: () => import(path),
      });
    } else if (docsPath) {
      const [, routePath] = docsPath;
      const path = `${srcDir}/${file}`;
      pages.push({
        path: `/docs/${routePath}`,
        filePath: path,
        component: () => import(path),
      });
    }
  });

  return pages;
}
