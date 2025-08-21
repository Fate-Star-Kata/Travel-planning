<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Star,
  View,
  User,
  Calendar,
  TrendCharts,
  Delete,
  Search,
  Filter,
  Refresh
} from '@element-plus/icons-vue'
import { getAdminReviews, getReviewStats, deleteReview } from '@/api/admin/reviews'
import type { AdminReview, ReviewStats, GetAdminReviewsRequest } from '@/types/apis/reviews'

// 响应式数据
const loading = ref(false)
const reviewsLoading = ref(false)
const statsData = ref<ReviewStats>({
  total_reviews: 0,
  avg_rating: 0,
  rating_distribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
  pending_reviews: 0,
  approved_reviews: 0,
  rejected_reviews: 0,
  today_reviews: 0,
  growth_rate: 0
})
const reviewsList = ref<AdminReview[]>([])
const pagination = ref({
  current_page: 1,
  total_pages: 1,
  total_count: 0,
  has_next: false,
  has_previous: false
})

// 查询参数
const searchParams = ref<GetAdminReviewsRequest>({
  page: 1,
  page_size: 10,
  query: '',
  attraction_id: ''
})

// 获取统计数据样本（最多100条用于统计计算）
const fetchStats = async () => {
  try {
    loading.value = true

    // 首先获取总评价数量
    const statsResponse = await getReviewStats()
    let totalReviews = 0
    if (statsResponse.code === 200 && statsResponse.data?.reviews?.total) {
      totalReviews = statsResponse.data.reviews.total
    }

    // 获取用于统计的样本数据（最多100条）
    const sampleSize = Math.min(totalReviews, 100)
    const sampleParams: GetAdminReviewsRequest = {
      page: 1,
      page_size: sampleSize > 0 ? sampleSize : 10
    }

    const sampleResponse = await getAdminReviews(sampleParams)
    if (sampleResponse.code === 200 && sampleResponse.data) {
      const sampleReviews = sampleResponse.data.reviews

      // 基于样本数据计算统计信息
      const ratingSum = sampleReviews.reduce((sum, review) => sum + review.rating, 0)
      const avgRating = sampleReviews.length > 0 ? parseFloat((ratingSum / sampleReviews.length).toFixed(1)) : 0

      // 计算评分分布
      const ratingDist: { '5': number; '4': number; '3': number; '2': number; '1': number;[key: string]: number } = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }
      sampleReviews.forEach(review => {
        const rating = review.rating.toString()
        if (ratingDist[rating] !== undefined) {
          ratingDist[rating]++
        }
      })

      // 计算今日评价数量
      const today = new Date().toISOString().split('T')[0]
      const todayCount = sampleReviews.filter(review => {
        const reviewDate = review.created_at.split('T')[0]
        return reviewDate === today
      }).length

      // 计算各状态评价数量（基于样本）
      const pendingCount = sampleReviews.filter(r => r.status === 'pending').length
      const approvedCount = sampleReviews.filter(r => r.status === 'approved').length
      const rejectedCount = sampleReviews.filter(r => r.status === 'rejected').length

      statsData.value = {
        total_reviews: totalReviews,
        avg_rating: avgRating,
        rating_distribution: ratingDist,
        pending_reviews: pendingCount,
        approved_reviews: approvedCount,
        rejected_reviews: rejectedCount,
        today_reviews: todayCount,
        growth_rate: 0 // 增长率需要历史数据计算，暂时设为0
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

// 获取评价列表
const fetchReviews = async () => {
  try {
    reviewsLoading.value = true
    const response = await getAdminReviews(searchParams.value)
    if (response.code === 200 && response.data) {
      reviewsList.value = response.data.reviews
      pagination.value = response.data.pagination
    }
  } catch (error) {
    console.error('获取评价列表失败:', error)
    ElMessage.error('获取评价列表失败')
  } finally {
    reviewsLoading.value = false
  }
}

// 计算今日新增评价数量（使用统计数据）
const todayReviewsCount = computed(() => {
  return statsData.value.today_reviews
})

// 格式化统计数据
const formattedStats = computed(() => [
  {
    title: '总评价数',
    value: statsData.value.total_reviews.toLocaleString(),
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    change: `+${statsData.value.growth_rate.toFixed(1)}%`,
    changeColor: statsData.value.growth_rate >= 0 ? 'text-green-600' : 'text-red-600'
  },
  {
    title: '平均评分',
    value: statsData.value.avg_rating.toFixed(1),
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    change: '★',
    changeColor: 'text-yellow-600'
  },
  {
    title: '今日新增',
    value: todayReviewsCount.value.toLocaleString(),
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    change: '条评价',
    changeColor: 'text-green-600'
  }
])

// 格式化评分分布数据（基于统计样本）
const ratingDistribution = computed(() => {
  const distribution = statsData.value.rating_distribution
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)

  return Object.entries(distribution)
    .map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0'
    }))
    .reverse() // 5星到1星排序
})



