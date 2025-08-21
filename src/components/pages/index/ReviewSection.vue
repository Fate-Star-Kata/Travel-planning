<template>
  <div class="h-full flex flex-col">
    <!-- 评价标题和统计 -->
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-base-content mb-2">用户评价</h3>
      <div v-if="reviewStats" class="text-sm text-base-content/70">
        共 {{ reviewStats.total }} 条评价
      </div>
    </div>

    <!-- 排序选择 -->
    <div class="mb-4">
      <select v-model="sortBy" @change="() => loadReviews()" class="select select-bordered select-sm w-full max-w-xs">
        <option value="latest">最新发布</option>
        <option value="rating_high">评分从高到低</option>
        <option value="rating_low">评分从低到高</option>
      </select>
    </div>

    <!-- 发表评价按钮 -->
    <div class="mb-4">
      <button @click="showCreateForm = !showCreateForm" class="btn btn-primary btn-sm w-full">
        {{ showCreateForm ? '取消评价' : '发表评价' }}
      </button>
    </div>

    <!-- 发表评价表单和评价列表容器 -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- 发表评价表单 -->
      <div v-show="showCreateForm" class="border border-base-300 rounded-lg flex-1 overflow-y-auto">
        <div class="p-4">
          <form @submit.prevent="submitReview" class="space-y-4">
            <div>
              <label class="label label-text text-sm">评分</label>
              <div class="rating rating-sm">
                <input v-for="i in 5" :key="i" 
                       type="radio" 
                       :name="`new-rating-${attractionId}`" 
                       class="mask mask-star-2 bg-orange-400" 
                       :value="i"
                       v-model="newReview.rating">
              </div>
            </div>
            <div>
              <label class="label label-text text-sm">标题（可选）</label>
              <input v-model="newReview.title" 
                     type="text" 
                     placeholder="评价标题" 
                     class="input input-bordered input-sm w-full">
            </div>
            <div>
              <label class="label label-text text-sm">评价内容</label>
              <textarea v-model="newReview.content" 
                        placeholder="分享您的体验..." 
                        class="textarea textarea-bordered textarea-sm w-full h-32 resize-none"
                        required></textarea>
            </div>
            <div>
              <label class="label label-text text-sm">游览日期（可选）</label>
              <input v-model="newReview.visit_date" 
                     type="date" 
                     class="input input-bordered input-sm w-full">
            </div>
            <div class="flex gap-2 sticky bottom-0 bg-base-100 pt-2">
              <button type="submit" 
                      :disabled="submitting || !newReview.rating || !newReview.content.trim()" 
                      class="btn btn-primary btn-sm flex-1">
                <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
                {{ submitting ? '提交中...' : '提交评价' }}
              </button>
              <button type="button" @click="resetForm" class="btn btn-ghost btn-sm">
                重置
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 评价列表容器 -->
      <div v-show="!showCreateForm" class="flex-1 flex flex-col min-h-0">
        <div ref="scrollContainer" class="flex-1 overflow-y-auto space-y-4" @scroll="handleScroll">
          <!-- 评价列表 -->
          <div v-if="loading" class="flex justify-center py-8">
            <div class="loading loading-spinner loading-md text-primary"></div>
          </div>
          <div v-else-if="reviews.length === 0" class="text-center py-8 text-base-content/50">
            暂无评价
          </div>
          <div v-else class="space-y-4">
            <div v-for="review in reviews" :key="review.id" class="border border-base-300 rounded-lg p-4">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <div class="font-medium text-base-content">{{ review.user.username }}</div>
                  <div class="text-xs text-base-content/50">{{ formatDate(review.created_at) }}</div>
                </div>
                <div class="rating rating-xs">
                  <input v-for="i in 5" :key="i" 
                         type="radio" 
                         :name="`rating-${review.id}`" 
                         class="mask mask-star-2 bg-orange-400" 
                         :checked="i <= review.rating" 
                         disabled>
                </div>
              </div>
              <div v-if="review.title" class="font-medium text-sm mb-1">{{ review.title }}</div>
              <div class="text-sm text-base-content/80 leading-relaxed">{{ review.content }}</div>
              <div v-if="review.visit_date" class="text-xs text-base-content/50 mt-2">
                游览日期: {{ review.visit_date }}
              </div>
            </div>
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore && !loading" class="text-center py-4">
            <button @click="loadMore" :disabled="loadingMore" class="btn btn-ghost btn-sm">
              <span v-if="loadingMore" class="loading loading-spinner loading-xs"></span>
              {{ loadingMore ? '加载中...' : '加载更多' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { getAttractionReviews, createAttractionReview } from '@/api/Travel-planning/attraction'
import type { Review, CreateReviewRequest } from '@/types/Travel-planning/attraction'
import { ElMessage } from 'element-plus'

interface Props {
  attractionId: number
}

const props = defineProps<Props>()

// 响应式数据
const scrollContainer = ref<HTMLElement>()
const reviews = ref<Review[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const submitting = ref(false)
const showCreateForm = ref(false)
const sortBy = ref<'latest' | 'rating_high' | 'rating_low'>('latest')
const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)

// 新评价表单数据
const newReview = reactive<CreateReviewRequest>({
  rating: 5,
  title: '',
  content: '',
  visit_date: ''
})

// 计算属性
const hasMore = computed(() => currentPage.value < totalPages.value)
const reviewStats = computed(() => ({
  total: totalCount.value
}))

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 加载评价列表
const loadReviews = async (reset = true) => {
  try {
    if (reset) {
      loading.value = true
      currentPage.value = 1
      reviews.value = []
    } else {
      loadingMore.value = true
    }

    const response = await getAttractionReviews(props.attractionId, {
      page: currentPage.value,
      page_size: 10,
      sort_by: sortBy.value
    })

    if (response.code === 200) {
      if (reset) {
        reviews.value = response.data.reviews
      } else {
        reviews.value.push(...response.data.reviews)
      }
      totalPages.value = response.data.pagination.total_pages
      totalCount.value = response.data.pagination.total_count
    } else {
      ElMessage.error(response.msg || '获取评价失败')
    }
  } catch (error) {
    console.error('获取评价失败:', error)
    ElMessage.error('获取评价失败')
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 加载更多
const loadMore = async () => {
  if (hasMore.value && !loadingMore.value) {
    currentPage.value++
    await loadReviews(false)
  }
}

// 提交评价
const submitReview = async () => {
  if (!newReview.rating || !newReview.content.trim()) {
    ElMessage.warning('请填写评分和评价内容')
    return
  }

  try {
    submitting.value = true
    const response = await createAttractionReview(props.attractionId, {
      ...newReview,
      content: newReview.content.trim()
    })

    if (response.code === 200) {
      ElMessage.success('评价发表成功')
      resetForm()
      showCreateForm.value = false
      // 重新加载评价列表
      await loadReviews()
    } else {
      ElMessage.error(response.msg || '发表评价失败')
    }
  } catch (error) {
    console.error('发表评价失败:', error)
    ElMessage.error('发表评价失败')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  newReview.rating = 5
  newReview.title = ''
  newReview.content = ''
  newReview.visit_date = ''
}

// 滚动处理函数
let scrollTimer: number | null = null
const handleScroll = () => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
  
  scrollTimer = setTimeout(() => {
    const container = scrollContainer.value
    if (!container || loadingMore.value || !hasMore.value) return
    
    const { scrollTop, scrollHeight, clientHeight } = container
    // 当滚动到距离底部50px时触发加载
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      loadMore()
    }
  }, 100) // 100ms 节流
}

// 组件挂载时加载评价
onMounted(() => {
  loadReviews()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
})
</script>

<style scoped>
/* 自定义样式 */
.rating input:checked ~ input,
.rating input:checked {
  --tw-bg-opacity: 1;
  background-color: rgb(251 146 60 / var(--tw-bg-opacity));
}
</style>
