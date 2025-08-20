// 用户管理相关类型定义
export interface User {
  id: number | null
  username: string
  email: string
  phone?: string
  avatar?: string
  memberLevel: 'basic' | 'silver' | 'gold' | 'diamond'
  travelPreference?: string[]
  totalTrips: number
  registrationDate: string
  lastLoginDate?: string
  status: 'active' | 'inactive' | 'frozen'
  is_active?: boolean // 兼容旧版本
  is_staff?: boolean // 兼容旧版本
  is_superuser?: boolean // 兼容旧版本
  date_joined?: string // 兼容旧版本
  last_login?: string // 兼容旧版本
}

// 景点管理相关类型定义
export interface Attraction {
  id: number | null
  name: string
  description: string
  location: {
    province: string
    city: string
    district?: string
    address: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  category: 'natural' | 'cultural' | 'historical' | 'modern' | 'entertainment' | 'religious'
  tags: string[]
  rating: number
  reviewCount: number
  ticketPrice: {
    adult: number
    child: number
    student: number
    senior: number
  }
  openingHours: {
    weekday: string
    weekend: string
    holiday?: string
  }
  facilities: string[]
  images: string[]
  visitDuration: number
  bestVisitTime: string[]
  accessibility: boolean
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: string
  updatedAt: string
}

// 路线管理相关类型定义
export interface Route {
  id: number | null
  name: string
  description: string
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'cultural' | 'natural' | 'adventure' | 'leisure' | 'family'
  attractions: string[]
  estimatedCost: number
  maxGroupSize: number
  tags: string[]
  itinerary: RouteDay[]
  status: 'active' | 'inactive' | 'draft'
  bookingCount: number
  rating: number
  createdAt: string
  updatedAt: string
}

export interface RouteDay {
  day: number
  title: string
  activities: string[]
  accommodation?: string
  meals: string[]
}

// 用户查询参数
export interface UserQueryParams {
  query: string
  memberLevel?: string
  status?: string
  page: number
  page_size: number
}

// 景点查询参数
export interface AttractionQueryParams {
  query: string
  category?: string
  province?: string
  city?: string
  status?: string
  page: number
  page_size: number
}

// 路线查询参数
export interface RouteQueryParams {
  query: string
  type?: string
  difficulty?: string
  status?: string
  page: number
  page_size: number
}

// 用户列表响应
export interface UserListResponse {
  data: {
    users: User[]
    total: number
  }
  message?: string
}

// API响应基础类型
export interface ApiResponse {
  message?: string
  msg?: string
  data?: any
}

// 表格列配置
export interface TableColumn {
  title: string
  dataIndex: string
  key?: string
  width?: string | number
  align?: 'left' | 'center' | 'right'
  scopedSlots?: any
}

// 管理员导航菜单项
export interface AdminMenuItem {
  id: string
  title: string
  icon?: string
  path: string
  hide?: boolean
  children?: AdminMenuItem[]
}

// 管理员头部组件类型
export interface AdminHeader {
  id: string
  title: string
  icon?: string
  path: string
  hide?: boolean
  children?: AdminHeader[]
}

// 分页配置
export interface PaginationConfig {
  total: number
  current: number
  pageSize: number
  showTotal: (total: number) => string
  onChange: (current: number, size: number) => void
}