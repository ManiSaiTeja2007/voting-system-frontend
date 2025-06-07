import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/voting-system-frontend/',
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: true,
  },
});