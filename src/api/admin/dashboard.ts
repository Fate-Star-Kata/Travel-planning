import serviceAxios from '@/http'
import type { DashboardStatsResponse, HotAttractionsResponse, UserGrowthResponse, UserGrowthChartResponse, UserGrowthChartItem } from '@/types/apis/dashboard'

/**
 * 获取仪表盘统计数据
 */
export const getDashboardStats = (): Promise<DashboardStatsResponse> => {
  return serviceAxios({
    url: '/travel/admin/management/?type=statistics',
    method: 'GET'
  })
}

/**
 * 获取热门景点排行
 */
export const getHotAttractions = (): Promise<HotAttractionsResponse> => {
  return serviceAxios({
    url: '/travel/admin/management/?type=attractions&page=1&page_size=20',
    method: 'GET'
  })
}

/**
 * 获取用户增长数据
 */
export const getUserGrowthData = async (): Promise<UserGrowthChartResponse> => {
  // 获取用户数据
  const response: UserGrowthResponse = await serviceAxios({
    url: '/hzadmin/admin/user/users/?page=1&page_size=1000',
    method: 'GET'
  })

  // 处理用户数据，按日期统计
  const userItems = response.data.users || []
  const userStats = new Map<string, number>()

  // 获取最近30天的日期
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    userStats.set(dateStr, 0)
  }

  // 统计每天的用户注册数量
  userItems.forEach((user: any) => {
    if (user.date_joined && typeof user.date_joined === 'string') {
      const date = user.date_joined.split('T')[0]
      if (userStats.has(date)) {
        userStats.set(date, (userStats.get(date) || 0) + 1)
      }
    }
  })

  // 转换为数组格式
  const chartData: UserGrowthChartItem[] = []
  userStats.forEach((count, date) => {
    chartData.push({ date, count })
  })

  return {
    code: response.code || 200,
    msg: response.msg || 'success',
    data: {
      total: response.data.total || userItems.length,
      chart_data: chartData
    }
  }
}