import serviceAxios from '@/http'
import type {
  TravelPlanRequest,
  TravelPlanResponse,
  ApiResponse,
  PlanningFormData
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

// 移除getGroupSize函数，因为新API不需要traveler_count字段