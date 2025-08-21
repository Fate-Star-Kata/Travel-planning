import type { UserConfig } from 'vite'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig, loadEnv, mergeConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { devConfig } from './vite.config.dev'
import { prodConfig } from './vite.config.prod'
import autoprefixer from 'autoprefixer';


// 基础配置
const baseConfig: UserConfig = {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    VueRouter({
      routesFolder: 'src/pages',
      dts: './typed-router.d.ts',
    }),
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'components': resolve(__dirname, 'src/components'),
      'views': resolve(__dirname, 'src/views'),
      'stores': resolve(__dirname, 'src/stores'),
      'utils': resolve(__dirname, 'src/utils'),
      'assets': resolve(__dirname, 'src/assets'),
      'types': resolve(__dirname, 'src/types'),
      'constants': resolve(__dirname, 'src/constants'),
      'services': resolve(__dirname, 'src/services'),
      'icon': resolve(__dirname, 'src/components/icon/'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
  },
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  // 从环境变量获取后端地址
  const backendUrl = env.VITE_SERVER_PATH || 'localhost:8000'

  console.log(backendUrl);

  // 读取高德安全密钥（仅在代理中使用，避免在客户端暴露）
  const amapJsCode = env.VITE_AMAP_SECURITY_JS_CODE || env.VITE_GDMAP_SECURITY_JS_CODE || env.VITE_GDMAP_SECRET || ''

  const envConfig = {
    ...devConfig,
    server: {
      ...devConfig.server,
      proxy: {
        // 业务后端代理
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
        // 高德 JSAPI 安全代理：地图样式服务
        '/_AMapService/v4/map/styles': {
          target: 'https://webapi.amap.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path: string) => path.replace(/^\/_AMapService/, ''),
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any) => {
              if (!amapJsCode) return
              try {
                const url = new URL(proxyReq.path, 'https://dummy')
                url.searchParams.set('jscode', amapJsCode)
                proxyReq.path = url.pathname + url.search
              } catch {}
            })
          },
        },
        // 高德 JSAPI 安全代理：矢量底图服务
        '/_AMapService/v3/vectormap': {
          target: 'https://fmap01.amap.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path: string) => path.replace(/^\/_AMapService/, ''),
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any) => {
              if (!amapJsCode) return
              try {
                const url = new URL(proxyReq.path, 'https://dummy')
                url.searchParams.set('jscode', amapJsCode)
                proxyReq.path = url.pathname + url.search
              } catch {}
            })
          },
        },
        // 高德 Web 服务 API 代理（地理编码、路径规划等）
        '/_AMapService': {
          target: 'https://restapi.amap.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path: string) => path.replace(/^\/_AMapService/, ''),
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any) => {
              if (!amapJsCode) return
              try {
                const url = new URL(proxyReq.path, 'https://dummy')
                url.searchParams.set('jscode', amapJsCode)
                proxyReq.path = url.pathname + url.search
              } catch {}
            })
          },
        },
      },
    },
  }

  if (mode === 'development') {
    // 动态切换配置
    mergeConfig(baseConfig, devConfig)
  }
  else if (mode === 'production') {
    mergeConfig(baseConfig, prodConfig)
  }

  // 合并基础配置和环境配置
  const config = mergeConfig(baseConfig, envConfig)

  // 添加环境变量到 define
  config.define = {
    ...config.define,
    __APP_ENV__: JSON.stringify(env.VITE_APP_ENV || mode),
    __API_URL__: JSON.stringify(env.VITE_API_URL || ''),
    __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE || 'Vue App'),
    __BACKEND_URL__: JSON.stringify(backendUrl),
  }

  return config
})
