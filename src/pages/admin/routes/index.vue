<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import Search from '@/components/icon/search.vue'

// 路线接口定义
interface Route {
  id: number | null
  name: string
  description: string
  duration: number // 天数
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'cultural' | 'natural' | 'adventure' | 'leisure' | 'family'
  attractions: string[] // 景点ID数组
  estimatedCost: number
  maxGroupSize: number
  tags: string[]
  itinerary: RouteDay[]
  status: 'active' | 'inactive' | 'draft'
  bookingCount: number
  rating: number
  createdAt: string
  updatedAt: string
}

// 行程天数接口
interface RouteDay {
  day: number
  title: string
  activities: string[]
  accommodation?: string
  meals: string[]
}

// 查询参数接口
interface RouteQueryParams {
  query: string
  type: string
  difficulty: string
  status: string
  page: number
  page_size: number
}

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

// 响应式数据
const loading = ref(false)
const list = ref<Route[]>([])
const total = ref(0)
const isAdd = ref(false)
const editableData = reactive<Record<string | number, Route>>({})

// 查询参数
const params = reactive<RouteQueryParams>({
  query: '',
  type: '',
  difficulty: '',
  status: '',
  page: 1,
  page_size: 10
})

// 路线类型选项
const typeOptions = [
  { label: '文化之旅', value: 'cultural' },
  { label: '自然风光', value: 'natural' },
  { label: '探险之旅', value: 'adventure' },
  { label: '休闲度假', value: 'leisure' },
  { label: '亲子游', value: 'family' }
]

