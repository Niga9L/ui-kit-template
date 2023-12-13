import { defineConfig } from 'vite'
import { extname, relative, resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { glob } from 'glob';
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),dts({ include: ['src'] })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs']
    },
    rollupOptions: {
           external: ['react', 'react/jsx-runtime', 'src/**/*.stories.(tsx|ts)',/^src\/*\*\/*.stories.(tsx|ts)/, 'src/**/*.test.(tsx|ts)'],
      input: Object.fromEntries(
        glob.sync('src/**/*.{ts,tsx}').map(file => [
          // The name of the entry point
          // lib/nested/foo.ts becomes nested/foo
          relative(
            'src',
            file.slice(0, file.length - extname(file).length)
          ),
          // The absolute path to the entry file
          // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
          fileURLToPath(new URL(file, import.meta.url))
        ], { ignore: 'src/**/*.stories.tsx'}),
      ),
      output: {
             assetFileNames: 'assets/[name][extname]',
      entryFileNames: '[name].js',
     }
     },

  }
})
