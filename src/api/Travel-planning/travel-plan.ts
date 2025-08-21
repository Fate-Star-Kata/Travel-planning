import serviceAxios from '@/http'
import type {
  TravelPlanRequest,
  TravelPlanResponse,
  ApiResponse,
  PlanningFormData,
  SaveTripPlanRequest,
  SaveTripPlanResponse,
  GetUserTripsResponse
} from '@/types/Travel-planning/travel-plan'

/**
 * 生成旅行计划API
 * @param data 旅行计划请求参数
 * @returns Promise<ApiResponse<TravelPlanResponse>>
 */
export function generateTravelPlan(data: TravelPlanRequest): Promise<ApiResponse<TravelPlanResponse>> {
  return serviceAxios({
    url: '/travel/client/generate-trip-plan/',
    method: 'post',
    data,
    timeout: 20000 // 旅行计划生成需要更长时间，设置20秒超时
  })
}

/**
 * 将前端表单数据转换为API请求格式
 * @param formData 前端表单数据
 * @returns TravelPlanRequest
 */
export function transformFormDataToRequest(formData: PlanningFormData): TravelPlanRequest {
  return {
    destination: formData.destination,
    start_date: formData.start_date,
    end_date: formData.end_date,
    budget: formData.budget,
    preferences: formData.preferences,
    travel_style: formData.travel_style,
    max_attractions_per_day: formData.max_attractions_per_day,
    transportation: formData.transportation,
    accessibility_needs: formData.accessibility_needs
  }
}

/**
 * 保存旅行计划API
 * @param data 保存旅行计划请求参数
 * @returns Promise<SaveTripPlanResponse>
 */
export function saveTripPlan(data: SaveTripPlanRequest): Promise<SaveTripPlanResponse> {
  return serviceAxios({
    url: '/travel/client/save-trip-plan/',
    method: 'post',
    data,
    timeout: 10000
  })
}

/**
 * 获取当前用户的所有行程列表API
 * @returns Promise<GetUserTripsResponse>
 */
export function getUserTrips(): Promise<GetUserTripsResponse> {
  return serviceAxios({
    url: '/travel/client/trips/',
    method: 'get',
    timeout: 10000
  })
}

/**
 * 将TripPlan转换为SaveTripPlanRequest格式
 * @param tripPlan 旅行计划数据
 * @param formData 表单数据
 * @returns SaveTripPlanRequest
 */
export function transformTripPlanToSaveRequest(
  tripPlan: import('@/types/Travel-planning/travel-plan').TripPlan,
  formData: PlanningFormData
): SaveTripPlanRequest {
  return {
    title: tripPlan.title,
    destination: tripPlan.destination_city,
    start_date: tripPlan.start_date,
    end_date: tripPlan.end_date,
    budget: formData.budget,
    description: tripPlan.overview || '',
    days_data: tripPlan.days.map(day => ({
      date: day.date,
      theme: day.theme,
      attractions: day.attractions.map(attraction => ({
        attraction_id: attraction.attraction_id,
        visit_order: day.attractions.indexOf(attraction) + 1,
        planned_start_time: attraction.planned_start_time + ':00', // 转换为HH:mm:ss格式
        planned_duration: attraction.planned_duration,
        notes: attraction.reason || ''
      }))
    }))
  }
}

// 移除getGroupSize函数，因为新API不需要traveler_count字段