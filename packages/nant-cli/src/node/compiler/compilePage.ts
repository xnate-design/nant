import fg from 'fast-glob';
import type { UserConfig } from '../config/siteConfig.js';

export async function compilePage(srcDir: string, userConfig: UserConfig) {
  const allMarkdownFiles = (
    await fg(['**.md'], {
      cwd: srcDir,
      ignore: ['**/node_modules', ...(userConfig.srcExclude || [])],
    })
  ).sort();

  const pages: string[] = [];

  allMarkdownFiles.forEach((file) => {
    pages.push(file);
  });

  return pages;
}
