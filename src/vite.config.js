import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/parvina-website/'
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@utils': resolve(__dirname, 'src/utils')
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }

});

