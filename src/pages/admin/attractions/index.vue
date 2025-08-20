<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import Search from '@/components/icon/search.vue'

// 景点接口定义
interface Attraction {
  id: number | null
  name: string
  description: string
  location: string
  category: string
  rating: number
  price: number
  images: string[]
  openingHours: string
  facilities: string[]
  tags: string[]
  status: 'active' | 'inactive' | 'maintenance'
  visitCount: number
  createdAt: string
  updatedAt: string
}

// 查询参数接口
interface AttractionQueryParams {
  query: string
  category: string
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
const list = ref<Attraction[]>([])
const total = ref(0)
const isAdd = ref(false)
const editableData = reactive<Record<string | number, Attraction>>({})

// 查询参数
const params = reactive<AttractionQueryParams>({
  query: '',
  category: '',
  status: '',
  page: 1,
  page_size: 10
})

// 景点分类选项
const categoryOptions = [
  { label: '自然风光', value: 'nature' },
  { label: '历史文化', value: 'culture' },
  { label: '主题乐园', value: 'theme_park' },
  { label: '博物馆', value: 'museum' },
  { label: '宗教建筑', value: 'religious' },
  { label: '现代建筑', value: 'modern' },
  { label: '美食街区', value: 'food' },
  { label: '购物中心', value: 'shopping' }
]

// 状态选项
const statusOptions = [
  { label: '正常开放', value: 'active' },
  { label: '暂停开放', value: 'inactive' },
  { label: '维护中', value: 'maintenance' }
]

// 模拟数据
const mockData: Attraction[] = [
  {
    id: 1,
    name: '故宫博物院',
    description: '中国明清两代的皇家宫殿，世界文化遗产',
    location: '北京市东城区景山前街4号',
    category: 'culture',
    rating: 4.8,
    price: 60,
    images: ['/images/forbidden-city-1.jpg', '/images/forbidden-city-2.jpg'],
    openingHours: '08:30-17:00',
    facilities: ['停车场', '餐厅', '纪念品店', '导览服务'],
    tags: ['世界遗产', '皇家建筑', '历史文化'],
    status: 'active',
    visitCount: 125680,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    name: '西湖风景区',
    description: '杭州著名的湖泊风景区，以秀丽的湖光山色著称',
    location: '浙江省杭州市西湖区',
    category: 'nature',
    rating: 4.7,
    price: 0,
    images: ['/images/west-lake-1.jpg', '/images/west-lake-2.jpg'],
    openingHours: '全天开放',
    facilities: ['游船码头', '自行车租赁', '观景台', '茶室'],
    tags: ['免费景点', '湖泊', '自然风光'],
    status: 'active',
    visitCount: 98432,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    name: '张家界国家森林公园',
    description: '以奇峰异石、幽谷深涧著称的自然风景区',
    location: '湖南省张家界市武陵源区',
    category: 'nature',
    rating: 4.6,
    price: 248,
    images: ['/images/zhangjiajie-1.jpg', '/images/zhangjiajie-2.jpg'],
    openingHours: '07:00-18:00',
    facilities: ['索道', '观光电梯', '餐厅', '住宿'],
    tags: ['国家公园', '奇峰', '自然奇观'],
    status: 'maintenance',
    visitCount: 87654,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-22'
  }
]

// 获取景点列表
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
        item.location.includes(params.query) ||
        item.description.includes(params.query)
      )
    }

    // 分类过滤
    if (params.category) {
      filteredData = filteredData.filter(item => item.category === params.category)
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
    ElMessage.error('获取景点列表失败')
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
  params.category = ''
  params.status = ''
  getList()
}

// 查看景点详情
const detail = async (id: number) => {
  const attraction = list.value.find(item => item.id === id)
  if (attraction) {
    ElMessageBox.alert(
      `<div>
        <p><strong>景点名称：</strong>${attraction.name}</p>
        <p><strong>地址：</strong>${attraction.location}</p>
        <p><strong>描述：</strong>${attraction.description}</p>
        <p><strong>评分：</strong>${attraction.rating}分</p>
        <p><strong>门票价格：</strong>¥${attraction.price}</p>
        <p><strong>开放时间：</strong>${attraction.openingHours}</p>
        <p><strong>访问次数：</strong>${attraction.visitCount.toLocaleString()}次</p>
      </div>`,
      '景点详情',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭'
      }
    )
  }
}

