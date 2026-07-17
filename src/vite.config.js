import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, '../index.html'),
        ru: resolve(__dirname, '../ru/index.html'),
        zhCn: resolve(__dirname, '../zh-cn/index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@utils': resolve(__dirname, 'utils')
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});
