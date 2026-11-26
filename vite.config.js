import path from 'node:path';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

// Для GitHub Pages сайт живе за адресою https://<user>.github.io/landing-keepsake-vite/,
// тому під час збірки всі шляхи мають починатися з base. У dev-режимі base - корінь.
export default ({ command }) => ({
  base: command === 'build' ? '/landing-keepsake-vite/' : '/',
  plugins: [
    vituum({
      imports: {
        filenamePattern: {
          '+.css': [],
          '+.scss': [],
        },
      },
    }),
    pug({ root: './src' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
  },
});
