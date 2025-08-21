import serviceAxios from '@/http'
import type { TripsListResponse, TripQueryParams, ApiResponse } from '@/types/apis/trips'

/**
 * 获取行程列表
 * @param params 查询参数
 */
export const getTripsList = async (params: TripQueryParams): Promise<ApiResponse<TripsListResponse>> => {
  return serviceAxios({
    url: '/travel/admin/management/',
    method: 'GET',
    params: {
      ...params,
      type: 'trips'
    }
  })
}

/**
 * 根据ID获取行程详情
 * @param id 行程ID
 */
export const getTripById = (id: number): Promise<any> => {
  return serviceAxios({
    url: `/travel/admin/management/trips/${id}/`,
    method: 'GET'
  })
}

/**
 * 创建新行程
 * @param data 行程数据
 */
export const createTrip = (data: any): Promise<any> => {
  return serviceAxios({
    url: '/travel/admin/management/trips/',
    method: 'POST',
    data
  })
}

/**
 * 更新行程
 * @param id 行程ID
 * @param data 更新数据
 */
export const updateTrip = (id: number, data: any): Promise<any> => {
  return serviceAxios({
    url: `/travel/admin/management/trips/${id}/`,
    method: 'PUT',
    data
  })
}

/**
 * 删除行程
 * @param id 行程ID
 */
export const deleteTrip = (id: number): Promise<any> => {
  return serviceAxios({
    url: `/travel/admin/management/trips/${id}/`,
    method: 'DELETE'
  })
}