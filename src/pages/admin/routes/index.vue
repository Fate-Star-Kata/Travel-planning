<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Plus, Delete, MapLocation, Star, TrendCharts, View, User } from '@element-plus/icons-vue'
import Search from '@/components/icon/search.vue'
import type { Trip, TripQueryParams, TripsListResponse, TripStats } from '@/types/apis/trips'
import { getTripsList } from '@/api/admin/trips'
import serviceAxios from '@/http'

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

// 响应式数据
const loading = ref(false)
const list = ref<Trip[]>([])
const total = ref(0)
const isAdd = ref(false)

// 查询参数
const params = ref<TripQueryParams>({
  type: '',
  status: '',
  user_id: '',
  page: 1,
  page_size: 10
})

// 路线类型选项
const typeOptions = [
  { label: '行程', value: 'trips' }
]

// 状态选项
const statusOptions = [
  { label: '已完成', value: 'completed' },
  { label: '进行中', value: 'ongoing' },
  { label: '已取消', value: 'cancelled' },
  { label: '草稿', value: 'draft' }
]

// 获取行程列表
const getList = async () => {
  loading.value = true
  try {
    const response = await getTripsList(params.value)
    if (response.code === 200) {
      list.value = response.data.trips || []
      total.value = response.data.pagination?.total_count || 0
    } else {
      list.value = []
      total.value = 0
      ElMessage.error(response.msg || '获取数据失败')
    }
  } catch (error) {
    console.error('获取行程列表失败:', error)
    list.value = []
    total.value = 0
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const search = () => {
  params.value.page = 1
  getList()
  getStats()
}

// 重置参数
const resetParams = () => {
  params.value.page = 1
  params.value.user_id = ''
  params.value.type = ''
  params.value.status = ''
  getList()
  getStats()
}

// 查看行程详情
const detail = async (id: number) => {
  const trip = list.value.find(item => item.id === id)
  if (trip) {
    const itineraryHtml = trip.days.map(day =>
      `<div style="margin-bottom: 15px;">
        <h4>第${day.day_number}天：${day.title}</h4>
        <p><strong>景点安排：</strong>${day.attractions.map(a => a.attraction.name).join('、')}</p>
        ${day.notes ? `<p><strong>备注：</strong>${day.notes}</p>` : ''}
      </div>`
    ).join('')

    ElMessageBox.alert(
      `<div>
        <p><strong>行程名称：</strong>${trip.title}</p>
        <p><strong>目的地：</strong>${trip.destination_city}</p>
        <p><strong>开始日期：</strong>${trip.start_date}</p>
        <p><strong>结束日期：</strong>${trip.end_date}</p>
        <p><strong>预算：</strong>¥${trip.total_budget}</p>
        <p><strong>实际花费：</strong>¥${trip.actual_cost}</p>
        <p><strong>旅行人数：</strong>${trip.traveler_count}人</p>
        <p><strong>状态：</strong>${getStatusLabel(trip.status)}</p>
        <hr style="margin: 15px 0;">
        <h3>详细行程：</h3>
        ${itineraryHtml}
      </div>`,
      '行程详情',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭'
      }
    )
  }
}



// 添加行程
const handleAdd = () => {
  if (isAdd.value) return

  const newTrip: Trip = {
    title: '',
    destination_city: '',
    start_date: '',
    end_date: '',
    total_budget: '0.00',
    actual_cost: '0.00',
    traveler_count: 1,
    status: 'draft',
    notes: '',
    is_public: false,
    user: 0,
    user_name: '',
    days: [],
    attraction_count: 0,
    id: 0
  }


  isAdd.value = true
  list.value.unshift(newTrip)
}

// 取消添加
const clean = () => {
  if (isAdd.value) {
    list.value = list.value.filter(item => item.id !== null)
    isAdd.value = false
  }
}

// 表单验证
const validateData = (data: Trip) => {
  const errors: string[] = []

  if (!data.title?.trim()) {
    errors.push('行程名称不能为空')
  }

  if (!data.destination_city?.trim()) {
    errors.push('目的地不能为空')
  }

  if (!data.start_date) {
    errors.push('开始日期不能为空')
  }

  if (!data.end_date) {
    errors.push('结束日期不能为空')
  }

  if (parseFloat(data.total_budget) < 0) {
    errors.push('预算不能为负数')
  }

  if (data.traveler_count < 1) {
    errors.push('旅行人数必须大于0')
  }

  return errors
}



// 删除行程
const deleteRecord = async (id: number) => {
  try {
    const response: { code: number; msg: string; data?: any } = await serviceAxios({
      url: '/travel/admin/management/',
      method: 'DELETE',
      data: {
        type: 'trip',
        id: id
      }
    })

    console.log('删除行程响应:', response)

    if (response.code === 200) {
      ElMessage.success('删除行程成功')
      getList()
      getStats()
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    console.error('删除数据失败:', error)
    ElMessage.error('删除失败')
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  params.value.page_size = size
  params.value.page = 1
  getList()
}

const handleCurrentChange = (page: number) => {
  params.value.page = page
  getList()
}

// 获取类型标签
const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    cultural: '文化景点',
    natural: '自然风光',
    entertainment: '娱乐休闲',
    historical: '历史古迹',
    modern: '现代建筑'
  }
  return typeMap[type] || type
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    ongoing: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    draft: '草稿'
  }
  return statusMap[status] || status
}

