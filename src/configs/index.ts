import type { AdminHeader } from '@/types/factory'
import type { MenuItem } from '@/types/components/header'
import { defineAsyncComponent } from 'vue';

//获得资源服务地址
const FileUploadUrl: string = (import.meta.env.VITE_FILE_UPLOAD_URL as string)
  .startsWith("http") ? import.meta.env.VITE_FILE_UPLOAD_URL : window.location.protocol + "//" + window.location.host + "/api" + import.meta.env.VITE_FILE_UPLOAD_URL;

let VITE_APP_LOGO

try {
  VITE_APP_LOGO = defineAsyncComponent(() =>
    import(`@/components/icon/${import.meta.env.VITE_APP_LOGO}.vue`)
  )
} catch {
  VITE_APP_LOGO = null
}

// 主菜单配置（用于Header组件）
export const defaultMenuItems: MenuItem[] = [
  {
    id: "home",
    label: "menu.home",
    href: "/",
    icon: null,
  },
  {
    id: "planning",
    label: "menu.planning",
    href: "/planning",
    icon: null,
  },
  {
    id: "navigation",
    label: "menu.navigation",
    href: "/navigation",
    icon: null,
  },
  {
    id: "profile",
    label: "menu.profile",
    href: "/profile",
    icon: null,
  },
  {
    id: "admin",
    label: "menu.admin",
    href: "/admin",
    icon: null,
  },
];

// 管理后台菜单配置
export const adminMenuItems: AdminHeader[] = [
  {
    id: '1',
    title: '仪表板',
    icon: 'Odometer',
    path: '/admin/dashboard',
  },
  {
    id: '2',
    title: '用户管理',
    icon: 'User',
    path: '/admin/userManage',
  },
  {
    id: '3',
    title: '景点管理',
    icon: 'MapLocation',
    path: '/admin/attractions',
  },
  {
    id: '4',
    title: '路线管理',
    icon: 'Guide',
    path: '/admin/routes',
  },
  {
    id: '5',
    title: '数据分析',
    icon: 'TrendCharts',
    path: '/admin/analytics',
  },
  {
    id: '6',
    title: 'AI模型管理',
    icon: 'MagicStick',
    path: '/admin/ai-models',
    hide: true
  },
  {
    id: '9',
    title: '系统设置',
    icon: 'Tools',
    path: '/admin/settings',
    hide: true
  }
]

const serverConfig = {
  baseURL: '/api', // 请求基础地址,可根据环境自定义

  useTokenAuthorization: false, // 是否开启 token 认证

  FileUploadUrl,

  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,

  VITE_APP_LOGO: VITE_APP_LOGO ? VITE_APP_LOGO : () => null,

  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,

  SERVER_PATH: import.meta.env.VITE_SERVER_PATH || '/api',

  WEBSPCLET_PATH: import.meta.env.VITE_WEBSOCKET_PATH || '/api',
}
export default serverConfig
