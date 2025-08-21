// 行程相关的类型定义

// 基础响应接口
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 分页信息
export interface Pagination {
  current_page: number
  total_pages: number
  total_count: number
  has_next: boolean
  has_previous: boolean
}

// 景点信息
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
}

// 行程景点
export interface TripAttraction {
  id: number
  attraction: Attraction
  visit_order: number
  planned_start_time: string
  planned_duration: number
  actual_start_time: string | null
  actual_duration: number | null
  notes: string | null
  is_completed: boolean
  trip_day: number
}

// 行程天数
export interface TripDay {
  id: number
  attractions: TripAttraction[]
  day_number: number
  date: string
  title: string
  notes: string | null
  trip: number
}

// 行程信息
export interface Trip {
  id: number
  days: TripDay[]
  user_name: string
  title: string
  destination_city: string
  start_date: string
  end_date: string
  total_budget: string
  actual_cost: string
  traveler_count: number
  status: 'completed' | 'active' | 'cancelled' | 'draft'
  notes: string
  is_public: boolean
  user: number
  attraction_count: number
}

// 行程列表响应
export interface TripsListResponse {
  trips: Trip[]
  pagination: Pagination
}

// 查询参数
export interface TripQueryParams {
  type: string
  status: string
  user_id: string
  page: number
  page_size: number
}

// 统计数据
export interface TripStats {
  totalTrips: number
  activeTrips: number
  totalBookings: number
  averageRating: number
}