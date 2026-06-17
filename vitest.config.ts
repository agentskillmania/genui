import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

// 测试必须用 React 的 development 构建：production 构建不导出 `act`，
// 会导致 @testing-library/react 报 "React.act is not a function"。
// shell 环境可能设了 NODE_ENV=production，这里强制覆盖。
process.env.NODE_ENV = 'development';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,tsx}'],
    setupFiles: ['test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/components/index.ts', 'src/**/types.ts', 'src/index.ts'],
      thresholds: {
        branches: 90,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
