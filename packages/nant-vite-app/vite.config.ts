import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { nantMdx } from '@nant/vite-plugins';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nantMdx(),
    react({
      include: /\.(mdx|md|js|jsx|ts|tsx)$/,
      babel: {},
    }),
  ],
});
