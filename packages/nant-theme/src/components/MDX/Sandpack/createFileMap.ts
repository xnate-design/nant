import siteData from '@siteData';

import type { SandpackFile } from '@codesandbox/sandpack-react';

export const sandpackFile = (name: string, path: string) => {
  const result: Record<string, SandpackFile> = {};
  const demoLists = (siteData?.pages ?? []).find((p: any) => p.path === path).demosMap;
  const demoCode = demoLists.find((d: any) => d.demoName === name).demoSourceCode;

  if (name) {
    result['/App.js'] = {
      code: demoCode ?? '',
      hidden: false,
      active: true,
    };
  }

  return result;
};
