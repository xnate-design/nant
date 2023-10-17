import { preview as vitePreview } from 'vite';

export async function preview() {
  const previewServer = await vitePreview({});
  previewServer.printUrls();
}
