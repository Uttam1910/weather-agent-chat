// postcss.config.js (ESM format, because of Vite + "type": "module")
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss, autoprefixer],
};
