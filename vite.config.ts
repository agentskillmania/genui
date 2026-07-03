import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({ rollupTypes: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'GenUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `genui.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd', '@ant-design/icons', 'echarts'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
