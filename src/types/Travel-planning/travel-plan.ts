// 旅行计划相关的类型定义

// 基础响应接口
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 旅行计划请求参数
export interface TravelPlanRequest {
  destination: string // 目的地
  start_date: string // 开始日期 YYYY-MM-DD
  end_date: string // 结束日期 YYYY-MM-DD
  budget: number // 预算金额
  preferences: string[] // 旅行偏好
  travel_style: string // 旅行风格
  max_attractions_per_day: number // 每日最大景点数
  transportation: string // 交通方式
  accessibility_needs: boolean // 无障碍需求
}

// 景点信息
export interface AttractionInfo {
  attraction_id: number
  attraction_name: string
  planned_start_time: string // 计划开始时间 HH:mm
  planned_duration: number // 计划游览时长（分钟）
  reason: string // 推荐理由
  price: number // 门票价格
  rating: number // 评分
}

// 每日行程
export interface DayPlan {
  day_number: number
  date: string // YYYY-MM-DD
  theme: string // 当日主题
  notes: string // 当日备注
  attractions: AttractionInfo[]
}

// 预算明细
export interface BudgetBreakdown {
  accommodation: number // 住宿费用
  food: number // 餐饮费用
  transportation: number // 交通费用
  tickets: number // 门票费用
  others: number // 其他费用
}

// 旅行计划详情
export interface TripPlan {
  title: string // 行程标题
  destination_city: string // 目的地城市
  start_date: string // 开始日期
  end_date: string // 结束日期
  traveler_count: number // 旅行人数
  estimated_budget: number // 预估总预算
  overview: string // 行程概述
  days: DayPlan[] // 每日行程安排
  budget_breakdown: BudgetBreakdown // 预算明细
  tips: string[] // 旅行小贴士
}

// 旅行计划响应
export interface TravelPlanResponse {
  trip_plan: TripPlan
  total_attractions: number // 总景点数量
}

// 表单数据接口
export interface PlanningFormData {
  destination: string // 目的地
  start_date: string // 开始日期
  end_date: string // 结束日期
  budget: number // 预算金额
  preferences: string[] // 旅行偏好
  travel_style: string // 旅行风格
  max_attractions_per_day: number // 每日最大景点数
  transportation: string // 交通方式
  accessibility_needs: boolean // 无障碍需求
}

// 行程展示数据类型（前端使用）
export interface RouteDay {
  day: number
  title: string
  activities: string[]
  meals?: string[]
  accommodation?: string
  transportation?: string
  notes?: string
}

// 错误响应类型
export interface ErrorResponse {
  code: number
  msg: string
  data?: any
}

// ========== 保存旅行计划相关类型 ==========

// 保存旅行计划请求 - 每日景点信息
export interface SaveTripAttractionRequest {
  attraction_id: number
  visit_order: number
  planned_start_time: string // HH:mm:ss 格式
  planned_duration: number // 分钟
  notes?: string
}

// 保存旅行计划请求 - 每日行程
export interface SaveTripDayRequest {
  date: string // YYYY-MM-DD 格式
  theme: string
  attractions: SaveTripAttractionRequest[]
}

// 保存旅行计划请求
export interface SaveTripPlanRequest {
  title: string
  destination: string
  start_date: string // YYYY-MM-DD 格式
  end_date: string // YYYY-MM-DD 格式
  budget: number
  description?: string
  days_data: SaveTripDayRequest[]
}

// 保存旅行计划响应 - 景点详情
export interface SavedTripAttraction {
  id: number
  attraction: {
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
  }
  visit_order: number
  planned_start_time: string
  planned_duration: number
  actual_start_time: string | null
  actual_duration: number | null
  notes: string
  is_completed: boolean
  trip_day: number
}

// 保存旅行计划响应 - 每日行程
export interface SavedTripDay {
  id: number
  attractions: SavedTripAttraction[]
  day_number: number
  date: string
  title: string
  notes: string | null
  trip: number
}

// 保存旅行计划响应 - 完整行程
export interface SavedTrip {
  id: number
  days: SavedTripDay[]
  user_name: string
  title: string
  destination_city: string
  start_date: string
  end_date: string
  total_budget: string
  actual_cost: string
  traveler_count: number
  status: string
  notes: string
  is_public: boolean
  created_at: string
  updated_at: string
  user: number
}

// 保存旅行计划响应
export interface SaveTripPlanResponse {
  code: number
  msg: string
  data: SavedTrip
}

// ========== 获取用户行程列表相关类型 ==========

// 用户行程列表响应
export interface GetUserTripsResponse {
  code: number
  msg: string
  data: {
    trips: SavedTrip[]
    pagination: {
      current_page: number
      total_pages: number
      total_count: number
      has_next: boolean
      has_previous: boolean
    }
  }
}

// 旅行偏好选项
export const TRAVEL_PREFERENCES = [
  '历史文化',
  '自然风光', 
  '美食体验',
  '购物娱乐',
  '休闲度假',
  '探险刺激',
  '亲子游乐',
  '摄影采风',
  '民俗体验',
  '宗教朝圣'
] as const

// 旅行风格选项
export const TRAVEL_STYLES = [
  '休闲',
  '深度',
  '快节奏',
  '奢华',
  '经济'
] as const

// 交通方式选项
export const TRANSPORTATION_OPTIONS = [
  '公共交通',
  '自驾',
  '步行',
  '出租车',
  '共享单车'
] as const

export type TravelPreference = typeof TRAVEL_PREFERENCES[number]
export type TravelStyle = typeof TRAVEL_STYLES[number]
export type TransportationOption = typeof TRANSPORTATION_OPTIONS[number]