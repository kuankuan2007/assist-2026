import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(import.meta.dirname, '..', 'dist');

try {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log(`[clean] removed: ${distDir}`);
  } else {
    console.log(`[clean] skip (not found): ${distDir}`);
  }
} catch (error) {
  console.error(`[clean] failed: ${distDir}`);
  console.error(error);
  process.exitCode = 1;
}
