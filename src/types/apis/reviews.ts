// 管理员评价相关类型定义

// 评价用户信息
export interface ReviewUser {
  id: number
  username: string
  avatar?: string
}

// 管理员评价列表项
export interface AdminReview {
  id: number
  user_name: string
  attraction_name: string
  rating: number
  title?: string
  content: string
  visit_date?: string
  likes_count: number
  created_at: string
  is_anonymous: boolean
  status?: 'pending' | 'approved' | 'rejected'
  images?: string[]
}

// 获取管理员评价列表请求参数
export interface GetAdminReviewsRequest {
  page?: number
  page_size?: number
  attraction_id?: number | string
  rating?: number
  status?: 'pending' | 'approved' | 'rejected'
  search?: string
  query?: string
}

// 获取管理员评价列表响应
export interface GetAdminReviewsResponse {
  code: number
  msg: string
  data: {
    reviews: AdminReview[]
    pagination: {
      current_page: number
      total_pages: number
      total_count: number
      has_next: boolean
      has_previous: boolean
    }
  }
}

// 评价统计数据
export interface ReviewStats {
  total_reviews: number
  avg_rating: number
  rating_distribution: {
    '5': number
    '4': number
    '3': number
    '2': number
    '1': number
    [key: string]: number // 添加索引签名以支持字符串索引
  }
  pending_reviews: number
  approved_reviews: number
  rejected_reviews: number
  today_reviews: number
  growth_rate: number
  reviews?: {
    total?: number
    avg_rating?: string | number
    rating_distribution?: {
      '5': number
      '4': number
      '3': number
      '2': number
      '1': number
      [key: string]: number
    }
    pending?: number
    approved?: number
    rejected?: number
    today?: number
    growth_rate?: number
  }
}

// 评价统计响应
export interface ReviewStatsResponse {
  code: number
  msg: string
  data: ReviewStats
}

// 更新评价状态请求
export interface UpdateReviewStatusRequest {
  status: 'approved' | 'rejected'
  reason?: string
}

// 更新评价状态响应
export interface UpdateReviewStatusResponse {
  code: number
  msg: string
  data?: {
    id: number
    status: string
  }
}

// 删除评价响应
export interface DeleteReviewResponse {
  code: number
  msg: string
  data?: any
}

// 评价趋势数据
export interface ReviewTrendData {
  date: string
  count: number
  avg_rating: number
}

// 评价趋势响应
export interface ReviewTrendResponse {
  code: number
  msg: string
  data: {
    trend_data: ReviewTrendData[]
    period: string
  }
}

// 热门景点评价统计
export interface PopularAttractionReview {
  attraction_id: number
  attraction_name: string
  total_reviews: number
  avg_rating: number
  latest_review_date: string
}

// 热门景点评价统计响应
export interface PopularAttractionReviewsResponse {
  code: number
  msg: string
  data: {
    attractions: PopularAttractionReview[]
    pagination?: {
      current_page: number
      total_pages: number
      total_count: number
      has_next: boolean
      has_previous: boolean
    }
  }
}