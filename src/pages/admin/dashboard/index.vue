<script setup lang="ts">
import { Motion } from 'motion-v'
import { ref, onMounted, computed } from 'vue'
import { getDashboardStats, getHotAttractions, getUserGrowthData } from '@/api/admin/dashboard'
import type { DashboardStatsResponse, HotAttractionsResponse, UserGrowthChartResponse, UserGrowthChartItem } from '@/types/apis/dashboard'
import type { DashboardStatsData, HotAttractionItem, UserItem } from '@/types/factory'
import { ElMessage } from 'element-plus'
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
import {
  User,
  Guide,
  Money,
  MapLocation,
  TrendCharts,
  Location,
  View,
  CaretTop
} from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const hotAttractionsLoading = ref(false)
const userGrowthLoading = ref(false)
const statsData = ref<DashboardStatsData | null>(null)
const hotAttractions = ref<HotAttractionItem[]>([])
const userGrowthData = ref<UserGrowthChartItem[]>([])

// 获取统计数据
const fetchStats = async () => {
  try {
    loading.value = true
    const response = await getDashboardStats()
    if (response.code === 200) {
      statsData.value = response.data
    } else {
      ElMessage.error(response.msg || '获取统计数据失败')
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 获取热门景点数据
const fetchHotAttractions = async () => {
  try {
    hotAttractionsLoading.value = true
    const response = await getHotAttractions()
    if (response.code === 200) {
      // 手动按访问量降序排序，并取前5个
      const sortedAttractions = response.data.attractions
        .sort((a, b) => b.visit_count - a.visit_count)
        .slice(0, 5)
      hotAttractions.value = sortedAttractions
    } else {
      ElMessage.error(response.msg || '获取热门景点数据失败')
    }
  } catch (error) {
    console.error('获取热门景点数据失败:', error)
    ElMessage.error('获取热门景点数据失败')
  } finally {
    hotAttractionsLoading.value = false
  }
}

// 获取用户增长数据
const fetchUserGrowthData = async () => {
  try {
    userGrowthLoading.value = true
    const response = await getUserGrowthData()
    if (response.code === 200) {
      userGrowthData.value = response.data.chart_data
    } else {
      ElMessage.error(response.msg || '获取用户增长数据失败')
    }
  } catch (error) {
    console.error('获取用户增长数据失败:', error)
    ElMessage.error('获取用户增长数据失败')
  } finally {
    userGrowthLoading.value = false
  }
}

// 计算属性 - 格式化数据
const formattedStats = computed(() => {
  if (!statsData.value) return null

  const { users, attractions, trips, revenue } = statsData.value

  return {
    totalUsers: {
      value: users?.total || 0,
      change: users?.new_this_month && users?.total ? `+${((users.new_this_month / users.total) * 100).toFixed(1)}%` : '0%',
      isPositive: (users?.new_this_month || 0) > 0
    },
    completedTrips: {
      value: trips?.completed || 0,
      change: trips?.total && trips?.completed ? `+${((trips.completed / trips.total) * 100).toFixed(1)}%` : '0%',
      isPositive: (trips?.completed || 0) > 0
    },
    totalAttractions: {
      value: attractions?.total || 0,
      change: attractions?.active && attractions?.total ? `+${((attractions.active / attractions.total) * 100).toFixed(1)}%` : '0%',
      isPositive: (attractions?.active || 0) > 0
    },
    monthlyRevenue: {
      value: revenue?.total || 0,
      change: (revenue?.total || 0) > 0 ? '+0%' : '0%',
      isPositive: (revenue?.total || 0) >= 0
    }
  }
})

// 计算属性 - 格式化热门景点数据
const formattedHotAttractions = computed(() => {
  return hotAttractions.value.map(item => ({
    id: item.id,
    name: item.name,
    location: `${item.city}${item.province ? ', ' + item.province : ''}`,
    visits: item.visit_count,
    rating: parseFloat(item.rating) || 0,
    category: item.category,
    tagType: item.visit_count > 100 ? 'danger' : 'info' // 根据访问量判断热门程度
  }))
})

// 计算属性 - 用户增长图表配置
const userGrowthChartOption = computed(() => {
  // userGrowthData 现在已经是格式化的数据
  const dates = userGrowthData.value.map(item => {
    // 使用 Date 对象解析日期字符串,添加类型检查
    const d: Date = new Date(item.date)
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
  const counts = userGrowthData.value.map(item => item.count)

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

// 生命周期
onMounted(() => {
  fetchStats()
  fetchHotAttractions()
  fetchUserGrowthData()
})

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.4, ease: ['easeOut'] }
}

const statsCardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: ['easeOut'] }
  },
  transition: { duration: 0.5, ease: ['easeOut'] }
}

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileHover: {
    scale: 1.2,
    rotate: 10,
    transition: { duration: 0.2, ease: ['easeOut'] }
  },
  transition: { duration: 0.6, delay: 0.3, ease: ['easeOut'] }
}
</script>

<template>
  <div class="dashboard">
    <!-- 仪表板页面 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">仪表板</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
              <el-button type="primary" size="small" :loading="loading || hotAttractionsLoading"
                @click="() => { fetchStats(); fetchHotAttractions(); }">刷新数据</el-button>
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" v-loading="loading">

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl cursor-pointer border border-blue-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <p class="text-blue-600 text-sm font-medium">总用户数</p>
                  <el-tag size="small" type="info" v-if="statsData?.users?.new_this_month">
                    本月新增 {{ statsData?.users?.new_this_month }}
                  </el-tag>
                </div>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-3xl font-bold text-blue-900 mb-1">{{ formattedStats?.totalUsers.value.toLocaleString()
                    || '--'
                  }}</p>
                </Motion>
                <div class="flex items-center space-x-2">
                  <p class="text-xs" :class="formattedStats?.totalUsers.isPositive ? 'text-blue-500' : 'text-gray-400'">
                    {{ formattedStats?.totalUsers.change || '--' }}
                  </p>
                  <span class="text-xs text-gray-500">较上月</span>
                </div>
                <div class="mt-2 text-xs text-blue-600" v-if="statsData?.users">
                  活跃用户: {{ statsData?.users?.active || 0 }} | 新用户: {{ statsData?.users?.new_this_month || 0 }}
                </div>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-blue-500">
                <div class="bg-blue-200 p-3 rounded-full">
                  <el-icon size="28">
                    <User />
                  </el-icon>
                </div>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl cursor-pointer border border-green-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <p class="text-green-600 text-sm font-medium">已完成行程</p>
                  <el-tag size="small" type="success" v-if="statsData?.trips?.total">
                    总计 {{ statsData?.trips?.total }}
                  </el-tag>
                </div>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-3xl font-bold text-green-900 mb-1">{{
                    formattedStats?.completedTrips.value.toLocaleString() ||
                    '--' }}</p>
                </Motion>
                <div class="flex items-center space-x-2">
                  <p class="text-xs"
                    :class="formattedStats?.completedTrips.isPositive ? 'text-green-500' : 'text-gray-400'">
                    {{ formattedStats?.completedTrips.change || '--' }}
                  </p>
                  <span class="text-xs text-gray-500">完成率</span>
                </div>
                <div class="mt-2 text-xs text-green-600" v-if="statsData?.trips">
                  进行中: {{ (statsData?.trips?.total - statsData?.trips?.completed) || 0 }} | 完成率: {{
                    statsData?.trips?.total >
                      0 ?
                      ((statsData?.trips?.completed / statsData?.trips?.total) * 100).toFixed(1) : 0 }}%
                </div>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-green-500">
                <div class="bg-green-200 p-3 rounded-full">
                  <el-icon size="28">
                    <Guide />
                  </el-icon>
                </div>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.6 } as any"
            class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl cursor-pointer border border-orange-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <p class="text-orange-600 text-sm font-medium">月收入</p>
                  <el-tag size="small" type="warning" v-if="statsData?.revenue?.total && statsData?.revenue?.total > 0">
                    本月
                  </el-tag>
                </div>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.9 }">
                  <p class="text-3xl font-bold text-orange-900 mb-1">¥{{
                    formattedStats?.monthlyRevenue.value.toLocaleString()
                    || '--' }}</p>
                </Motion>
                <div class="flex items-center space-x-2">
                  <p class="text-xs"
                    :class="formattedStats?.monthlyRevenue.isPositive ? 'text-orange-500' : 'text-gray-400'">
                    {{ formattedStats?.monthlyRevenue.change || '--' }}
                  </p>
                  <span class="text-xs text-gray-500">较上月</span>
                </div>
                <div class="mt-2 text-xs text-orange-600" v-if="statsData?.revenue">
                  平均订单: ¥{{ statsData?.trips?.total > 0 ? (statsData?.revenue?.total /
                    statsData?.trips?.total).toFixed(0) : 0
                  }} |
                  总收入: ¥{{ statsData?.revenue?.total?.toLocaleString() }}
                </div>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.7 } as any" class="text-orange-500">
                <div class="bg-orange-200 p-3 rounded-full">
                  <el-icon size="28">
                    <Money />
                  </el-icon>
                </div>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.7 } as any"
            class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl cursor-pointer border border-purple-200">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <p class="text-purple-600 text-sm font-medium">景点总数</p>
                  <el-tag size="small" type="primary" v-if="statsData?.attractions?.active">
                    活跃 {{ statsData?.attractions?.active }}
                  </el-tag>
                </div>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.8 }">
                  <p class="text-3xl font-bold text-purple-900 mb-1">{{
                    formattedStats?.totalAttractions.value.toLocaleString()
                    || '--' }}</p>
                </Motion>
                <div class="flex items-center space-x-2">
                  <p class="text-xs"
                    :class="formattedStats?.totalAttractions.isPositive ? 'text-purple-500' : 'text-gray-400'">
                    {{ formattedStats?.totalAttractions.change || '--' }}
                  </p>
                  <span class="text-xs text-gray-500">活跃率</span>
                </div>
                <div class="mt-2 text-xs text-purple-600" v-if="statsData?.attractions">
                  活跃: {{ statsData?.attractions?.active || 0 }} | 活跃率: {{ statsData?.attractions?.total > 0 ?
                    ((statsData?.attractions?.active / statsData?.attractions?.total) * 100).toFixed(1) : 0 }}%
                </div>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.8 } as any" class="text-purple-500">
                <div class="bg-purple-200 p-3 rounded-full">
                  <el-icon size="28">
                    <MapLocation />
                  </el-icon>
                </div>
              </Motion>
            </div>
          </Motion>

        </div>
      </el-card>
    </Motion>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.8 } as any">
        <el-card>
          <template #header>
            <span class="font-medium">用户增长趋势</span>
          </template>
          <div class="h-64" v-loading="userGrowthLoading">
            <VChart :option="userGrowthChartOption" class="w-full h-full" />
          </div>
        </el-card>
      </Motion>

      <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
        :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.9 } as any">
        <el-card class="overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="font-medium">热门景点排行</span>
                <el-tag size="small" type="success">TOP 5</el-tag>
              </div>
              <el-button type="primary" size="small" plain>查看更多</el-button>
            </div>
          </template>
          <div class="space-y-4" v-loading="hotAttractionsLoading">
            <Motion v-for="(item, index) in formattedHotAttractions" :key="item.id" :initial="{ opacity: 0, x: -20 }"
              :animate="{ opacity: 1, x: 0 }" :whileHover="{ x: 8, scale: 1.02 }"
              :transition="{ duration: 0.3, delay: 1.0 + index * 0.1 }"
              class="relative flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md cursor-pointer transition-all duration-300"
              :class="{
                'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200': index === 0,
                'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200': index === 1,
                'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200': index === 2,
                'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200': index >= 3
              }">
              <!-- 排名徽章 -->
              <div
                class="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                :class="{
                  'bg-gradient-to-r from-yellow-400 to-yellow-600': index === 0,
                  'bg-gradient-to-r from-gray-400 to-gray-600': index === 1,
                  'bg-gradient-to-r from-orange-400 to-orange-600': index === 2,
                  'bg-gradient-to-r from-blue-400 to-blue-600': index >= 3
                }">
                {{ index + 1 }}
              </div>

              <div class="flex items-center space-x-4 flex-1">
                <!-- 景点图标 -->
                <div class="flex items-center justify-center w-12 h-12 rounded-xl" :class="{
                  'bg-yellow-200 text-yellow-700': index === 0,
                  'bg-gray-200 text-gray-700': index === 1,
                  'bg-orange-200 text-orange-700': index === 2,
                  'bg-blue-200 text-blue-700': index >= 3
                }">
                  <el-icon size="24">
                    <MapLocation />
                  </el-icon>
                </div>

                <!-- 景点信息 -->
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-1">
                    <p class="font-semibold text-gray-900 text-base">{{ item.name }}</p>
                    <el-tag size="small" v-if="index < 3"
                      :type="index === 0 ? 'warning' : index === 1 ? 'info' : 'danger'">热门</el-tag>
                  </div>
                  <p class="text-sm text-gray-600 flex items-center">
                    <el-icon size="14" class="mr-1">
                      <Location />
                    </el-icon>
                    {{ item.location }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">{{ item.category }}</p>
                </div>
              </div>

              <!-- 访问数据 -->
              <div class="text-right">
                <div class="flex items-center space-x-2 mb-1">
                  <p class="font-bold text-lg" :class="{
                    'text-yellow-700': index === 0,
                    'text-gray-700': index === 1,
                    'text-orange-700': index === 2,
                    'text-blue-700': index >= 3
                  }">{{ item.visits.toLocaleString() }}</p>
                  <el-icon size="16" class="text-gray-400">
                    <View />
                  </el-icon>
                </div>
                <p class="text-xs text-gray-500">本月访问量</p>
                <!-- 评分信息 -->
                <div class="flex items-center justify-end mt-1 space-x-1" v-if="item.rating > 0">
                  <span class="text-xs text-orange-500">{{ item.rating.toFixed(1) }}分</span>
                </div>
                <!-- 访问趋势 -->
                <div class="flex items-center justify-end mt-1 space-x-1">
                  <el-icon size="12" class="text-green-500">
                    <CaretTop />
                  </el-icon>
                  <span class="text-xs text-green-500">+{{ (Math.random() * 20 + 5).toFixed(1) }}%</span>
                </div>
              </div>
            </Motion>
          </div>

          <!-- 底部统计 -->
          <div class="mt-6 pt-4 border-t border-gray-100">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-lg font-bold text-blue-600">{{formattedHotAttractions.reduce((sum, item) => sum +
                  item.visits,
                  0).toLocaleString() }}</p>
                <p class="text-xs text-gray-500">总访问量</p>
              </div>
              <div>
                <p class="text-lg font-bold text-green-600">{{formattedHotAttractions.length > 0 ?
                  (formattedHotAttractions.reduce((sum, item) => sum + item.visits, 0) /
                  formattedHotAttractions.length).toFixed(0) : '0' }}</p>
                <p class="text-xs text-gray-500">平均访问</p>
              </div>
              <div>
                <p class="text-lg font-bold text-purple-600">{{ formattedHotAttractions.length }}</p>
                <p class="text-xs text-gray-500">热门景点</p>
              </div>
            </div>
          </div>
        </el-card>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
}

/* 统计卡片增强样式 */
.cursor-pointer {
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.cursor-pointer:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 响应式动画优化 */
@media (prefers-reduced-motion: reduce) {
  .cursor-pointer {
    transition: none;
  }
}

/* 增强卡片视觉效果 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.el-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}
</style>