// 编辑景点
const edit = (id: number) => {
  const attraction = list.value.find(item => item.id === id)
  if (attraction) {
    editableData[id] = cloneDeep(attraction)
  }
}

// 添加景点
const handleAdd = () => {
  if (isAdd.value) return

  const newAttraction: Attraction = {
    id: null,
    name: '',
    description: '',
    location: '',
    category: 'nature',
    rating: 5.0,
    price: 0,
    images: [],
    openingHours: '09:00-17:00',
    facilities: [],
    tags: [],
    status: 'active',
    visitCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  }

  editableData[newAttraction.id as any] = cloneDeep(newAttraction)
  isAdd.value = true
  list.value.unshift(newAttraction)
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
const validateData = (data: Attraction) => {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push('景点名称不能为空')
  }

  if (!data.description?.trim()) {
    errors.push('景点描述不能为空')
  }

  if (!data.location?.trim()) {
    errors.push('景点地址不能为空')
  }

  if (data.rating < 0 || data.rating > 5) {
    errors.push('评分必须在0-5之间')
  }

  if (data.price < 0) {
    errors.push('门票价格不能为负数')
  }

  return errors
}

// 保存景点
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
      // 添加新景点
      const newId = Math.max(...mockData.map(item => item.id || 0)) + 1
      dataToSave.id = newId
      mockData.push(dataToSave)
      ElMessage.success('添加景点成功')
    } else {
      // 更新现有景点
      const index = mockData.findIndex(item => item.id === key)
      if (index !== -1) {
        dataToSave.updatedAt = new Date().toISOString().split('T')[0]
        mockData[index] = { ...dataToSave }
      }
      ElMessage.success('更新景点成功')
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

// 删除景点
const deleteRecord = async (id: number) => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 300))

    const index = mockData.findIndex(item => item.id === id)
    if (index !== -1) {
      mockData.splice(index, 1)
    }

    ElMessage.success('删除景点成功')
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

// 获取分类标签
const getCategoryLabel = (value: string) => {
  const option = categoryOptions.find(item => item.value === value)
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
    class="attraction-manage">
    <el-card>
      <!-- 搜索和操作区域 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <el-row :gutter="16" class="mb-4">
          <el-col :span="6">
            <el-input v-model="params.query" placeholder="请输入景点名称或地址" clearable @keyup.enter="search">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-select v-model="params.category" placeholder="选择分类" clearable>
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="params.status" placeholder="选择状态" clearable>
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
              {{ (params.page - 1) * params.page_size + $index + 1 }}
            </template>
          </el-table-column>

          <el-table-column label="景点名称" prop="name" min-width="150">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].name" size="small" />
              <el-link v-else type="primary" @click="detail(row.id)">
                {{ row.name }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column label="地址" prop="location" min-width="200">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].location" size="small" />
              <span v-else>{{ row.location }}</span>
            </template>
          </el-table-column>

          <el-table-column label="分类" prop="category" width="120" align="center">
            <template #default="{ row }">
              <el-select v-if="editableData[row.id]" v-model="editableData[row.id].category" size="small">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-tag v-else size="small">
                {{ getCategoryLabel(row.category) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="评分" prop="rating" width="100" align="center">
            <template #default="{ row }">
              <el-input-number v-if="editableData[row.id]" v-model="editableData[row.id].rating" size="small" :min="0"
                :max="5" :step="0.1" :precision="1" />
              <el-rate v-else :model-value="row.rating" disabled show-score />
            </template>
          </el-table-column>

          <el-table-column label="门票价格" prop="price" width="120" align="center">
            <template #default="{ row }">
              <el-input-number v-if="editableData[row.id]" v-model="editableData[row.id].price" size="small" :min="0" />
              <span v-else>
                {{ row.price === 0 ? '免费' : `¥${row.price}` }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="访问次数" prop="visitCount" width="120" align="center">
            <template #default="{ row }">
              <span>{{ row.visitCount.toLocaleString() }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="status" width="120" align="center">
            <template #default="{ row }">
              <el-select v-if="editableData[row.id]" v-model="editableData[row.id].status" size="small">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-tag v-else :type="row.status === 'active' ? 'success' :
                row.status === 'inactive' ? 'danger' : 'warning'" size="small">
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
                    <el-popconfirm v-if="!isAdd && row.id !== editableData[row.id]?.id" title="确认删除这个景点吗?"
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
.attraction-manage {
  width: 100%;
}

.attraction-table {
  width: 100%;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .attraction-table {
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