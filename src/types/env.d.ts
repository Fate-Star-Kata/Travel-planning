/// <reference types="vite/client" />

// Vite 环境变量类型声明，确保在代码中访问 import.meta.env.* 时有完整的类型提示
interface ImportMetaEnv {
  readonly VITE_GDMAP_KEY: string
  readonly VITE_GDMAP_SECRET?: string

  // 兼容旧变量名
  readonly VITE_AMAP_SECURITY_JS_CODE?: string
  readonly VITE_GDMAP_SECURITY_JS_CODE?: string

  // 后端服务地址（代理目标）
  readonly VITE_SERVER_PATH?: string

  // 其他可能存在的变量，避免类型报错
  readonly [key: string]: any
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}