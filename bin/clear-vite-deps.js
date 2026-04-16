#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const viteCache = path.resolve(process.cwd(), 'node_modules', '.vite');
if (fs.existsSync(viteCache)) {
  fs.rmSync(viteCache, { recursive: true });
}
