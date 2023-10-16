import { resolve, parse } from 'path';
import logger from '../shared/logger.js';
import fse from 'fs-extra';
import svgToFont from 'svgtofont';
import svgTransform from '../compiler/compileSvg.js';
import { toPascalCase } from '../shared/fsUtils.js';
const { readdirSync, writeFile, readFileSync, ensureDir, removeSync } = fse;

const CWD = process.cwd();
const ICONS_DIST_DIR = resolve(CWD, 'dist');
const ICONS_SVG_DIR = resolve(CWD, 'svg');
const ICONS_FONTS_DIR = resolve(ICONS_DIST_DIR, 'fonts');
const ICONS_PNG_DIR = resolve(ICONS_DIST_DIR, 'png');
const ICONS_CSS_DIR = resolve(ICONS_DIST_DIR, 'css');
const ICONS_REACT_DIR = resolve(ICONS_DIST_DIR, 'react');

const removeDir = async () => {
  removeSync(ICONS_DIST_DIR);
  await Promise.all([
    ensureDir(ICONS_FONTS_DIR),
    ensureDir(ICONS_PNG_DIR),
    ensureDir(ICONS_CSS_DIR),
    ensureDir(ICONS_REACT_DIR),
  ]);
};

const buildWebFont = async () => {
  try {
    await svgToFont({
      src: ICONS_SVG_DIR,
      dist: ICONS_DIST_DIR,
      fontName: 'nant-icon',
      css: true,
      outSVGPath: true,
      startUnicode: 20000, // unicode start number
      // outSVGReact: true,
      typescript: true,
    });
  } catch (error) {
    console.error(error, 'err');
  }
};

const reactTypeSource = (name: string) => `import React from 'react';
export declare const ${name}: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
`;

const buildReactFile = async (svgFiles: string[]) => {
  return Promise.all(
    svgFiles.map(async (svgPath) => {
      const svg = readFileSync(resolve(ICONS_SVG_DIR, svgPath), 'utf8');
      const name = toPascalCase(svgPath)?.replace(/Svg/g, '');
      const output = await svgTransform.start(svg, { name });
      await writeFile(resolve(ICONS_REACT_DIR, `${name}.jsx`), output);
      await writeFile(resolve(ICONS_REACT_DIR, `${name}.d.ts`), reactTypeSource(name ?? 'ErrorComponent'));
      return `export * from './${name}';`;
    }),
  );
};

const buildReactComponent = async (svgFiles: string[]) => {
  const exportFiles = await buildReactFile(svgFiles);
  await writeFile(resolve(ICONS_REACT_DIR, `index.js`), exportFiles.join('\n'));
};

export async function icons() {
  await removeDir();
  const svgFiles = readdirSync(ICONS_SVG_DIR);
  await Promise.all([buildReactComponent(svgFiles)]);

  logger.success(`build icons success`);
}