// 难度选项
const difficultyOptions = [
  { label: '轻松', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' }
]

// 状态选项
const statusOptions = [
  { label: '已发布', value: 'active' },
  { label: '已下架', value: 'inactive' },
  { label: '草稿', value: 'draft' }
]

// 模拟数据
const mockData: Route[] = [
  {
    id: 1,
    name: '北京经典三日游',
    description: '游览北京最著名的历史文化景点，体验古都风韵',
    duration: 3,
    difficulty: 'easy',
    type: 'cultural',
    attractions: ['故宫博物院', '天坛公园', '颐和园', '长城'],
    estimatedCost: 1200,
    maxGroupSize: 30,
    tags: ['历史文化', '经典路线', '适合初次游览'],
    itinerary: [
      {
        day: 1,
        title: '皇城探秘',
        activities: ['上午：故宫博物院', '下午：天安门广场', '晚上：王府井步行街'],
        accommodation: '北京饭店',
        meals: ['午餐：全聚德烤鸭', '晚餐：东来顺火锅']
      },
      {
        day: 2,
        title: '皇家园林',
        activities: ['上午：颐和园', '下午：圆明园遗址', '晚上：什刹海'],
        accommodation: '北京饭店',
        meals: ['午餐：仿膳饭庄', '晚餐：护国寺小吃']
      },
      {
        day: 3,
        title: '万里长城',
        activities: ['全天：八达岭长城', '下午：明十三陵'],
        meals: ['午餐：农家菜', '晚餐：庆丰包子']
      }
    ],
    status: 'active',
    bookingCount: 156,
    rating: 4.8,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    name: '杭州西湖深度游',
    description: '深度游览西湖十景，感受江南水乡的诗意美景',
    duration: 2,
    difficulty: 'easy',
    type: 'natural',
    attractions: ['西湖', '灵隐寺', '雷峰塔', '三潭印月'],
    estimatedCost: 800,
    maxGroupSize: 25,
    tags: ['自然风光', '江南水乡', '摄影胜地'],
    itinerary: [
      {
        day: 1,
        title: '西湖美景',
        activities: ['上午：断桥残雪', '下午：雷峰夕照', '晚上：音乐喷泉'],
        accommodation: '西湖国宾馆',
        meals: ['午餐：楼外楼', '晚餐：知味观']
      },
      {
        day: 2,
        title: '禅意之旅',
        activities: ['上午：灵隐寺', '下午：三潭印月', '晚上：河坊街'],
        meals: ['午餐：素斋', '晚餐：杭帮菜']
      }
    ],
    status: 'active',
    bookingCount: 89,
    rating: 4.6,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    name: '张家界探险之旅',
    description: '挑战张家界的奇峰异石，体验惊险刺激的户外探险',
    duration: 4,
    difficulty: 'hard',
    type: 'adventure',
    attractions: ['张家界国家森林公园', '天门山', '黄龙洞', '凤凰古城'],
    estimatedCost: 2200,
    maxGroupSize: 15,
    tags: ['户外探险', '奇峰异石', '挑战性强'],
    itinerary: [
      {
        day: 1,
        title: '森林公园初探',
        activities: ['上午：金鞭溪', '下午：袁家界', '晚上：溪布街'],
        accommodation: '武陵源酒店',
        meals: ['午餐：土家菜', '晚餐：三下锅']
      },
      {
        day: 2,
        title: '天门山挑战',
        activities: ['全天：天门山国家森林公园', '玻璃栈道体验'],
        accommodation: '张家界市区酒店',
        meals: ['午餐：山顶餐厅', '晚餐：湘菜']
      },
      {
        day: 3,
        title: '地下奇观',
        activities: ['上午：黄龙洞', '下午：宝峰湖', '晚餐：《魅力湘西》演出'],
        accommodation: '张家界市区酒店',
        meals: ['午餐：农家乐', '晚餐：特色小吃']
      },
      {
        day: 4,
        title: '古城风韵',
        activities: ['全天：凤凰古城', '沱江泛舟'],
        meals: ['午餐：古城小吃', '晚餐：苗家菜']
      }
    ],
    status: 'draft',
    bookingCount: 23,
    rating: 4.9,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-22'
  }
]

// 获取路线列表
const getList = async () => {
  try {
    loading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    let filteredData = [...mockData]

    // 搜索过滤
    if (params.query) {
      filteredData = filteredData.filter(item =>
        item.name.includes(params.query) ||
        item.description.includes(params.query) ||
        item.tags.some(tag => tag.includes(params.query))
      )
    }

    // 类型过滤
    if (params.type) {
      filteredData = filteredData.filter(item => item.type === params.type)
    }

    // 难度过滤
    if (params.difficulty) {
      filteredData = filteredData.filter(item => item.difficulty === params.difficulty)
    }

    // 状态过滤
    if (params.status) {
      filteredData = filteredData.filter(item => item.status === params.status)
    }

    total.value = filteredData.length

    // 分页
    const start = (params.page - 1) * params.page_size
    const end = start + params.page_size
    list.value = filteredData.slice(start, end)

  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取路线列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const search = () => {
  params.page = 1
  getList()
}

// 重置参数
const resetParams = () => {
  params.page = 1
  params.query = ''
  params.type = ''
  params.difficulty = ''
  params.status = ''
  getList()
}

// 查看路线详情
const detail = async (id: number) => {
  const route = list.value.find(item => item.id === id)
  if (route) {
    const itineraryHtml = route.itinerary.map(day =>
      `<div style="margin-bottom: 15px;">
        <h4>第${day.day}天：${day.title}</h4>
        <p><strong>活动安排：</strong>${day.activities.join('、')}</p>
        <p><strong>用餐：</strong>${day.meals.join('、')}</p>
        ${day.accommodation ? `<p><strong>住宿：</strong>${day.accommodation}</p>` : ''}
      </div>`
    ).join('')

    ElMessageBox.alert(
      `<div>
        <p><strong>路线名称：</strong>${route.name}</p>
        <p><strong>行程天数：</strong>${route.duration}天</p>
        <p><strong>难度等级：</strong>${getDifficultyLabel(route.difficulty)}</p>
        <p><strong>路线类型：</strong>${getTypeLabel(route.type)}</p>
        <p><strong>预估费用：</strong>¥${route.estimatedCost}</p>
        <p><strong>最大团队：</strong>${route.maxGroupSize}人</p>
        <p><strong>预订次数：</strong>${route.bookingCount}次</p>
        <p><strong>评分：</strong>${route.rating}分</p>
        <hr style="margin: 15px 0;">
        <h3>详细行程：</h3>
        ${itineraryHtml}
      </div>`,
      '路线详情',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭'
      }
    )
  }
}

// 编辑路线
const edit = (id: number) => {
  const route = list.value.find(item => item.id === id)
  if (route) {
    editableData[id] = cloneDeep(route)
  }
}

// 添加路线
const handleAdd = () => {
  if (isAdd.value) return

  const newRoute: Route = {
    id: null,
    name: '',
    description: '',
    duration: 1,
    difficulty: 'easy',
    type: 'cultural',
    attractions: [],
    estimatedCost: 0,
    maxGroupSize: 20,
    tags: [],
    itinerary: [
      {
        day: 1,
        title: '',
        activities: [],
        meals: []
      }
    ],
    status: 'draft',
    bookingCount: 0,
    rating: 5.0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  }

  editableData[newRoute.id as any] = cloneDeep(newRoute)
  isAdd.value = true
  list.value.unshift(newRoute)
}

// 取消编辑
const clean = (id: number | null) => {
  if (isAdd.value && id === null) {
    list.value = list.value.filter(item => item.id !== null)
    isAdd.value = false
  }
  delete editableData[id as any]
}

// 表单验证
const validateData = (data: Route) => {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push('路线名称不能为空')
  }

  if (!data.description?.trim()) {
    errors.push('路线描述不能为空')
  }

  if (data.duration < 1 || data.duration > 30) {
    errors.push('行程天数必须在1-30天之间')
  }

  if (data.estimatedCost < 0) {
    errors.push('预估费用不能为负数')
  }

  if (data.maxGroupSize < 1 || data.maxGroupSize > 100) {
    errors.push('最大团队人数必须在1-100人之间')
  }

  return errors
}

// 保存路线
const save = async (key: number | null) => {
  try {
    const dataToSave = editableData[key as any]
    const errors = validateData(dataToSave)

    if (errors.length > 0) {
      ElMessage.error(errors[0])
      return
    }

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    if (isAdd.value) {
      // 添加新路线
      const newId = Math.max(...mockData.map(item => item.id || 0)) + 1
      dataToSave.id = newId
      mockData.push(dataToSave)
      ElMessage.success('添加路线成功')
    } else {
      // 更新现有路线
      const index = mockData.findIndex(item => item.id === key)
      if (index !== -1) {
        dataToSave.updatedAt = new Date().toISOString().split('T')[0]
        mockData[index] = { ...dataToSave }
      }
      ElMessage.success('更新路线成功')
    }

    // 清除可编辑状态
    delete editableData[key as any]
    isAdd.value = false
    getList()
  } catch (error: any) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '操作失败')
  }
}

