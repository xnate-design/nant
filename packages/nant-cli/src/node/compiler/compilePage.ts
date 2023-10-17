import fg from 'fast-glob';
import fse from 'fs-extra';

import { normalizePath } from 'vite';
import {
  SITE_COMPONENT_ROOT,
  SITE_ROOT,
  DOCS_DIR_NAME,
  EXAMPLE_DIR_NAME,
  EXAMPLE_INDEX_NAME,
  SITE_DOC_ROOT,
  COMPONENT_DIR_NAME,
  SITE_PC_ROUTES,
  SITE_MOBILE_ROUTES,
} from '../shared/constant.js';
import { outputFileSyncOnChange } from '../shared/fsUtils.js';

const ROOT_DOCS_RE = /\/docs\/([-\w]+)(?:.draft)?\.md/;
const COMPONENT_DOCS_RE = /\/src\/([-\w]+)\/docs\/([-\w]+)(?:.draft)?\.md/;
const DEMOS_INDEX_RE = /\/src\/([-\w]+)\/demos\/([-\w]+)(?:.draft)?\.tsx/;

const ROOT_DOCS_RE1 = /\/docs\/([-\w]+)(?:.draft)?\.md/;
const DEMOS_INDEX_RE1 = /\/([-\w]+)\/demos\/index(?:.draft)?\.tsx/;
const COMPONENT_DOCS_RE1 = /\/([-\w]+)\/docs\/([-\w]+)(?:.draft)?\.md/;

const ROOT_DOCS_DIR = normalizePath(SITE_DOC_ROOT);
const ROOT_COMPONENTS_DIR = normalizePath(SITE_COMPONENT_ROOT);

const { readFileSync } = fse;

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

// get root docs path
const getRootDocPath = (path: string): string => {
  const [, type] = path.match(ROOT_DOCS_RE1) ?? [];
  return `/${DOCS_DIR_NAME}/${type}`;
};

// get components docs path
const getComponentsDocPath = (path: string): string => {
  const [, category] = path.match(COMPONENT_DOCS_RE1) ?? [];
  return `/${COMPONENT_DIR_NAME}/${category}`;
};

const getExampleRoutePath = (path: string): string => {
  return '/' + path.match(DEMOS_INDEX_RE1)?.[1];
};

// get root docs
const getRootDocs = async () => {
  return await fg(`${ROOT_DOCS_DIR}/**/*.md`);
};

// get components docs
const getComponentsDocs = async () => {
  return await fg(`${ROOT_COMPONENTS_DIR}/**/${DOCS_DIR_NAME}/*.md`);
};

// get components demos
const getComponentsDemos = async () => {
  return await fg(`${ROOT_COMPONENTS_DIR}/**/${EXAMPLE_DIR_NAME}/${EXAMPLE_INDEX_NAME}`);
};

// get Pc site router
const compilePcSiteRoutes = async () => {
  const [rootDoc, componentDoc] = await Promise.all([getRootDocs(), getComponentsDocs()]);

  const rootDocsRoutes = rootDoc.map(
    (doc) => `
  {
    path: '${getRootDocPath(doc)}',
    // @ts-ignore
    component: () => import('${doc}')
  }`,
  );

  const componentDocsRoutes = componentDoc.map(
    (componentDoc) => `
  {
    path: '${getComponentsDocPath(componentDoc)}',
    // @ts-ignore
    component: () => import('${componentDoc}')
  }`,
  );

  const allPcRoutes = `export default [\
    ${[...rootDocsRoutes, ...componentDocsRoutes]},
]`;

  outputFileSyncOnChange(SITE_PC_ROUTES, allPcRoutes);
};

const compileMobileSiteRoutes = async () => {
  const demos = await getComponentsDemos();
  const routes = demos.map(
    (demo) => `
  {
    path: '${getExampleRoutePath(demo)}',
    // @ts-ignore
    component: () => import('${demo}')
  }`,
  );

  const source = `export default [\
    ${routes.join(',')}
]`;

  outputFileSyncOnChange(SITE_MOBILE_ROUTES, source);
};

export async function compilePage() {
  await Promise.all([compilePcSiteRoutes(), compileMobileSiteRoutes()]);
}
