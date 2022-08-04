import vue from '@vitejs/plugin-vue';
const path = require('path');
import AutoImport from 'unplugin-auto-import/vite';
export default {
  base: './',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'], // 自动导入vue和vue-router相关函数
      dts: 'src/auto-import.d.ts' // 生成 `auto-import.d.ts` 全局声明
    })
  ],
  server: {
    host: "0.0.0.0",
    open: '',
    hmr: true,
    proxy: { // 代理配置
      // '/api': 'http://172.16.8.99:8080',
      '/api': 'http://huiwang.dyproapp.click',
    },
  },
  resolve:{
    //设置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
      '*': path.resolve('')
      },
  },
  optimizeDeps: {
    include: ['schart.js']
  }
};
