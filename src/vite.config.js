import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFile } from 'node:fs/promises';

export default defineConfig({
  base: '/',
  plugins: [{
    name: 'generated-detail-pages',
    configureServer(server) {
      // Public HTML directories must resolve before Vite's SPA fallback.
      server.middlewares.use(async (request, response, next) => {
        if (!['GET', 'HEAD'].includes(request.method)) return next();
        const pathname = new URL(request.url || '/', 'http://localhost').pathname;
        const match = pathname.match(/^\/(?:(ru|zh-cn)\/)?(products|services)\/([a-z0-9-]+)(?:\/(?:index\.html)?)?$/);
        if (!match) return next();
        const file = resolve(__dirname, '../public', match[1] || '', match[2], match[3], 'index.html');
        try {
          const source = await readFile(file, 'utf8');
          const html = await server.transformIndexHtml(pathname, source);
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.end(request.method === 'HEAD' ? '' : html);
        } catch (error) {
          if (error.code !== 'ENOENT') return next(error);
          response.statusCode = 404;
          response.end('Page not found');
        }
      });
    },
  }],
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
