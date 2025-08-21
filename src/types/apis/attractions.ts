// 景点相关类型定义

// 后端返回的景点数据结构
export interface AttractionApiData {
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
  visit_count: number
}

// 前端使用的景点数据结构
export interface AttractionData {
  id: number | null
  name: string
  description: string
  category: string
  address: string
  city: string
  province: string
  latitude: number
  longitude: number
  ticketPrice: number
  openingHours: string
  visitDuration: number
  rating: number
  ratingCount: number
  images: string[]
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  visitCount: number
}

// 景点查询参数
export interface AttractionQueryParams {
  city?: string
  page: number
  pageSize?: number
  page_size?: number
  query?: string
  category?: string
}

// 创建景点请求参数
export interface AttractionCreateRequest {
  type: 'attraction'
  data: {
    name: string
    description: string
    category: string
    city: string
    province: string
    address: string
    latitude: number
    longitude: number
    ticket_price: number
    opening_hours: string
    visit_duration: number
    images: string[]
    tags: string[]
    is_active: boolean
    phone?: string
    website?: string
    rating?: number
  }
}

// 景点更新请求
export interface AttractionUpdateRequest {
  id: number
  name?: string
  description?: string
  category?: string
  city?: string
  province?: string
  address?: string
  latitude?: number
  longitude?: number
  ticket_price?: number
  opening_hours?: string
  visit_duration?: number
  images?: string[]
  tags?: string[]
  is_active?: boolean
  phone?: string
  website?: string
  rating?: number
}

// 分页信息
export interface PaginationInfo {
  current_page: number
  total_pages: number
  total_count: number
  has_next: boolean
  has_previous: boolean
}

// 景点列表响应
export interface AttractionListResponse {
  code: number
  msg: string
  data: {
    attractions: AttractionApiData[]
    pagination: PaginationInfo
  }
}

// 景点详情响应
export interface AttractionApiResponse {
  code: number
  msg: string
  data: AttractionApiData
}

// 通用API响应
export interface ApiResponse {
  code: number
  msg: string
  data?: any
}

// 景点分类选项
export interface CategoryOption {
  label: string
  value: string
}

// 景点状态选项
export interface StatusOption {
  label: string
  value: string
}