import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import viteImagemin from 'vite-plugin-imagemin'
import stylelint from 'vite-plugin-stylelint'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { dayjs } from 'element-plus'

export default defineConfig(({ mode }) => {
  const version = dayjs().format('YYYYMMDDHHmm')
  const folder = `aaa/${mode}/${version}`
  const publicDir = `https://aliyun/pro/${folder}` // 发布远程地址
  const config = loadEnv(mode, process.cwd()) // 加载环境变量
  console.log('config', mode, config)
  return {
    base: mode === 'production' ? publicDir : '/',
    plugins: [
      vue(),
      vueDevTools(),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 80,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
        webp: {
          quality: 80,
        },
      }),
      stylelint({
        fix: true,
        include: ['src/**/*.{vue,less,css}'],
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // 如果需要全局变量，可以在这里添加
          // additionalData: `@import "@/assets/styles/variables.less";`
        },
      },
      // 确保 PostCSS 配置被应用
      postcss: {
        plugins: [
          // 这里可以是空的，因为我们已经在 postcss.config.js 中配置了插件
        ],
      },
    },
    // 图片资源优化配置
    build: {
      assetsInlineLimit: 4096, // 小于4kb的图片会被base64内联
      // rollupOptions: {
      //   output: {
      //     // 自定义图片输出目录
      //     assetFileNames: (assetInfo) => {
      //       if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
      //       const info = assetInfo.name.split('.')
      //       let extType = info[info.length - 1]
      //       if (/\.(png|jpe?g|gif|svg|webp|ico)(\?.*)?$/.test(assetInfo.name)) {
      //         extType = 'img'
      //       }
      //       return `assets/${extType}/[name]-[hash][extname]`
      //     },
      //     // 自定义 chunk 输出目录
      //     chunkFileNames: 'assets/js/[name]-[hash].js',
      //     entryFileNames: 'assets/js/[name]-[hash].js'
      //   }
      // }
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: config.VITE_API_SERVER,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/\/api/, ''),
        },
      },
    },
  }
})
