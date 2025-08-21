<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Plus, Edit, Delete, MapLocation, Star, TrendCharts, View } from '@element-plus/icons-vue'
import Search from '@/components/icon/search.vue'
import AttractionEditDialog from '@/components/pages/admin/AttractionEditDialog.vue'
import {
  getAttractionsAPI,
  createAttractionAPI,
  updateAttractionAPI,
  deleteAttractionAPI,
  updateAttractionStatusAPI
} from '@/api/admin/attractions'
import type {
  AttractionData,
  AttractionQueryParams,
  CategoryOption,
  AttractionUpdateRequest
} from '@/types/factory'

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
const list = ref<AttractionData[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentAttraction = ref<AttractionData | null>(null)

// 查询参数
const params = reactive<AttractionQueryParams>({
  query: '',
  category: '',
  page: 1,
  pageSize: 10
})

// 分类选项
const categoryOptions: CategoryOption[] = [
  { label: '全部分类', value: '' },
  { label: '文化古迹', value: 'cultural' },
  { label: '自然风光', value: 'natural' },
  { label: '历史遗迹', value: 'historical' },
  { label: '现代建筑', value: 'modern' },
  { label: '娱乐休闲', value: 'entertainment' },
  { label: '宗教场所', value: 'religious' }
]



// 获取景点列表
const getAttractionsList = async () => {
  try {
    loading.value = true
    // 转换参数名称以匹配后端API
    const apiParams = {
      ...params,
      page_size: params.pageSize || 10
    }
    delete apiParams.pageSize
    const response = await getAttractionsAPI(apiParams)

    if (response.code === 200) {
      // 将后端数据结构转换为前端数据结构
      list.value = response.data.attractions.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        address: item.address,
        city: item.city,
        province: item.province,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        ticketPrice: parseFloat(item.ticket_price),
        openingHours: item.opening_hours,
        visitDuration: item.visit_duration,
        rating: parseFloat(item.rating),
        ratingCount: item.rating_count,
        images: item.images,
        tags: item.tags,
        isActive: item.is_active,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        visitCount: item.visit_count
      }))
      total.value = response.data.pagination.total_count
    } else {
      ElMessage.error(response.msg || '获取景点列表失败')
    }
  } catch (error) {
    console.error('获取景点列表失败:', error)
    ElMessage.error('获取景点列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索景点
const handleSearch = () => {
  params.page = 1
  getAttractionsList()
}

// 重置搜索
const handleReset = () => {
  params.query = ''
  params.category = ''
  params.page = 1
  getAttractionsList()
}

// 分页变化
const handlePageChange = (page: number) => {
  params.page = page
  getAttractionsList()
}

// 页面大小变化
const handlePageSizeChange = (pageSize: number) => {
  params.pageSize = pageSize
  params.page = 1
  getAttractionsList()
}

// 打开新增弹窗
const handleAdd = () => {
  isEdit.value = false
  currentAttraction.value = null
  dialogVisible.value = true
}

// 打开编辑弹窗
const handleEdit = (row: AttractionData) => {
  isEdit.value = true
  currentAttraction.value = { ...row }
  dialogVisible.value = true
}

// 确认弹窗操作
const handleDialogConfirm = async (data: AttractionData) => {
  try {
    if (isEdit.value) {
      // 编辑景点
      if (!data.id) {
        ElMessage.error('景点ID不能为空')
        return
      }
      // 转换数据格式以匹配API要求
      const updateData: AttractionUpdateRequest = {
        id: data.id,
        name: data.name,
        description: data.description,
        category: data.category,
        city: data.city,
        province: data.province,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        ticket_price: data.ticketPrice,
        opening_hours: data.openingHours,
        visit_duration: data.visitDuration,
        images: data.images,
        tags: data.tags,
        is_active: data.isActive,
        rating: data.rating
      }
      const response = await updateAttractionAPI(data.id, updateData)
      if (response.code === 200) {
        ElMessage.success('更新景点成功')
        dialogVisible.value = false
        getAttractionsList()
      } else {
        ElMessage.error(response.msg || '更新景点失败')
      }
    } else {
      // 新增景点 - 转换数据格式以匹配新的API
      const createData = {
        type: 'attraction' as const,
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          city: data.city,
          province: data.province,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          ticket_price: data.ticketPrice,
          opening_hours: data.openingHours,
          visit_duration: data.visitDuration,
          images: data.images,
          tags: data.tags,
          is_active: data.isActive
        }
      }
      const response = await createAttractionAPI(createData)
      if (response.code === 200) {
        ElMessage.success('创建景点成功')
        dialogVisible.value = false
        getAttractionsList()
      } else {
        ElMessage.error(response.msg || '创建景点失败')
      }
    }
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 删除景点
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个景点吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await deleteAttractionAPI(id)
    if (response.code === 200) {
      ElMessage.success('删除成功')
      getAttractionsList()
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 切换状态
const handleStatusChange = async (row: AttractionData) => {
  try {
    if (!row.id) {
      ElMessage.error('景点ID不能为空')
      row.isActive = !row.isActive
      return
    }
    const response = await updateAttractionStatusAPI(row.id, row.isActive)
    if (response.code === 200) {
      ElMessage.success('状态更新成功')
    } else {
      ElMessage.error(response.msg || '状态更新失败')
      // 恢复原状态
      row.isActive = !row.isActive
    }
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
    // 恢复原状态
    row.isActive = !row.isActive
  }
}

// 获取分类标签
const getCategoryLabel = (value: string) => {
  const option = categoryOptions.find(item => item.value === value)
  return option ? option.label : value
}

// 统计数据计算
const stats = computed(() => {
  const totalAttractions = total.value
  const activeAttractions = list.value.filter(item => item.isActive).length
  const totalVisits = list.value.reduce((sum, item) => sum + item.visitCount, 0)
  const avgRating = list.value.length > 0
    ? (list.value.reduce((sum, item) => sum + item.rating, 0) / list.value.length).toFixed(1)
    : '0.0'

  return {
    totalAttractions,
    activeAttractions,
    totalVisits,
    avgRating
  }
})

// 组件挂载时获取数据
onMounted(() => {
  getAttractionsList()
})
</script>

<template>
  <div class="attraction-manage">
    <!-- 页面标题和统计卡片 -->
    <Motion :initial="cardVariants.initial" :animate="cardVariants.animate" :whileHover="cardVariants.whileHover as any"
      :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
      <el-card class="mb-6">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">景点管理</span>
            <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }"
              :whileHover="{ scale: 1.05 }" :transition="{ duration: 0.3, delay: 0.5 }">
              <el-button type="primary" size="small" @click="getAttractionsList">
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
                <p class="text-blue-600 text-sm font-medium">总景点数</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.4 }">
                  <p class="text-2xl font-bold text-blue-900">{{ stats.totalAttractions }}</p>
                </Motion>
                <p class="text-xs text-blue-500 mt-1">景点总数量</p>
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
                <p class="text-green-600 text-sm font-medium">启用景点</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.5 }">
                  <p class="text-2xl font-bold text-green-900">{{ stats.activeAttractions }}</p>
                </Motion>
                <p class="text-xs text-green-500 mt-1">正在使用中</p>
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
                <p class="text-yellow-600 text-sm font-medium">总访问量</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.6 }">
                  <p class="text-2xl font-bold text-yellow-900">{{ stats.totalVisits.toLocaleString() }}</p>
                </Motion>
                <p class="text-xs text-yellow-500 mt-1">累计访问次数</p>
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
                <p class="text-purple-600 text-sm font-medium">平均评分</p>
                <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                  :transition="{ duration: 0.4, delay: 0.7 }">
                  <p class="text-2xl font-bold text-purple-900">{{ stats.avgRating }}</p>
                </Motion>
                <p class="text-xs text-purple-500 mt-1">用户评分</p>
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
      <!-- 景点列表 -->
      <div class="w-full">
        <Motion :initial="cardVariants.initial" :animate="cardVariants.animate"
          :whileHover="cardVariants.whileHover as any" :transition="{ ...cardVariants.transition, delay: 0.6 } as any">
          <el-card>
            <!-- 搜索和操作区域 -->
            <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.5, delay: 0.1 }">
              <el-row :gutter="16" class="mb-4">
                <el-col :span="6">
                  <el-input v-model="params.query" placeholder="请输入景点名称或地址" clearable @keyup.enter="handleSearch">
                    <template #prefix>
                      <el-icon>
                        <Search />
                      </el-icon>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="params.category" placeholder="选择分类" clearable>
                    <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-space>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button @click="handleReset">
                        <el-icon>
                          <Refresh />
                        </el-icon>
                        重置
                      </el-button>
                    </Motion>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button type="primary" @click="handleSearch">
                        <Search size="12" />
                        查询
                      </el-button>
                    </Motion>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button type="success" @click="handleAdd">
                        <el-icon>
                          <Plus />
                        </el-icon>
                        添加景点
                      </el-button>
                    </Motion>
                  </el-space>
                </el-col>
              </el-row>
            </Motion>

            <!-- 表格区域 -->
            <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.6, delay: 0.2 }">
              <el-table :data="list" v-loading="loading" border stripe class="attraction-table">
                <el-table-column label="序号" width="80" align="center">
                  <template #default="{ $index }">
                    {{ (params.page - 1) * (params.pageSize || 10) + $index + 1 }}
                  </template>
                </el-table-column>

                <el-table-column label="景点名称" prop="name" min-width="150" />

                <el-table-column label="地址" prop="address" min-width="200" />

                <el-table-column label="城市" prop="city" width="120" align="center" />

                <el-table-column label="分类" prop="category" width="120" align="center">
                  <template #default="{ row }">
                    <el-tag size="small">
                      {{ getCategoryLabel(row.category) }}
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="评分" prop="rating" width="100" align="center">
                  <template #default="{ row }">
                    <el-rate :model-value="row.rating" disabled show-score />
                  </template>
                </el-table-column>

                <el-table-column label="门票价格" prop="ticketPrice" width="120" align="center">
                  <template #default="{ row }">
                    <span>
                      {{ row.ticketPrice === 0 ? '免费' : `¥${row.ticketPrice}` }}
                    </span>
                  </template>
                </el-table-column>

                <el-table-column label="访问次数" prop="visitCount" width="120" align="center">
                  <template #default="{ row }">
                    <span>{{ row.visitCount.toLocaleString() }}</span>
                  </template>
                </el-table-column>

                <el-table-column label="状态" prop="isActive" width="120" align="center">
                  <template #default="{ row }">
                    <el-switch v-model="row.isActive" @change="handleStatusChange(row)" active-text="启用"
                      inactive-text="禁用" />
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center" fixed="right">
                  <template #default="{ row }">
                    <el-space>
                      <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                        <el-button type="primary" size="small" @click="handleEdit(row)">
                          <el-icon>
                            <Edit />
                          </el-icon>
                          编辑
                        </el-button>
                      </Motion>
                      <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                        <el-popconfirm title="确认删除这个景点吗?" confirm-button-text="确认" cancel-button-text="取消"
                          @confirm="() => row.id && handleDelete(row.id)">
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
                <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
                  :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handlePageSizeChange" @current-change="handlePageChange" />
              </div>
            </Motion>
          </el-card>
        </Motion>
      </div>


    </div>

    <!-- 编辑弹窗 -->
    <AttractionEditDialog v-model:visible="dialogVisible" :attraction="currentAttraction" :is-edit="isEdit"
      @confirm="handleDialogConfirm" />
  </div>
</template>

<style scoped>
.attraction-manage {
  width: 100%;
  min-height: calc(100vh - 120px);
  padding: 24px;
}

.attraction-table {
  width: 100%;
  min-height: 60vh;
}

/* 统计卡片样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 0;
}

:deep(.el-table th) {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
}

:deep(.el-table td) {
  border-bottom: 1px solid #f3f4f6;
}

:deep(.el-table tr:hover > td) {
  background-color: #f8fafc;
}

/* 卡片样式增强 */
.el-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background: white;
}

:deep(.el-card__header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

/* 按钮样式 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-button--success) {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  border: none;
  border-radius: 8px;
  font-weight: 500;
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border: none;
  border-radius: 8px;
  font-weight: 500;
}

/* 响应式优化 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .attraction-manage {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .main-content {
    gap: 16px;
  }

  .attraction-table {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .stat-value {
    font-size: 24px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}

/* 表格行悬停效果 */
.el-table__row:hover {
  background-color: #f5f7fa;
}
</style>