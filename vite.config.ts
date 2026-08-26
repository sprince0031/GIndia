import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BASE_URL || '/GIndia/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
