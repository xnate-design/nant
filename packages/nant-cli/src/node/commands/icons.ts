import { resolve, parse } from 'path';
import logger from '../shared/logger';
import fse from 'fs-extra';
import { webfont } from 'webfont';
import sharp from 'sharp';

const { readdirSync, writeFile, ensureDir, removeSync } = fse;

const CWD = process.cwd();
const ICONS_DIST_DIR = resolve(CWD, 'dist');
const ICONS_SVG_DIR = resolve(CWD, 'svg');
const ICONS_FONTS_DIR = resolve(ICONS_DIST_DIR, 'fonts');
const ICONS_PNG_DIR = resolve(ICONS_DIST_DIR, 'png');
const ICONS_CSS_DIR = resolve(ICONS_DIST_DIR, 'css');

const name = 'nant-webfont';
const fontFamilyClassName = 'nant-icon--set';
const namespace = 'nant-icon';
const base64 = true;
const fontWeight = 'normal';
const fontStyle = 'normal';
const publicPath = ICONS_FONTS_DIR;

const removeDir = async () => {
  removeSync(ICONS_DIST_DIR);
  await Promise.all([ensureDir(ICONS_FONTS_DIR), ensureDir(ICONS_PNG_DIR), ensureDir(ICONS_CSS_DIR)]);
};

const buildWebFont = (name: string) => {
  return webfont({
    files: `${ICONS_SVG_DIR}/*.svg`,
    fontName: name,
    formats: ['ttf'],
    fontHeight: '512',
    descent: 64,
  });
};

const buildPNG = async (svgFiles: string[]) => {
  await Promise.all(
    svgFiles.map(
      (svg) =>
        new Promise<void>((done) => {
          const { name } = parse(svg);
          sharp(resolve(ICONS_SVG_DIR, svg))
            .resize({ height: 100 })
            .toBuffer()
            .then((buffer) => {
              sharp({
                create: {
                  width: 100,
                  height: 100,
                  channels: 4,
                  background: '#4a7afe',
                },
              })
                .composite([
                  {
                    input: buffer,
                    blend: 'dest-in',
                  },
                ])
                .png()
                .toFile(resolve(ICONS_PNG_DIR, `${name}.png`))
                .then(() => {
                  done();
                });
            });
        }),
    ),
  );
};

const buildScriptAndCSS = async (svgFiles: string[], ttf: Buffer | string) => {
  const icons = svgFiles.map((svg) => {
    const i = svg.indexOf('-');
    const extIdx = svg.lastIndexOf('.');
    return {
      name: svg.slice(i + 1, extIdx),
      pointCode: svg.slice(0, i),
    };
  });

  const iconsName = icons.map((icon) => `${icon.name}`);

  const indexTmp = `\
export const pointCodes = {
  ${icons.map(({ name, pointCode }) => `'${name}': '${pointCode}'`).join(',\n ')}
}
export default [
  ${iconsName.join(',\n ')}
]
`;

  const cssTemplate = `\
@font-face {
  font-family: "${name}";
  src: url("${
    base64 ? `data:font/truetype;charset=utf-8;base64,${ttf.toString('base64')}` : `${publicPath}${name}-webfont.ttf`
  }") format("truetype");
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
}

.${fontFamilyClassName} {
  font-family: "${name}";
}

${icons
  .map(
    (icon) => `.${namespace}-${icon.name}::before {
  content: "\\${icon.pointCode}";
}`,
  )
  .join('\n\n')}
`;

  return {
    cssTemplate,
    indexTmp,
  };
};

export async function icons() {
  await removeDir();
  const svgFiles = readdirSync(ICONS_SVG_DIR);
  const [{ ttf }] = await Promise.all([buildWebFont(name), buildPNG(svgFiles)]);
  const { cssTemplate, indexTmp } = await buildScriptAndCSS(svgFiles, ttf ?? '');

  await Promise.all([
    writeFile(resolve(ICONS_FONTS_DIR, `${name}-webfont.tff`), ttf ?? ''),
    writeFile(resolve(ICONS_CSS_DIR, `${name}.css`), cssTemplate),
    writeFile(resolve(ICONS_CSS_DIR, `${name}.scss`), cssTemplate),
    writeFile(resolve(ICONS_DIST_DIR, `index.js`), indexTmp),
  ]);

  logger.success(`build icons success`);
}
