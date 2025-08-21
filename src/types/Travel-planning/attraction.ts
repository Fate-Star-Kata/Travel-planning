// 景点基本信息接口
export interface Attraction {
  id: number
  name: string
  description: string
  category: string
  address: string
  city: string
  province: string
  latitude: string
  longitude: string
  ticket_price: string
  opening_hours: string
  visit_duration: number
  rating: string
  rating_count: number
  images: string[]
  tags: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  isFavorited?: boolean
}

// 景点详情接口（与基本信息相同）
export interface AttractionDetail extends Attraction {}

// 获取景点列表响应
export interface GetAttractionsResponse {
  code: number
  msg: string
  data: {
    attractions: Attraction[]
    is_recommendation: boolean
    pagination: {
      current_page: number
      total_pages: number
      total_count: number
      has_next: boolean
      has_previous: boolean
    }
  }
}

// 获取景点详情响应
export interface GetAttractionDetailResponse {
  code: number
  msg: string
  data: AttractionDetail
}

// 添加收藏请求
export interface AddFavoriteRequest {
  attraction_id: number
  notes?: string
}

// 添加收藏响应
export interface AddFavoriteResponse {
  code: number
  msg: string
  data: {
    id: number
  }
}

// 获取收藏列表请求参数
export interface GetFavoritesRequest {
  page: number
  page_size: number
}

// 收藏项接口
export interface FavoriteItem {
  id: number
  attraction: Attraction
  notes?: string
  created_at: string
}

// 获取收藏列表响应
export interface GetFavoritesResponse {
  code: number
  msg: string
  data: {
    favorites: FavoriteItem[]
    pagination: {
      current_page: number
      total_pages: number
      total_count: number
      has_next: boolean
      has_previous: boolean
    }
  }
}

// 取消收藏响应
export interface RemoveFavoriteResponse {
  code: number
  msg: string
  data?: any
}

// 用户信息接口
export interface User {
  id: number
  username: string
}

// 评价接口
export interface Review {
  id: number
  user: User
  rating: number
  title?: string
  content: string
  visit_date?: string
  images?: string[]
  created_at: string
}

// 获取评价列表请求参数
export interface GetReviewsRequest {
  page: number
  page_size: number
  sort_by: 'latest' | 'rating_high' | 'rating_low'
}

// 获取评价列表响应
export interface GetReviewsResponse {
  code: number
  msg: string
  data: {
    reviews: Review[]
    pagination: {
      current_page: number
      total_pages: number
      total_count: number
      has_next: boolean
      has_previous: boolean
    }
  }
}

// 创建评价请求
export interface CreateReviewRequest {
  rating: number
  title?: string
  content: string
  visit_date?: string
  images?: string[]
}

// 创建评价响应
export interface CreateReviewResponse {
  code: number
  msg: string
  data: {
    id: number
    rating: number
    title?: string
    content: string
  }
}

// 通用API响应接口
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data?: T
}

// 用户信息接口（API返回的用户信息）
export interface UserInfo {
  id: number
  username: string
  email: string
  date_joined: string
}

// 用户统计信息（API返回的统计数据）
export interface UserStatistics {
  trip_count: number
  favorite_count: number
  review_count: number
}

// 用户偏好设置
export interface UserPreferences {
  // 根据实际需求定义偏好设置字段
  [key: string]: any
}

// 获取用户个人资料响应
export interface GetUserProfileResponse {
  code: number
  msg: string
  data: {
    user_info: UserInfo
    statistics: UserStatistics
    preferences: UserPreferences | null
  }
}

// 用户统计信息
export interface UserStats {
  completedTrips: number
  visitedCities: number
  favoritesCount: number
}

// 用户资料
export interface UserProfile {
  name: string
  avatar: string
  joinDate: string
  stats: UserStats
}

// 菜单项
export interface MenuItem {
  key: string
  label: string
  icon: string
}

// 行程状态
export type TripStatus = 'completed' | 'ongoing' | 'upcoming' | 'planned'

// 行程项
export interface TripItem {
  id: string
  title: string
  dateRange: string
  status: TripStatus
  cover: string
}