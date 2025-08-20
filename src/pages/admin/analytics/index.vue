<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage } from 'element-plus'

// 数据统计接口定义
interface AnalyticsData {
  userStats: UserStats
  routeStats: RouteStats
  attractionStats: AttractionStats
  revenueStats: RevenueStats
  userGrowthTrend: TrendData[]
  popularRoutes: PopularRoute[]
  userDistribution: UserDistribution[]
  deviceStats: DeviceStats
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  userGrowthRate: number
}

interface RouteStats {
  totalRoutes: number
  activeRoutes: number
  totalBookings: number
  bookingGrowthRate: number
}

interface AttractionStats {
  totalAttractions: number
  popularAttractions: number
  averageRating: number
  ratingGrowthRate: number
}

interface RevenueStats {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowthRate: number
  averageOrderValue: number
}

interface TrendData {
  date: string
  value: number
}

interface PopularRoute {
  id: number
  name: string
  bookings: number
  revenue: number
  rating: number
}

interface UserDistribution {
  region: string
  count: number
  percentage: number
}

interface DeviceStats {
  mobile: number
  desktop: number
  tablet: number
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
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    userGrowthRate: 0
  },
  routeStats: {
    totalRoutes: 0,
    activeRoutes: 0,
    totalBookings: 0,
    bookingGrowthRate: 0
  },
  attractionStats: {
    totalAttractions: 0,
    popularAttractions: 0,
    averageRating: 0,
    ratingGrowthRate: 0
  },
  revenueStats: {
    totalRevenue: 0,
    monthlyRevenue: 0,
    revenueGrowthRate: 0,
    averageOrderValue: 0
  },
  userGrowthTrend: [],
  popularRoutes: [],
  userDistribution: [],
  deviceStats: {
    mobile: 0,
    desktop: 0,
    tablet: 0
  }
})

// 模拟数据
const mockAnalyticsData: AnalyticsData = {
  userStats: {
    totalUsers: 15420,
    activeUsers: 8960,
    newUsersToday: 156,
    userGrowthRate: 12.5
  },
  routeStats: {
    totalRoutes: 245,
    activeRoutes: 198,
    totalBookings: 3420,
    bookingGrowthRate: 18.3
  },
  attractionStats: {
    totalAttractions: 1280,
    popularAttractions: 89,
    averageRating: 4.6,
    ratingGrowthRate: 5.2
  },
  revenueStats: {
    totalRevenue: 2580000,
    monthlyRevenue: 456000,
    revenueGrowthRate: 15.8,
    averageOrderValue: 754
  },
  userGrowthTrend: [
    { date: '2024-01-01', value: 12500 },
    { date: '2024-01-05', value: 12800 },
    { date: '2024-01-10', value: 13200 },
    { date: '2024-01-15', value: 13800 },
    { date: '2024-01-20', value: 14500 },
    { date: '2024-01-25', value: 15100 },
    { date: '2024-01-30', value: 15420 }
  ],
  popularRoutes: [
    { id: 1, name: '北京经典三日游', bookings: 456, revenue: 547200, rating: 4.8 },
    { id: 2, name: '杭州西湖深度游', bookings: 389, revenue: 311200, rating: 4.6 },
    { id: 3, name: '张家界探险之旅', bookings: 234, revenue: 514800, rating: 4.9 },
    { id: 4, name: '厦门鼓浪屿文艺游', bookings: 298, revenue: 238400, rating: 4.5 },
    { id: 5, name: '云南大理丽江游', bookings: 345, revenue: 482300, rating: 4.7 }
  ],
  userDistribution: [
    { region: '华东地区', count: 4620, percentage: 30.0 },
    { region: '华北地区', count: 3850, percentage: 25.0 },
    { region: '华南地区', count: 2310, percentage: 15.0 },
    { region: '西南地区', count: 2156, percentage: 14.0 },
    { region: '华中地区', count: 1540, percentage: 10.0 },
    { region: '其他地区', count: 944, percentage: 6.0 }
  ],
  deviceStats: {
    mobile: 68.5,
    desktop: 25.2,
    tablet: 6.3
  }
}

// 获取分析数据
const getAnalyticsData = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    analyticsData.value = { ...mockAnalyticsData }
    
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
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

// 格式化金额
const formatCurrency = (amount: number) => {
  if (amount >= 10000) {
    return '¥' + (amount / 10000).toFixed(1) + '万'
  }
  return '¥' + amount.toLocaleString()
}

// 格式化百分比
const formatPercentage = (rate: number) => {
  const sign = rate >= 0 ? '+' : ''
  return sign + rate.toFixed(1) + '%'
}

// 计算设备使用统计
const deviceChartData = computed(() => {
  const { mobile, desktop, tablet } = analyticsData.value.deviceStats
  return [
    { name: '移动端', value: mobile, color: '#409EFF' },
    { name: '桌面端', value: desktop, color: '#67C23A' },
    { name: '平板端', value: tablet, color: '#E6A23C' }
  ]
})

// 组件挂载时获取数据
onMounted(() => {
  getAnalyticsData()
})
</script>

