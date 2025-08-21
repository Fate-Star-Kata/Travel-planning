<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage } from 'element-plus'
import { getDashboardStats, getHotAttractions, getUserGrowthData } from '@/api/admin/dashboard'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])
import type {
  DashboardStatsData,
  HotAttractionItem,
  UserGrowthChartItem,
  UserStats as ApiUserStats,
  AttractionStats as ApiAttractionStats,
  TripStats,
  ReviewStats,
  RevenueStats as ApiRevenueStats
} from '@/types/apis/dashboard'

// 数据统计接口定义
interface AnalyticsData {
  userStats: ApiUserStats
  tripStats: TripStats
  attractionStats: ApiAttractionStats
  reviewStats: ReviewStats
  revenueStats: ApiRevenueStats
  userGrowthTrend: UserGrowthChartItem[]
  hotAttractions: HotAttractionItem[]
}

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

// 响应式数据
const loading = ref(false)
const dateRange = ref<[Date, Date]>([new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()])
const analyticsData = ref<AnalyticsData>({
  userStats: {
    total: 0,
    active: 0,
    new_this_month: 0,
    inactive: 0
  },
  tripStats: {
    total: 0,
    totalBookings: 0,
    completed: 0,
    ongoing: 0,
    planning: 0
  },
  attractionStats: {
    total: 0,
    active: 0,
    inactive: 0,
    avg_rating: 0
  },
  reviewStats: {
    total: 0,
    avg_rating: 0
  },
  revenueStats: {
    total: 0
  },
  userGrowthTrend: [],
  hotAttractions: []
})



// 获取分析数据
const getAnalyticsData = async () => {
  try {
    loading.value = true

    // 并行获取所有数据
    const [statsResponse, attractionsResponse, userGrowthResponse] = await Promise.all([
      getDashboardStats(),
      getHotAttractions(),
      getUserGrowthData()
    ])

    // 更新数据
    analyticsData.value = {
      userStats: statsResponse.data.users,
      tripStats: {
        ...statsResponse.data.trips,
        totalBookings: statsResponse.data.trips?.totalBookings || statsResponse.data.trips?.total || 0
      },
      attractionStats: statsResponse.data.attractions,
      reviewStats: statsResponse.data.reviews,
      revenueStats: statsResponse.data.revenue,
      userGrowthTrend: userGrowthResponse.data.chart_data,
      hotAttractions: attractionsResponse.data.attractions.sort((a: any, b: any) => (b.visit_count || 0) - (a.visit_count || 0))
    }

  } catch (error) {
    console.error('获取分析数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = () => {
  getAnalyticsData()
}

// 导出报告
const exportReport = () => {
  ElMessage.success('报告导出功能开发中...')
}

// 格式化数字
const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === null) {
    return '0'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

// 获取位置文本
const getLocationText = (row: any) => {
  const parts = []
  if (row.city) parts.push(row.city)
  if (row.province && row.province !== row.city) parts.push(row.province)
  if (parts.length === 0 && row.address) {
    // 如果没有城市和省份信息，使用地址的前20个字符
    return row.address.length > 20 ? row.address.substring(0, 20) + '...' : row.address
  }
  return parts.join(', ') || '未知位置'
}

// 格式化金额
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined || amount === null) {
    return '¥0'
  }
  if (amount >= 10000) {
    return '¥' + (amount / 10000).toFixed(1) + '万'
  }
  return '¥' + amount.toLocaleString()
}

// 格式化百分比
const formatPercentage = (rate: number | undefined) => {
  if (rate === undefined || rate === null) {
    return '0%'
  }
  const sign = rate >= 0 ? '+' : ''
  return sign + rate.toFixed(1) + '%'
}

