import { execSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = (cmd) => execSync(cmd, { stdio: 'inherit', cwd: root });

rmSync(join(root, 'dist'), { recursive: true, force: true });

// ESM per-module output: dist/index.js + dist/**/*.d.ts
// (类型检查失败会让 tsc 以非零码退出，构建随之失败)
run('npx tsc -p tsconfig.json');

// CJS per-module output: dist/cjs/**
run('npx tsc -p tsconfig.build.cjs.json');

// 嵌套 package.json 使 Node 将 dist/cjs 下的 .js 视为 CommonJS
// （根 package.json 声明了 "type": "module"）
writeFileSync(
  join(root, 'dist/cjs/package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n',
);
