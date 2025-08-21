import serviceAxios from '@/http'
import type {
  GetUserPreferencesResponse,
  UpdateUserPreferencesRequest,
  UpdateUserPreferencesResponse
} from '@/types/Travel-planning/user-preferences'

/**
 * 获取当前用户的旅游偏好设置
 * @returns Promise<GetUserPreferencesResponse>
 */
export function getUserPreferences(): Promise<GetUserPreferencesResponse> {
  return serviceAxios({
    url: '/travel/client/user/preferences/',
    method: 'get',
    timeout: 10000
  })
}

/**
 * 更新/添加用户的旅游偏好设置
 * @param data 偏好设置数据
 * @returns Promise<UpdateUserPreferencesResponse>
 */
export function updateUserPreferences(data: UpdateUserPreferencesRequest): Promise<UpdateUserPreferencesResponse> {
  return serviceAxios({
    url: '/travel/client/user/preferences/',
    method: 'post',
    data,
    timeout: 10000
  })
}