// 用户增长图表配置
const userGrowthChartOption = computed(() => {
  const chartData = analyticsData.value.userGrowthTrend || []

  const dates = chartData.map(item => {
    const d = new Date(item.date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
  const counts = chartData.map(item => item.count)

  return {
    title: {
      text: '用户增长趋势（最近30天）',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.axisValue}<br/>新增用户: ${data.value}人`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12
      }
    },
    series: [{
      name: '新增用户',
      type: 'line',
      data: counts,
      smooth: true,
      lineStyle: {
        color: '#409EFF'
      },
      itemStyle: {
        color: '#409EFF'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(64, 158, 255, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(64, 158, 255, 0.1)'
          }]
        }
      }
    }]
  }
})

// 组件挂载时获取数据
onMounted(() => {
  getAnalyticsData()
})
</script>

<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any"
    class="analytics-page">
    <div class="analytics-container">
      <!-- 页面头部 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <div class="page-header">
          <div class="header-left">
            <h2 class="page-title">数据分析</h2>
            <p class="page-subtitle">智能旅游平台运营数据概览</p>
          </div>
          <div class="header-right">
            <el-space>
              <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" size="default" />
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button @click="refreshData" :loading="loading">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  刷新数据
                </el-button>
              </Motion>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button type="primary" @click="exportReport">
                  <el-icon>
                    <Download />
                  </el-icon>
                  导出报告
                </el-button>
              </Motion>
            </el-space>
          </div>
        </div>
      </Motion>

      <!-- 核心指标卡片 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }">
        <el-row :gutter="24" class="metrics-row">
          <!-- 用户统计 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
              <el-card class="metric-card user-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#409EFF">
                      <User />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">总用户数</h3>
                    <p class="metric-value">{{ formatNumber(analyticsData.userStats.total) }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <ArrowUp />
                      </el-icon>
                      {{ formatPercentage(0) }}
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>活跃用户: {{ formatNumber(analyticsData.userStats.active) }}</span>
                  <span>本月新增: {{ analyticsData.userStats.new_this_month }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 路线统计 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.2 } as any">
              <el-card class="metric-card route-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#67C23A">
                      <MapLocation />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">总预订数</h3>
                    <p class="metric-value">{{ formatNumber(analyticsData.tripStats.totalBookings) }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <ArrowUp />
                      </el-icon>
                      {{ formatPercentage(0) }}
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>总行程: {{ analyticsData.tripStats.total }}</span>
                  <span>进行中: {{ analyticsData.tripStats.ongoing }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 景点统计 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
              <el-card class="metric-card attraction-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#E6A23C">
                      <Location />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">景点总数</h3>
                    <p class="metric-value">{{ formatNumber(analyticsData.attractionStats.total) }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <ArrowUp />
                      </el-icon>
                      {{ formatPercentage(0) }}
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>活跃景点: {{ analyticsData.attractionStats.active }}</span>
                  <span>平均评分: {{ analyticsData.attractionStats.avg_rating }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 收入统计 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.4 } as any">
              <el-card class="metric-card revenue-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#F56C6C">
                      <Money />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">月收入</h3>
                    <p class="metric-value">{{ formatCurrency(analyticsData.revenueStats.total) }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <ArrowUp />
                      </el-icon>
                      {{ formatPercentage(0) }}
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>总收入: {{ formatCurrency(analyticsData.revenueStats.total) }}</span>
                  <span>客单价: {{ formatCurrency(0) }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>
        </el-row>
      </Motion>

      <!-- 图表区域 -->
      <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }">
        <el-row :gutter="24" class="charts-row">
          <!-- 用户增长趋势 -->
          <el-col :xs="24" :lg="16">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>用户增长趋势</h3>
                  <el-tag type="info" size="small">近30天</el-tag>
                </div>
              </template>
              <div class="chart-container" v-loading="loading">
                <div class="trend-chart">
                  <VChart :option="userGrowthChartOption" style="height: 450px; width: 100%;" autoresize />
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 评论统计 -->
          <el-col :xs="24" :lg="8">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>评论统计</h3>
                  <el-tag type="success" size="small">实时</el-tag>
                </div>
              </template>
              <div class="chart-container" v-loading="loading">
                <div class="review-stats">
                  <div class="review-item">
                    <div class="review-info">
                      <span class="review-label">总评论数</span>
                      <span class="review-value">{{ formatNumber(analyticsData.reviewStats.total) }}</span>
                    </div>
                  </div>
                  <div class="review-item">
                    <div class="review-info">
                      <span class="review-label">平均评分</span>
                      <span class="review-value">{{ analyticsData.reviewStats.avg_rating }}</span>
                    </div>
                  </div>
                  <div class="review-item">
                    <div class="review-info">
                      <span class="review-label">今日新增</span>
                      <span class="review-value">{{ 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </Motion>

      <!-- 热门景点排行 -->
      <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.6 }">
        <el-row :gutter="24" class="tables-row">
          <el-col :xs="24">
            <el-card class="table-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>热门景点排行</h3>
                  <el-tag type="warning" size="small">TOP 10</el-tag>
                </div>
              </template>
              <div class="table-container" v-loading="loading">
                <el-table :data="analyticsData.hotAttractions.slice(0, 10)" stripe>
                  <el-table-column label="排名" width="80" align="center">
                    <template #default="{ $index }">
                      <el-tag :type="$index === 0 ? 'danger' : $index === 1 ? 'warning' : 'info'" size="small">
                        {{ $index + 1 }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="景点名称" prop="name" min-width="150" />
                  <el-table-column label="访问量" prop="visit_count" width="100" align="center">
                    <template #default="{ row }">
                      <span class="visit-count">{{ formatNumber(row.visit_count) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="评分" prop="rating" width="120" align="center">
                    <template #default="{ row }">
                      <el-rate :model-value="parseFloat(row.rating)" disabled show-score />
                    </template>
                  </el-table-column>
                  <el-table-column label="位置" min-width="150">
                    <template #default="{ row }">
                      <span class="location-text">{{ getLocationText(row) }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>


        </el-row>
      </Motion>
    </div>
  </Motion>
</template>

<style scoped>
.analytics-page {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
}

.analytics-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 0;
}

.header-left .page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.header-left .page-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 指标卡片 */
.metrics-row {
  margin-bottom: 24px;
}

.metric-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.metric-content {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.metric-icon {
  margin-right: 16px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(64, 158, 255, 0.1);
}

.user-card .metric-icon {
  background: rgba(64, 158, 255, 0.1);
}

.route-card .metric-icon {
  background: rgba(103, 194, 58, 0.1);
}

.attraction-card .metric-icon {
  background: rgba(230, 162, 60, 0.1);
}

.revenue-card .metric-icon {
  background: rgba(245, 108, 108, 0.1);
}

.metric-info {
  flex: 1;
}

.metric-title {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
}

.metric-change {
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-change.positive {
  color: #67C23A;
}

.metric-change.negative {
  color: #F56C6C;
}

.metric-detail {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

/* 图表区域 */
.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  border-radius: 12px;
  border: none;
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-container {
  height: 480px;
  width: 100%;
}

.trend-chart {
  width: 100%;
  height: 100%;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.chart-placeholder p {
  margin: 8px 0 4px 0;
  font-size: 16px;
  font-weight: 500;
}

.chart-note {
  font-size: 12px !important;
  color: #C0C4CC !important;
}

/* 评论统计 */
.review-stats {
  width: 100%;
  padding: 20px 0;
}

.review-item {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.review-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.review-value {
  font-size: 18px;
  color: #303133;
  font-weight: 600;
}

/* 表格区域 */
.tables-row {
  margin-bottom: 24px;
}

.table-card {
  border-radius: 12px;
  border: none;
}

.table-container {
  min-height: 300px;
}

.visit-count {
  font-weight: 600;
  color: #409EFF;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analytics-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-right {
    width: 100%;
  }

  .metric-value {
    font-size: 20px;
  }

  .chart-container {
    height: 250px;
  }
}

/* 表格样式 */
.visit-count {
  font-weight: 600;
  color: #409EFF;
}

.location-text {
  color: #606266;
  font-size: 13px;
}

/* 卡片阴影效果 */
.el-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
</style>