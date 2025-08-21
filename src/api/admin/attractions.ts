import type {
  AttractionApiResponse,
  AttractionListResponse,
  AttractionQueryParams,
  AttractionCreateRequest,
  AttractionUpdateRequest,
  ApiResponse
} from '@/types/factory'
import serviceAxios from '@/http'

// 获取景点列表
export function getAttractionsAPI(params: AttractionQueryParams): Promise<AttractionListResponse> {
  return serviceAxios({
    url: '/travel/admin/management/',
    method: 'get',
    params: {
      type: 'attractions',
      ...params
    }
  })
}

// 获取景点详情
export function getAttractionDetailAPI(id: number): Promise<AttractionApiResponse> {
  return serviceAxios({
    url: `/travel/admin/management/attraction/${id}/`,
    method: 'get'
  })
}

// 创建景点
export function createAttractionAPI(data: AttractionCreateRequest): Promise<ApiResponse> {
  return serviceAxios({
    url: '/travel/admin/management/',
    method: 'post',
    data
  })
}

// 更新景点
export function updateAttractionAPI(id: number, data: AttractionUpdateRequest): Promise<ApiResponse> {
  return serviceAxios({
    url: `/travel/admin/management/attraction/${id}/`,
    method: 'put',
    data
  })
}

// 删除景点
export function deleteAttractionAPI(id: number): Promise<ApiResponse> {
  return serviceAxios({
    url: `/travel/admin/management/attraction/${id}/`,
    method: 'delete'
  })
}

// 批量删除景点
export function batchDeleteAttractionsAPI(ids: number[]): Promise<ApiResponse> {
  return serviceAxios({
    url: '/travel/admin/management/attractions/batch-delete/',
    method: 'post',
    data: { ids }
  })
}

// 更新景点状态
export function updateAttractionStatusAPI(id: number, status: boolean): Promise<ApiResponse> {
  return serviceAxios({
    url: `/travel/admin/management/attraction/${id}/status/`,
    method: 'patch',
    data: { is_active: status }
  })
}