// 删除评价
const handleDelete = async (review: AdminReview) => {
  try {
    await ElMessageBox.confirm('确定要删除这条评价吗？删除后无法恢复。', '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    })

    const response = await deleteReview(review.id)
    if (response.code === 200) {
      ElMessage.success('评价删除成功')
      await fetchReviews()
      await fetchStats()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除评价失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 搜索和筛选
const handleSearch = () => {
  searchParams.value.page = 1
  fetchReviews()
}

const handleReset = () => {
  searchParams.value = {
    page: 1,
    page_size: 10
  }
  fetchReviews()
}

// 分页处理
const handlePageChange = (page: number) => {
  searchParams.value.page = page
  fetchReviews()
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

// 动画配置
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const statsCardVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
}

// 生命周期
onMounted(() => {
  fetchStats()
  fetchReviews()
})
</script>

<template>
  <div class="reviews-management">
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">评价管理</h1>
      <p class="text-gray-600">管理用户评价，审核评价内容，查看评价统计</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Motion v-for="(stat, index) in formattedStats" :key="stat.title" v-bind="statsCardVariants"
        :style="{ transitionDelay: `${index * 0.1}s` }">
        <el-card class="cursor-pointer hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div :class="[stat.bgColor, 'p-3 rounded-xl']">
                <el-icon :size="24" :class="stat.iconColor">
                  <component :is="stat.icon" />
                </el-icon>
              </div>
              <div>
                <p class="text-sm text-gray-600 mb-1">{{ stat.title }}</p>
                <p :class="[stat.color, 'text-2xl font-bold']">{{ stat.value }}</p>
              </div>
            </div>
            <div class="text-right">
              <p :class="[stat.changeColor, 'text-sm font-medium']">{{ stat.change }}</p>
            </div>
          </div>
        </el-card>
      </Motion>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 评价列表 -->
      <div class="lg:col-span-2">
        <Motion v-bind="cardVariants">
          <el-card>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <el-icon>
                    <Star />
                  </el-icon>
                  <span class="font-semibold">评价列表</span>
                </div>
                <div class="flex items-center space-x-2">
                  <el-button size="small" :icon="Refresh" @click="fetchReviews" :loading="reviewsLoading">
                    刷新
                  </el-button>
                </div>
              </div>
            </template>

            <!-- 搜索和筛选 -->
            <div class="mb-4 space-y-4">
              <div class="flex flex-wrap gap-4">
                <!-- 后端搜索字段 后续会调整 -->
                <el-input v-model="searchParams.attraction_id" placeholder="搜索评价内容或用户名" :prefix-icon="Search"
                  style="width: 200px" clearable @keyup.enter="handleSearch" />
                <el-select v-model="searchParams.rating" placeholder="评分筛选" style="width: 120px" clearable>
                  <el-option label="5星" :value="5" />
                  <el-option label="4星" :value="4" />
                  <el-option label="3星" :value="3" />
                  <el-option label="2星" :value="2" />
                  <el-option label="1星" :value="1" />
                </el-select>


                <el-button type="primary" :icon="Search" @click="handleSearch">
                  搜索
                </el-button>
                <el-button :icon="Filter" @click="handleReset">
                  重置
                </el-button>
              </div>
            </div>

            <!-- 评价列表 -->
            <div v-loading="reviewsLoading" class="space-y-4">
              <div v-for="review in reviewsList" :key="review.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2">
                      <el-icon>
                        <User />
                      </el-icon>
                      <span class="font-medium">{{ review.user_name }}</span>
                    </div>

                  </div>
                  <div class="flex items-center space-x-2">
                    <el-rate :model-value="review.rating" disabled size="small" show-score />
                  </div>
                </div>

                <div class="mb-3">
                  <p class="text-sm text-gray-600 mb-1">景点：{{ review.attraction_name }}</p>
                  <h4 v-if="review.title" class="font-medium mb-2">{{ review.title }}</h4>
                  <p class="text-gray-800 leading-relaxed">{{ review.content }}</p>
                </div>

                <div class="flex items-center justify-between text-sm text-gray-500">
                  <div class="flex items-center space-x-4">
                    <span>{{ formatDate(review.created_at) }}</span>
                    <span v-if="review.visit_date">游玩日期：{{ review.visit_date }}</span>
                    <span>点赞：{{ review.likes_count }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <el-button size="small" type="danger" :icon="Delete" @click="handleDelete(review)">
                      删除
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 空状态 -->
              <div v-if="!reviewsLoading && reviewsList.length === 0" class="text-center py-8">
                <el-icon size="48" class="text-gray-400 mb-4">
                  <Star />
                </el-icon>
                <p class="text-gray-500">暂无评价数据</p>
              </div>
            </div>

            <!-- 分页 -->
            <div v-if="pagination.total_count > 0" class="mt-6 flex justify-center">
              <el-pagination :current-page="pagination.current_page" :page-size="searchParams.page_size || 10"
                :total="pagination.total_count" layout="total, prev, pager, next, jumper"
                @current-change="handlePageChange" />
            </div>
          </el-card>
        </Motion>
      </div>

      <!-- 评分分布 -->
      <div>
        <Motion v-bind="cardVariants" :style="{ transitionDelay: '0.2s' }">
          <el-card>
            <template #header>
              <div class="flex items-center space-x-2">
                <el-icon>
                  <TrendCharts />
                </el-icon>
                <span class="font-semibold">评分分布</span>
              </div>
            </template>

            <div class="space-y-4">
              <div v-for="item in ratingDistribution" :key="item.rating" class="flex items-center space-x-3">
                <div class="flex items-center space-x-1 w-12">
                  <span class="text-sm font-medium">{{ item.rating }}</span>
                  <el-icon size="14" class="text-yellow-500">
                    <Star />
                  </el-icon>
                </div>
                <div class="flex-1">
                  <div class="bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${item.percentage}%` }"></div>
                  </div>
                </div>
                <div class="text-sm text-gray-600 w-16 text-right">
                  {{ item.count }} ({{ item.percentage }}%)
                </div>
              </div>
            </div>

            <!-- 总体评分 -->
            <div class="mt-6 pt-4 border-t border-gray-100 text-center">
              <div class="text-3xl font-bold text-yellow-600 mb-1">
                {{ statsData.avg_rating.toFixed(1) }}
              </div>
              <div class="text-sm text-gray-600 mb-2">平均评分</div>
              <el-rate :model-value="statsData.avg_rating" disabled show-score score-template="{value} 分" />
              <div class="text-xs text-gray-500 mt-2">
                基于 {{ statsData.total_reviews }} 条评价
              </div>
            </div>
          </el-card>
        </Motion>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reviews-management {
  width: 100%;
}

/* 统计卡片增强样式 */
.cursor-pointer {
  cursor: pointer;
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

/* 评价项样式 */
.border {
  transition: box-shadow 0.2s ease;
}

.border:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>