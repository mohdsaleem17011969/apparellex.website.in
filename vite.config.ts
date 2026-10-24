import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Safely resolve directory name in ESM with multiple environment fallbacks
const getDirname = (): string => {
  try {
    // Node.js 20.11+ / modern ESM
    if (typeof import.meta !== 'undefined') {
      if (import.meta.dirname) {
        return import.meta.dirname;
      }
      if (import.meta.url) {
        return path?.dirname ? path.dirname(fileURLToPath(import.meta.url)) : fileURLToPath(new URL('.', import.meta.url));
      }
    }
  } catch {
    // Fall back to runtime detection
  }

  try {
    // Fallback if __dirname is globally defined (e.g. CJS bundled)
    if (typeof __dirname !== 'undefined') {
      return __dirname;
    }
    // Fallback if process.cwd() is available
    if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
      return process.cwd();
    }
  } catch {
    // Fall back to relative root
  }

  return '.';
};

const currentDir = getDirname();

// Fallback resolver if 'path' module or 'path.resolve' is missing in the environment
const safeResolve = (dir: string, subPath: string): string => {
  try {
    if (path && typeof path.resolve === 'function') {
      return path.resolve(dir, subPath);
    }
  } catch {
    // Continue to fallback
  }

  // Safe manual resolution fallback when path is missing
  const cleanDir = dir ? dir.replace(/[/\\]+$/, '') : '.';
  const cleanSub = subPath ? subPath.replace(/^[/\\]+/, '') : '';
  if (!cleanSub || cleanSub === '.') return cleanDir;
  return `${cleanDir}/${cleanSub}`;
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': safeResolve(currentDir, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  };
});