// 统计数据
const statsData = ref({
  totalRoutes: 0,
  activeRoutes: 0,
  totalBookings: 0,
  avgRating: '0'
})

// 获取统计数据
const getStats = async () => {
  try {
    // 调用统计数据API
    const response = await serviceAxios({
      url: '/travel/admin/management/?type=statistics',
      method: 'GET'
    })
    console.log('获取统计数据:', response)
    const typedResponse = response as unknown as { code: number; msg: string; data?: any }
    if (typedResponse.code === 200 && typedResponse.data) {
      const { trips, reviews } = typedResponse.data
      statsData.value = {
        totalRoutes: trips?.total || 0,
        activeRoutes: trips?.ongoing || 0,
        totalBookings: trips?.completed || 0,
        avgRating: reviews?.avg_rating || 0
      }
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 统计数据计算
const stats = computed(() => statsData.value)

// 组件挂载时获取数据
onMounted(() => {
  getList()
  getStats()
})
</script>

<template>
  <div class="route-manage">
    <!-- 页面标题和统计卡片 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">路线管理</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
              <el-button type="primary" size="small" @click="getList">
                <el-icon>
                  <Refresh />
                </el-icon>
                刷新数据
              </el-button>
            </Motion>
          </div>
        </template>

        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.2 } as any"
            class="bg-blue-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-600 text-sm font-medium">总行程数</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.4 }">
                  <p class="text-2xl font-bold text-blue-900">{{ stats.totalRoutes }}</p>
                </Motion>
                <p class="text-xs text-blue-500 mt-1">行程总数量</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.3 } as any" class="text-blue-500">
                <el-icon size="32">
                  <MapLocation />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.3 } as any"
            class="bg-green-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-green-600 text-sm font-medium">进行中</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.5 }">
                  <p class="text-2xl font-bold text-green-900">{{ stats.activeRoutes }}</p>
                </Motion>
                <p class="text-xs text-green-500 mt-1">进行中行程</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.4 } as any" class="text-green-500">
                <el-icon size="32">
                  <Star />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.4 } as any"
            class="bg-yellow-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-yellow-600 text-sm font-medium">已完成</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-yellow-900">{{ stats.totalBookings.toLocaleString() }}</p>
                </Motion>
                <p class="text-xs text-yellow-500 mt-1">已完成行程</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.5 } as any" class="text-yellow-500">
                <el-icon size="32">
                  <View />
                </el-icon>
              </Motion>
            </div>
          </Motion>

          <Motion :initial="statsCardVariants.initial" :animate="statsCardVariants.animate"
            :whileHover="statsCardVariants.whileHover as any"
            :transition="{ ...statsCardVariants.transition, delay: 0.5 } as any"
            class="bg-purple-50 p-6 rounded-lg cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-600 text-sm font-medium">平均预算</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-purple-900">¥{{ stats.avgRating }}</p>
                </Motion>
                <p class="text-xs text-purple-500 mt-1">平均预算</p>
              </div>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate"
                :whileHover="iconVariants.whileHover as any"
                :transition="{ ...iconVariants.transition, delay: 0.6 } as any" class="text-purple-500">
                <el-icon size="32">
                  <TrendCharts />
                </el-icon>
              </Motion>
            </div>
          </Motion>
        </div>
      </el-card>
    </Motion>

    <!-- 主要内容区域 -->
    <div class="w-full">
      <!-- 路线列表 -->
      <div class="w-full">
        <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
          :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.6 } as any">
          <el-card>
            <!-- 搜索和操作区域 -->
            <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.1 }">
              <el-row :gutter="16" class="mb-4">
                <el-col :span="6">
                  <el-input v-model="params.user_id" placeholder="请输入用户ID" clearable @keyup.enter="search">
                    <template #prefix>
                      <el-icon>
                        <User />
                      </el-icon>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="params.type" placeholder="选择类型" clearable>
                    <el-option label="文化景点" value="cultural" />
                    <el-option label="自然风光" value="natural" />
                    <el-option label="娱乐休闲" value="entertainment" />
                    <el-option label="历史古迹" value="historical" />
                    <el-option label="现代建筑" value="modern" />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="params.status" placeholder="选择状态" clearable>
                    <el-option label="进行中" value="active" />
                    <el-option label="已完成" value="completed" />
                    <el-option label="已取消" value="cancelled" />
                    <el-option label="草稿" value="draft" />
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-space>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button @click="resetParams">
                        <el-icon>
                          <Refresh />
                        </el-icon>
                        重置
                      </el-button>
                    </Motion>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button type="primary" @click="search">
                        <Search size="12" />
                        查询
                      </el-button>
                    </Motion>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button type="success" @click="handleAdd">
                        <el-icon>
                          <Plus />
                        </el-icon>
                        添加路线
                      </el-button>
                    </Motion>
                  </el-space>
                </el-col>
              </el-row>
            </Motion>

            <!-- 表格区域 -->
            <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.6, delay: 0.2 }">
              <el-table :data="list" v-loading="loading" border stripe class="route-table">
                <el-table-column label="序号" width="80" align="center">
                  <template #default="{ $index }">
                    {{ (params.page - 1) * params.page_size + $index + 1 }}
                  </template>
                </el-table-column>

                <el-table-column label="行程名称" prop="title" min-width="180">
                  <template #default="{ row }">
                    <el-link type="primary" @click="detail(row.id)">
                      {{ row.title }}
                    </el-link>
                  </template>
                </el-table-column>

                <el-table-column label="目的地" prop="destination_city" width="120" align="center">
                  <template #default="{ row }">
                    <span>{{ row.destination_city }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="开始日期" prop="start_date" width="120" align="center">
                  <template #default="{ row }">
                    <span>{{ row.start_date }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="结束日期" prop="end_date" width="120" align="center">
                  <template #default="{ row }">
                    <span>{{ row.end_date }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="预算" prop="total_budget" width="120" align="center">
                  <template #default="{ row }">
                    <span>
                      ¥{{ parseFloat(row.total_budget).toLocaleString() }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column label="旅行人数" prop="traveler_count" width="100" align="center">
                  <template #default="{ row }">
                    <span>{{ row.traveler_count }}人</span>
                  </template>
                </el-table-column>

                <el-table-column label="景点数量" prop="attraction_count" width="100" align="center">
                  <template #default="{ row }">
                    <span>{{ row.attraction_count }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="用户" prop="user_name" width="120" align="center">
                  <template #default="{ row }">
                    <span>{{ row.user_name }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="状态" prop="status" width="120" align="center">
                  <template #default="{ row }">
                    <el-tag :type="row.status === 'completed' ? 'success' :
                      row.status === 'ongoing' ? 'primary' :
                        row.status === 'cancelled' ? 'danger' : 'info'" size="small">
                      {{ getStatusLabel(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="200" align="center" fixed="right">
                  <template #default="{ row }">
                    <el-space>
                      <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                        <el-popconfirm title="确认删除这条路线吗?" confirm-button-text="确认" cancel-button-text="取消"
                          @confirm="deleteRecord(row.id)">
                          <template #reference>
                            <el-button type="danger" size="small">
                              <el-icon>
                                <Delete />
                              </el-icon>
                              删除
                            </el-button>
                          </template>
                        </el-popconfirm>
                      </Motion>
                    </el-space>
                  </template>
                </el-table-column>
              </el-table>
            </Motion>

            <!-- 分页区域 -->
            <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.3 }">
              <div class="flex justify-center mt-6">
                <el-pagination v-model:current-page="params.page" v-model:page-size="params.page_size"
                  :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange" @current-change="handleCurrentChange" />
              </div>
            </Motion>
          </el-card>
        </Motion>
      </div>
    </div>
  </div>
</template>

<style scoped>
.route-manage {
  width: 100%;
}

.route-table {
  width: 100%;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .route-table {
    font-size: 12px;
  }
}

/* 表格行悬停效果 */
.el-table__row:hover {
  background-color: #f5f7fa;
}

/* 卡片样式增强 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>