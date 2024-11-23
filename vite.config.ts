import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import ElementPlus from "unplugin-element-plus/vite";
import type { ViteUserConfig } from "vitest/config";

const vitestConfig: ViteUserConfig  = {
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    css: true,
    deps: {
      inline: ["element-plus"],
    },
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ElementPlus({}),
    vue()
  ],
  test: vitestConfig.test,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../frontend/src/', import.meta.url)),
      public: fileURLToPath(new URL("./public", import.meta.url)),
    }
  },
  define: {
    'console.log': 'console.log', // Isso disponibiliza o `log` globalmente
  },
  css: {
    preprocessorOptions: {
      sass: {
        // Adicionar configurações globais para Sass, se necessário
        additionalData: `@import "@/styles/variables.scss";`,
        api: 'modern-compiler',
        silenceDeprecations: ["legacy-js-api"],
      },
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
});

