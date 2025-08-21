import serviceAxios from '@/http'
import type {
  GetAdminReviewsRequest,
  GetAdminReviewsResponse,
  ReviewStatsResponse,
  UpdateReviewStatusRequest,
  UpdateReviewStatusResponse,
  DeleteReviewResponse,
  ReviewTrendResponse,
  PopularAttractionReviewsResponse
} from '@/types/apis/reviews'

/**
 * 获取管理员评价列表
 * @param params 查询参数
 */
export const getAdminReviews = (params: GetAdminReviewsRequest = {}): Promise<GetAdminReviewsResponse> => {
  return serviceAxios({
    url: '/travel/admin/management/',
    method: 'GET',
    params: {
      type: 'reviews',
      ...params
    }
  })
}

/**
 * 获取评价统计数据
 */
export const getReviewStats = (): Promise<ReviewStatsResponse> => {
  return serviceAxios({
    url: '/travel/admin/management/',
    method: 'GET',
    params: {
      type: 'statistics'
    }
  })
}

/**
 * 更新评价状态（审核/拒绝）
 * @param reviewId 评价ID
 * @param data 更新数据
 */
export const updateReviewStatus = (reviewId: number, data: UpdateReviewStatusRequest): Promise<UpdateReviewStatusResponse> => {
  return serviceAxios({
    url: `/travel/admin/management/`,
    method: 'PUT',
    data: {
      type: 'reviews',
      id: reviewId,
      ...data
    }
  })
}

/**
 * 删除评价
 * @param reviewId 评价ID
 */
export const deleteReview = (reviewId: number): Promise<DeleteReviewResponse> => {
  return serviceAxios({
    url: `/travel/admin/management/`,
    method: 'DELETE',
    data: {
      type: 'reviews',
      id: reviewId
    }
  })
}

/**
 * 获取评价趋势数据
 * @param period 时间周期 (7d, 30d, 90d)
 */
export const getReviewTrend = (period: string = '30d'): Promise<ReviewTrendResponse> => {
  return serviceAxios({
    url: '/travel/admin/reviews/trend/',
    method: 'GET',
    params: {
      period
    }
  })
}

/**
 * 获取热门景点评价统计
 * @param params 查询参数
 */
export const getPopularAttractionReviews = (params: { page?: number; page_size?: number } = {}): Promise<PopularAttractionReviewsResponse> => {
  return serviceAxios({
    url: '/travel/admin/attractions/popular-reviews/',
    method: 'GET',
    params
  })
}