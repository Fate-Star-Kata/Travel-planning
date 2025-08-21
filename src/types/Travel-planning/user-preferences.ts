// 用户偏好相关类型定义

// 用户偏好数据
export interface UserPreferences {
  id: number
  preferred_categories: string[]
  budget_range: string
  travel_style: string
  max_daily_attractions: number
  preferred_transport: string[]
  accessibility_needs: string[]
  created_at: string
  updated_at: string
  user: number
}

// 更新用户偏好请求
export interface UpdateUserPreferencesRequest {
  preferred_categories: string[]
  budget_range: string
  travel_style: string
  transportation_preference?: string
  accommodation_level?: string
}

// 获取用户偏好响应
export interface GetUserPreferencesResponse {
  code: number
  msg: string
  data: UserPreferences
}

// 更新用户偏好响应
export interface UpdateUserPreferencesResponse {
  code: number
  msg: string
  data: UserPreferences
}

// 偏好选项常量
export const PREFERENCE_CATEGORIES = [
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

export const TRAVEL_STYLES = [
  '休闲游',
  '深度游',
  '快节奏',
  '奢华游',
  '经济游'
] as const

export const BUDGET_RANGES = [
  '1000以下',
  '1000-3000',
  '3000-8000',
  '8000-15000',
  '15000以上'
] as const

export const TRANSPORTATION_PREFERENCES = [
  '公共交通',
  '自驾',
  '步行',
  '出租车',
  '共享单车'
] as const

export const ACCOMMODATION_LEVELS = [
  '经济型',
  '舒适型',
  '豪华型',
  '五星级',
  '特色民宿'
] as const

export type PreferenceCategory = typeof PREFERENCE_CATEGORIES[number]
export type TravelStyle = typeof TRAVEL_STYLES[number]
export type BudgetRange = typeof BUDGET_RANGES[number]
export type TransportationPreference = typeof TRANSPORTATION_PREFERENCES[number]
export type AccommodationLevel = typeof ACCOMMODATION_LEVELS[number]