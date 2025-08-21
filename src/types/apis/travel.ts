// 旅游相关的类型定义

// 基础响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页响应接口
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 用户相关类型
export interface User {
  id: number
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
  createdAt: string
  updatedAt: string
}

// 景点相关类型
export interface Attraction {
  id: number
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
  visitDuration: number // 建议游览时间（小时）
  bestVisitTime: string[]
  accessibility: boolean
  status: 'active' | 'inactive' | 'maintenance'
  createdAt: string
  updatedAt: string
}

// 路线相关类型
export interface Route {
  id: number
  name: string
  description: string
  duration: number // 天数
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'cultural' | 'natural' | 'adventure' | 'leisure' | 'family'
  attractions: string[] // 景点ID数组
  estimatedCost: number
  maxGroupSize: number
  tags: string[]
  itinerary: RouteDay[]
  status: 'active' | 'inactive' | 'draft'
  bookingCount: number
  rating: number
  images: string[]
  highlights: string[]
  includes: string[]
  excludes: string[]
  requirements: string[]
  cancellationPolicy: string
  createdAt: string
  updatedAt: string
}

// 行程天数接口
export interface RouteDay {
  day: number
  title: string
  activities: string[]
  accommodation?: string
  meals: string[]
  transportation?: string
  notes?: string
}

// 预订相关类型
export interface Booking {
  id: number
  userId: number
  routeId: number
  bookingDate: string
  travelDate: string
  groupSize: number
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  contactInfo: {
    name: string
    phone: string
    email: string
  }
  specialRequests?: string
  createdAt: string
  updatedAt: string
}

// 评价相关类型
export interface Review {
  id: number
  userId: number
  targetId: number // 景点或路线ID
  targetType: 'attraction' | 'route'
  rating: number
  title: string
  content: string
  images?: string[]
  tags?: string[]
  helpful: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

// AI推荐相关类型
export interface AIRecommendation {
  id: number
  userId: number
  preferences: {
    budget: number
    duration: number
    travelStyle: string[]
    interests: string[]
    groupType: 'solo' | 'couple' | 'family' | 'friends'
  }
  recommendations: {
    routes: Route[]
    attractions: Attraction[]
    confidence: number
    reasons: string[]
  }
  feedback?: {
    rating: number
    comment?: string
  }
  createdAt: string
}

// 数据分析相关类型
export interface AnalyticsData {
  userStats: UserStats
  routeStats: RouteStats
  attractionStats: AttractionStats
  revenueStats: RevenueStats
  userGrowthTrend: TrendData[]
  popularRoutes: PopularRoute[]
  userDistribution: UserDistribution[]
  deviceStats: DeviceStats
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  userGrowthRate: number
}

export interface RouteStats {
  totalRoutes: number
  activeRoutes: number
  totalBookings: number
  bookingGrowthRate: number
}

export interface AttractionStats {
  totalAttractions: number
  popularAttractions: number
  averageRating: number
  ratingGrowthRate: number
}

export interface RevenueStats {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowthRate: number
  averageOrderValue: number
}

export interface TrendData {
  date: string
  value: number
}

export interface PopularRoute {
  id: number
  name: string
  bookings: number
  revenue: number
  rating: number
}

export interface UserDistribution {
  region: string
  count: number
  percentage: number
}

export interface DeviceStats {
  mobile: number
  desktop: number
  tablet: number
}

// 查询参数类型
export interface UserQueryParams {
  query?: string
  memberLevel?: string
  status?: string
  page: number
  pageSize: number
}

export interface AttractionQueryParams {
  query?: string
  category?: string
  province?: string
  city?: string
  page: number
  pageSize: number
}

export interface RouteQueryParams {
  query?: string
  type?: string
  difficulty?: string
  status?: string
  page: number
  pageSize: number
}

export interface BookingQueryParams {
  userId?: number
  routeId?: number
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  page: number
  pageSize: number
}

// 表单数据类型
export interface UserFormData {
  username: string
  email: string
  phone?: string
  memberLevel: string
  travelPreference?: string[]
  status: string
}

export interface AttractionFormData {
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
  category: string
  tags: string[]
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
  visitDuration: number
  bestVisitTime: string[]
  accessibility: boolean
  status: string
}

export interface RouteFormData {
  name: string
  description: string
  duration: number
  difficulty: string
  type: string
  attractions: string[]
  estimatedCost: number
  maxGroupSize: number
  tags: string[]
  itinerary: RouteDay[]
  highlights: string[]
  includes: string[]
  excludes: string[]
  requirements: string[]
  cancellationPolicy: string
  status: string
}

// 选项类型
export interface SelectOption {
  label: string
  value: string | number
}

export interface CascaderOption {
  label: string
  value: string
  children?: CascaderOption[]
}

// 地理位置相关
export interface Province {
  code: string
  name: string
  cities: City[]
}

export interface City {
  code: string
  name: string
  districts?: District[]
}

export interface District {
  code: string
  name: string
}

// 文件上传相关
export interface UploadFile {
  id: string
  name: string
  url: string
  size: number
  type: string
  status: 'uploading' | 'success' | 'error'
}

// 系统配置相关
export interface SystemConfig {
  id: number
  key: string
  value: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'json'
  category: string
  updatedAt: string
}

// 通知相关
export interface Notification {
  id: number
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  targetType: 'all' | 'user' | 'admin'
  targetId?: number
  status: 'draft' | 'published' | 'archived'
  readCount: number
  createdAt: string
  updatedAt: string
}

// 操作日志相关
export interface OperationLog {
  id: number
  userId: number
  username: string
  action: string
  resource: string
  resourceId?: number
  details: string
  ip: string
  userAgent: string
  createdAt: string
}