// 删除路线
const deleteRecord = async (id: number) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    const index = mockData.findIndex(item => item.id === id)
    if (index !== -1) {
      mockData.splice(index, 1)
    }

    ElMessage.success('删除路线成功')
    getList()
  } catch (error) {
    console.error('删除数据失败:', error)
    ElMessage.error('删除失败')
  }
}

// 分页处理
const handleSizeChange = (size: number) => {
  params.page_size = size
  params.page = 1
  getList()
}

const handleCurrentChange = (page: number) => {
  params.page = page
  getList()
}

// 获取类型标签
const getTypeLabel = (value: string) => {
  const option = typeOptions.find(item => item.value === value)
  return option ? option.label : value
}

// 获取难度标签
const getDifficultyLabel = (value: string) => {
  const option = difficultyOptions.find(item => item.value === value)
  return option ? option.label : value
}

// 获取状态标签
const getStatusLabel = (value: string) => {
  const option = statusOptions.find(item => item.value === value)
  return option ? option.label : value
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})
</script>

<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any"
    class="route-manage">
    <el-card>
      <!-- 搜索和操作区域 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <el-row :gutter="16" class="mb-4">
          <el-col :span="6">
            <el-input v-model="params.query" placeholder="请输入路线名称或标签" clearable @keyup.enter="search">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="params.type" placeholder="选择类型" clearable>
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="params.difficulty" placeholder="选择难度" clearable>
              <el-option v-for="item in difficultyOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="params.status" placeholder="选择状态" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="8">
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

          <el-table-column label="路线名称" prop="name" min-width="180">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].name" size="small" />
              <el-link v-else type="primary" @click="detail(row.id)">
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column label="行程天数" prop="duration" width="100" align="center">
            <template #default="{ row }">
              <el-input-number v-if="editableData[row.id]" v-model="editableData[row.id].duration" size="small" :min="1"
                :max="30" />
              <el-tag v-else type="info" size="small">
                {{ row.duration }}天
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="路线类型" prop="type" width="120" align="center">
            <template #default="{ row }">
              <el-select v-if="editableData[row.id]" v-model="editableData[row.id].type" size="small">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-tag v-else size="small">
                {{ getTypeLabel(row.type) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="难度等级" prop="difficulty" width="100" align="center">
            <template #default="{ row }">
              <el-select v-if="editableData[row.id]" v-model="editableData[row.id].difficulty" size="small">
                <el-option v-for="item in difficultyOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
              <el-tag v-else :type="row.difficulty === 'easy' ? 'success' :
                row.difficulty === 'medium' ? 'warning' : 'danger'" size="small">
                {{ getDifficultyLabel(row.difficulty) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="预估费用" prop="estimatedCost" width="120" align="center">
            <template #default="{ row }">
              <el-input-number v-if="editableData[row.id]" v-model="editableData[row.id].estimatedCost" size="small"
                :min="0" />
              <span v-else>
                ¥{{ row.estimatedCost.toLocaleString() }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="最大团队" prop="maxGroupSize" width="100" align="center">
            <template #default="{ row }">
              <el-input-number v-if="editableData[row.id]" v-model="editableData[row.id].maxGroupSize" size="small"
                :min="1" :max="100" />
              <span v-else>{{ row.maxGroupSize }}人</span>
            </template>
          </el-table-column>

          <el-table-column label="预订次数" prop="bookingCount" width="100" align="center">
            <template #default="{ row }">
              <span>{{ row.bookingCount }}</span>
            </template>
          </el-table-column>

          <el-table-column label="评分" prop="rating" width="120" align="center">
            <template #default="{ row }">
              <el-rate :model-value="row.rating" disabled show-score />
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="status" width="100" align="center">
            <template #default="{ row }">
              <el-select v-if="editableData[row.id]" v-model="editableData[row.id].status" size="small">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-tag v-else :type="row.status === 'active' ? 'success' :
                row.status === 'inactive' ? 'danger' : 'info'" size="small">
                {{ getStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <el-space>
                <template v-if="editableData[row.id]">
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button type="primary" size="small" @click="save(row.id)">
                      <el-icon>
                        <Check />
                      </el-icon>
                      保存
                    </el-button>
                  </Motion>
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button size="small" @click="clean(row.id)">
                      <el-icon>
                        <Close />
                      </el-icon>
                      取消
                    </el-button>
                  </Motion>
                </template>
                <template v-else>
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button type="primary" size="small" @click="edit(row.id)">
                      <el-icon>
                        <Edit />
                      </el-icon>
                      编辑
                    </el-button>
                  </Motion>
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-popconfirm v-if="!isAdd && row.id !== editableData[row.id]?.id" title="确认删除这条路线吗?"
                      confirm-button-text="确认" cancel-button-text="取消" @confirm="deleteRecord(row.id)">
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
                </template>
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