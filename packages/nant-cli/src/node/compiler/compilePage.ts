import fg, { async } from 'fast-glob';
import fse from 'fs-extra';

const { readFileSync } = fse;

import type { UserConfig } from '../config/siteConfig.js';

const ROOT_DOCS_RE = /\/docs\/([-\w]+)(?:.draft)?\.md/;
const COMPONENT_DOCS_RE = /\/src\/([-\w]+)\/docs\/([-\w]+)(?:.draft)?\.md/;
const DEMOS_INDEX_RE = /\/src\/([-\w]+)\/demos\/([-\w]+)(?:.draft)?\.tsx/;

const getDemosCodeSnippet = async (srcDir: string, name: string) => {
  const demosPaths = await fg(`${srcDir}/src/${name}/demos/*.tsx`);

  return demosPaths.map((demo: string) => {
    const [, , demoName] = `/${demo}`.match(DEMOS_INDEX_RE) ?? [];
    const demoString = readFileSync(demo);

    return {
      demoName,
      demoSourceCode: demoString.toString(),
    };
  });
};

export async function compilePage(srcDir: string) {
  const allMarkdownFiles = (
    await fg(['**.md'], {
      cwd: srcDir,
      ignore: ['**/node_modules'],
    })
  ).sort();

  const rootDocs = await fg(`${srcDir}/docs/**/*.md`);
  const componentDocs = await fg(`${srcDir}/src/**/docs/*.md`);

  const rootPages = rootDocs.map((doc) => {
    const [, routePath] = `/${doc}`.match(ROOT_DOCS_RE) ?? [];
    return {
      path: `/docs/${routePath}`,
      filePath: `${doc}`,
    };
  });

  const componentPages = await Promise.all(
    componentDocs.map(async (doc) => {
      const [, routePath] = `/${doc}`.match(COMPONENT_DOCS_RE) ?? [];
      const demosMap = await getDemosCodeSnippet(srcDir, routePath);

      return {
        path: `/components/${routePath}`,
        filePath: `${doc}`,
        demosMap,
      };
    }),
  );

  const paths = [...rootPages, ...componentPages];

  return paths;
}
