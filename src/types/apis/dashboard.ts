// 仪表盘统计数据类型定义

// 用户统计数据
export interface UserStats {
  total: number
  active: number
  new_this_month: number
  inactive: number
}

// 景点统计数据
export interface AttractionStats {
  total: number
  active: number
  inactive: number
  avg_rating: number
}

// 行程统计数据
export interface TripStats {
  total: number
  totalBookings: number
  completed: number
  ongoing: number
  planning: number
}

// 评价统计数据
export interface ReviewStats {
  total: number
  avg_rating: number
}

// 收入统计数据
export interface RevenueStats {
  total: number
}

// 统计数据响应
export interface DashboardStatsData {
  users: UserStats
  attractions: AttractionStats
  trips: TripStats
  reviews: ReviewStats
  revenue: RevenueStats
}

// 统计数据API响应
export interface DashboardStatsResponse {
  code: number
  msg: string
  data: DashboardStatsData
}

// 热门景点数据
export interface HotAttractionItem {
  id: number
  name: string
  city: string
  province: string
  address: string
  visit_count: number
  rating: string
  category: string
}

// 热门景点响应数据
export interface HotAttractionsData {
  attractions: HotAttractionItem[]
  pagination: {
    current_page: number
    total_pages: number
    total_count: number
    has_next: boolean
    has_previous: boolean
  }
}

// 热门景点API响应
export interface HotAttractionsResponse {
  code: number
  msg: string
  data: HotAttractionsData
}

// 用户信息
export interface UserInfo {
  id: number
  avatar: string | null
  phone: string | null
  wechat: string | null
  qq: string | null
  weibo: string | null
  personal_site: string | null
  bio: string | null
  address: string | null
  birthday: string | null
  gender: string | null
  created_at: string
  updated_at: string
}

// 用户数据
export interface UserItem {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  date_joined: string
  last_login: string | null
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
  user_info: UserInfo
}

// 用户增长图表数据项
export interface UserGrowthChartItem {
  date: string
  count: number
}

// 用户增长响应数据
export interface UserGrowthData {
  page: number
  page_size: number
  total: number
  users: UserItem[]
}

// 用户增长图表响应数据
export interface UserGrowthChartData {
  total: number
  chart_data: UserGrowthChartItem[]
}

// 用户增长API响应
export interface UserGrowthResponse {
  code: number
  msg: string
  data: UserGrowthData
}

// 用户增长图表API响应
export interface UserGrowthChartResponse {
  code: number
  msg: string
  data: UserGrowthChartData
}