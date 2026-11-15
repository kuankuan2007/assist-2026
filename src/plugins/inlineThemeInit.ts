import { fileURLToPath } from 'node:url';
import { build as esbuild } from 'esbuild';

export default function VitePluginInlineThemeInit() {
  return {
    name: 'vite-plugin-inline-theme-init',
    transformIndexHtml: {
      order: 'pre',
      async handler() {
        const result = await esbuild({
          entryPoints: [fileURLToPath(import.meta.resolve('@kuankuan/assist-2026/theme/init'))],
          bundle: true,
          write: false,
          format: 'iife',
          platform: 'browser',
          minify: true,
        });
        return [{ tag: 'script', children: result.outputFiles[0]!.text, injectTo: 'head-prepend' }];
      },
    },
  };
}
