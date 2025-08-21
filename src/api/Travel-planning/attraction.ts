import serviceAxios from '@/http'
import type { 
  GetAttractionsResponse, 
  GetAttractionDetailResponse, 
  AddFavoriteRequest, 
  AddFavoriteResponse,
  GetFavoritesRequest,
  GetFavoritesResponse,
  RemoveFavoriteResponse,
  GetReviewsRequest,
  GetReviewsResponse,
  CreateReviewRequest,
  CreateReviewResponse,
  GetUserProfileResponse
} from '@/types/Travel-planning/attraction'

/**
 * 获取景点列表
 */
export const getAttractions = (): Promise<GetAttractionsResponse> => {
  return serviceAxios({
    url: '/travel/client/attractions/',
    method: 'GET'
  })
}

/**
 * 获取景点详情
 * @param attractionId 景点ID
 */
export const getAttractionDetail = (attractionId: number): Promise<GetAttractionDetailResponse> => {
  return serviceAxios({
    url: `/travel/client/attractions/${attractionId}/`,
    method: 'GET'
  })
}

/**
 * 添加景点到收藏列表
 * @param data 收藏请求数据
 */
export const addFavorite = (data: AddFavoriteRequest): Promise<AddFavoriteResponse> => {
  return serviceAxios({
    url: '/travel/client/favorites/',
    method: 'POST',
    data
  })
}

/**
 * 获取当前用户的景点收藏列表
 * @param params 分页参数
 */
export const getFavorites = (params: GetFavoritesRequest): Promise<GetFavoritesResponse> => {
  return serviceAxios({
    url: '/travel/client/favorites/',
    method: 'GET',
    params
  })
}

/**
 * 取消收藏景点
 * @param favoriteId 收藏记录ID
 */
export const removeFavorite = (favoriteId: number): Promise<RemoveFavoriteResponse> => {
  return serviceAxios({
    url: `/travel/client/favorites/${favoriteId}/`,
    method: 'DELETE'
  })
}

/**
 * 获取指定景点的用户评价列表
 * @param attractionId 景点ID
 * @param params 查询参数
 */
export const getAttractionReviews = (attractionId: number, params: GetReviewsRequest): Promise<GetReviewsResponse> => {
  return serviceAxios({
    url: `/travel/client/attractions/${attractionId}/reviews/`,
    method: 'GET',
    params
  })
}

/**
 * 为指定景点发表评价
 * @param attractionId 景点ID
 * @param data 评价数据
 */
export const createAttractionReview = (attractionId: number, data: CreateReviewRequest): Promise<CreateReviewResponse> => {
  return serviceAxios({
    url: `/travel/client/attractions/${attractionId}/reviews/`,
    method: 'POST',
    data
  })
}

/**
 * 获取当前用户的个人资料信息
 */
export const getUserProfile = (): Promise<GetUserProfileResponse> => {
  return serviceAxios({
    url: '/travel/client/user/profile/',
    method: 'GET'
  })
}