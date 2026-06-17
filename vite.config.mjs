import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  base: './',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html',
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'resources/data/**/*', dest: 'resources/data' },
        { src: 'resources/img/**/*', dest: 'resources/img' },
        { src: 'resources/js/handleajaxform.php', dest: 'resources/js' },
        { src: 'resources/js/PHPMailer/**/*', dest: 'resources/js/PHPMailer' },
        { src: 'vendors/css/**/*', dest: 'vendors/css' },
        { src: 'vendors/fonts/**/*', dest: 'vendors/fonts' },
        { src: 'google796d0008d4bdf2f9.html', dest: '.' },
        { src: 'pinterest-ad986.html', dest: '.' },
        { src: '*.ico', dest: '.' },
      ],
    }),
  ],
});