<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition"
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
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="default"
              />
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
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.1 }">
              <el-card class="metric-card user-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#409EFF">
                      <User />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">总用户数</h3>
                    <p class="metric-value">{{ formatNumber(analyticsData.userStats.totalUsers) }}</p>
                    <p class="metric-change positive">
                      <el-icon><ArrowUp /></el-icon>
                      {{ formatPercentage(analyticsData.userStats.userGrowthRate) }}
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>活跃用户: {{ formatNumber(analyticsData.userStats.activeUsers) }}</span>
                  <span>今日新增: {{ analyticsData.userStats.newUsersToday }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 路线统计 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.2 }">
              <el-card class="metric-card route-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#67C23A">
                      <MapLocation />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">总预订数</h3>
                    <p class="metric-value">{{ formatNumber(analyticsData.routeStats.totalBookings) }}</p>
                    <p class="metric-change positive">
                      <el-icon><ArrowUp /></el-icon>
                      {{ formatPercentage(analyticsData.routeStats.bookingGrowthRate) }}
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>总路线: {{ analyticsData.routeStats.totalRoutes }}</span>
                  <span>活跃路线: {{ analyticsData.routeStats.activeRoutes }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 景点统计 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.3 }">
              <el-card class="metric-card attraction-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#E6A23C">
                      <Location />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">景点总数</h3>
                    <p class="metric-value">{{ formatNumber(analyticsData.attractionStats.totalAttractions) }}</p>
                    <p class="metric-change positive">
                      <el-icon><ArrowUp /></el-icon>
                      {{ formatPercentage(analyticsData.attractionStats.ratingGrowthRate) }}
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>热门景点: {{ analyticsData.attractionStats.popularAttractions }}</span>
                  <span>平均评分: {{ analyticsData.attractionStats.averageRating }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 收入统计 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.4 }">
              <el-card class="metric-card revenue-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#F56C6C">
                      <Money />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">月收入</h3>
                    <p class="metric-value">{{ formatCurrency(analyticsData.revenueStats.monthlyRevenue) }}</p>
                    <p class="metric-change positive">
                      <el-icon><ArrowUp /></el-icon>
                      {{ formatPercentage(analyticsData.revenueStats.revenueGrowthRate) }}
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>总收入: {{ formatCurrency(analyticsData.revenueStats.totalRevenue) }}</span>
                  <span>客单价: {{ formatCurrency(analyticsData.revenueStats.averageOrderValue) }}</span>
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
                  <div class="chart-placeholder">
                    <el-icon size="48" color="#C0C4CC">
                      <TrendCharts />
                    </el-icon>
                    <p>用户增长趋势图</p>
                    <p class="chart-note">显示最近30天的用户增长情况</p>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 设备使用统计 -->
          <el-col :xs="24" :lg="8">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>设备使用分布</h3>
                  <el-tag type="success" size="small">实时</el-tag>
                </div>
              </template>
              <div class="chart-container" v-loading="loading">
                <div class="device-stats">
                  <div class="device-item" v-for="item in deviceChartData" :key="item.name">
                    <div class="device-info">
                      <span class="device-name">{{ item.name }}</span>
                      <span class="device-percentage">{{ item.value }}%</span>
                    </div>
                    <div class="device-bar">
                      <div class="device-progress" :style="{ width: item.value + '%', backgroundColor: item.color }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </Motion>

      <!-- 热门路线排行 -->
      <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.6 }">
        <el-row :gutter="24" class="tables-row">
          <el-col :xs="24" :lg="14">
            <el-card class="table-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>热门路线排行</h3>
                  <el-tag type="warning" size="small">TOP 5</el-tag>
                </div>
              </template>
              <div class="table-container" v-loading="loading">
                <el-table :data="analyticsData.popularRoutes" stripe>
                  <el-table-column label="排名" width="80" align="center">
                    <template #default="{ $index }">
                      <el-tag :type="$index === 0 ? 'danger' : $index === 1 ? 'warning' : 'info'" size="small">
                        {{ $index + 1 }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="路线名称" prop="name" min-width="150" />
                  <el-table-column label="预订数" prop="bookings" width="100" align="center">
                    <template #default="{ row }">
                      <span class="booking-count">{{ row.bookings }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="收入" prop="revenue" width="120" align="center">
                    <template #default="{ row }">
                      <span class="revenue-amount">{{ formatCurrency(row.revenue) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="评分" prop="rating" width="120" align="center">
                    <template #default="{ row }">
                      <el-rate :model-value="row.rating" disabled show-score />
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-card>
          </el-col>

          <!-- 用户地区分布 -->
          <el-col :xs="24" :lg="10">
            <el-card class="table-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>用户地区分布</h3>
                  <el-tag type="primary" size="small">按地区</el-tag>
                </div>
              </template>
              <div class="table-container" v-loading="loading">
                <div class="region-stats">
                  <div class="region-item" v-for="item in analyticsData.userDistribution" :key="item.region">
                    <div class="region-info">
                      <span class="region-name">{{ item.region }}</span>
                      <span class="region-count">{{ formatNumber(item.count) }}人</span>
                    </div>
                    <div class="region-bar">
                      <div class="region-progress" :style="{ width: item.percentage + '%' }"></div>
                      <span class="region-percentage">{{ item.percentage }}%</span>
                    </div>
                  </div>
                </div>
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
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 设备统计 */
.device-stats {
  width: 100%;
  padding: 20px 0;
}

.device-item {
  margin-bottom: 20px;
}

.device-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.device-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.device-percentage {
  font-size: 14px;
  color: #409EFF;
  font-weight: 600;
}

.device-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.device-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
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

.booking-count {
  font-weight: 600;
  color: #409EFF;
}

.revenue-amount {
  font-weight: 600;
  color: #67C23A;
}

/* 地区统计 */
.region-stats {
  padding: 20px 0;
}

.region-item {
  margin-bottom: 20px;
}

.region-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.region-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.region-count {
  font-size: 12px;
  color: #909399;
}

.region-bar {
  position: relative;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.region-progress {
  height: 100%;
  background: linear-gradient(90deg, #409EFF, #67C23A);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.region-percentage {
  position: absolute;
  right: 8px;
  top: -20px;
  font-size: 12px;
  color: #409EFF;
  font-weight: 600;
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

/* 卡片阴影效果 */
.el-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
</style>