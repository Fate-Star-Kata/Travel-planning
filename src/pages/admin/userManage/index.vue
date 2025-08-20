<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import type { User, UserQueryParams } from '@/types/components/admin'
import Search from '@/components/icon/search.vue'
import {
  getUsersAPI,
  addUserAPI,
  userDetailAPI,
  editUserAPI,
  deleteUserAPI
} from '@/api/admin/users'
import { useUserStore } from '@/stores/auth/user'

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

// Store
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const list = ref<User[]>([])
const total = ref(0)
const isAdd = ref(false)
const editableData = reactive<Record<string | number, User>>({})

// 查询参数
const params = reactive<UserQueryParams>({
  query: '',
  page: 1,
  page_size: 10
})

// 计算属性
const userId = computed(() => userStore.userInfo?.user_id)

// 获取用户列表
const getList = async () => {
  try {
    loading.value = true
    const res = await getUsersAPI(params)
    list.value = res.data.users
    total.value = res.data.total
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取用户列表失败')
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
  getList()
}

// 查看用户详情
const detail = async (id: number) => {
  try {
    const res = await userDetailAPI(id)
    console.log('用户详情:', res)
    ElMessage.success('查看用户详情成功')
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error('获取用户详情失败')
  }
}

// 编辑用户
const edit = (id: number) => {
  const user = list.value.find(item => item.id === id)
  if (user) {
    editableData[id] = cloneDeep(user)
  }
}

// 添加用户
const handleAdd = () => {
  if (isAdd.value) return

  const newUser: User = {
    id: null,
    username: '',
    email: '',
    phone: '',
    avatar: '',
    memberLevel: 'basic',
    travelPreference: '',
    totalTrips: 0,
    registrationDate: new Date().toISOString().split('T')[0],
    lastLoginDate: '',
    status: 'active'
  }

  editableData[newUser.id as any] = cloneDeep(newUser)
  isAdd.value = true
  list.value.unshift(newUser)
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
const validateData = (data: User) => {
  const errors: string[] = []

  if (!data.username?.trim()) {
    errors.push('用户名不能为空')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    errors.push('邮箱格式不正确')
  }

  if (data.phone && !/^1[3-9]\d{9}$/.test(data.phone)) {
    errors.push('手机号格式不正确')
  }

  if (!['basic', 'silver', 'gold', 'diamond'].includes(data.memberLevel)) {
    errors.push('会员等级无效')
  }

  if (!['active', 'inactive', 'frozen'].includes(data.status)) {
    errors.push('用户状态无效')
  }

  return errors
}

// 保存用户
const save = async (key: number | null) => {
  try {
    const dataToSave = editableData[key as any]
    const errors = validateData(dataToSave)

    if (errors.length > 0) {
      ElMessage.error(errors[0])
      return
    }

    let res
    if (isAdd.value) {
      res = await addUserAPI(dataToSave)
    } else {
      res = await editUserAPI(dataToSave)
    }

    ElMessage.success(res.message || '操作成功')

    // 清除可编辑状态
    delete editableData[key as any]
    isAdd.value = false
    getList()
  } catch (error: any) {
    console.error('保存失败:', error)
    ElMessage.error(error.message || '操作失败')
  }
}

// 删除用户
const deleteRecord = async (id: number) => {
  try {
    const res = await deleteUserAPI(id)
    ElMessage.success(res.msg || '删除成功')
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

// 行点击事件
const handleRowClick = (row: User) => {
  // 可以在这里添加行点击逻辑
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})
</script>

<template>
  <!-- @vue-ignore -->
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition"
    class="user-manage">
    <el-card>
      <!-- 搜索和操作区域 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <el-row :gutter="16" class="mb-4">
          <el-col :span="6">
            <el-input v-model="params.query" placeholder="请输入邮箱或用户名" clearable @keyup.enter="search">
              <template #prefix>
                <el-icon>
                  <Search />
                </el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :span="12">
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
                  添加
                </el-button>
              </Motion>
            </el-space>
          </el-col>
        </el-row>
      </Motion>

      <!-- 表格区域 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }">
        <el-table :data="list" v-loading="loading" border stripe class="user-table" @row-click="handleRowClick">
          <el-table-column label="序号" width="80" align="center">
            <template #default="{ $index }">
              {{ (params.page - 1) * params.page_size + $index + 1 }}
            </template>
          </el-table-column>

          <el-table-column label="用户名" prop="username" min-width="120">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].username" size="small" />
              <el-link v-else type="primary" @click="detail(row.id)">
                {{ row.username }}
              </el-link>
            </template>
          </el-table-column>

          <el-table-column label="邮箱" prop="email" min-width="180">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].email" size="small" />
              <span v-else>{{ row.email }}</span>
            </template>
          </el-table-column>

          <el-table-column label="手机号" prop="phone" min-width="120">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].phone" size="small" />
              <span v-else>{{ row.phone || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="会员等级" prop="memberLevel" width="120" align="center">
            <template #default="{ row }">
              <el-select v-if="editableData[row.id]" v-model="editableData[row.id].memberLevel" size="small">
                <el-option label="基础会员" value="basic" />
                <el-option label="银卡会员" value="silver" />
                <el-option label="金卡会员" value="gold" />
                <el-option label="钻石会员" value="diamond" />
              </el-select>
              <el-tag v-else :type="row.memberLevel === 'diamond' ? 'warning' : 
                              row.memberLevel === 'gold' ? 'success' :
                              row.memberLevel === 'silver' ? 'info' : ''" size="small">
                {{ row.memberLevel === 'basic' ? '基础会员' :
                   row.memberLevel === 'silver' ? '银卡会员' :
                   row.memberLevel === 'gold' ? '金卡会员' : '钻石会员' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="旅行偏好" prop="travelPreference" min-width="120">
            <template #default="{ row }">
              <el-input v-if="editableData[row.id]" v-model="editableData[row.id].travelPreference" size="small" placeholder="如：自然风光、历史文化" />
              <span v-else>{{ row.travelPreference || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="完成行程" prop="totalTrips" width="100" align="center">
            <template #default="{ row }">
              <el-input-number v-if="editableData[row.id]" v-model="editableData[row.id].totalTrips" size="small" :min="0" />
              <span v-else>{{ row.totalTrips || 0 }}次</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" prop="status" width="100" align="center">
            <template #default="{ row }">
              <el-select v-if="editableData[row.id]" v-model="editableData[row.id].status" size="small">
                <el-option label="正常" value="active" />
                <el-option label="禁用" value="inactive" />
                <el-option label="冻结" value="frozen" />
              </el-select>
              <el-tag v-else :type="row.status === 'active' ? 'success' : 
                              row.status === 'inactive' ? 'danger' : 'warning'" size="small">
                {{ row.status === 'active' ? '正常' :
                   row.status === 'inactive' ? '禁用' : '冻结' }}
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
                    <el-button type="primary" size="small" :disabled="userId === row.id" @click="edit(row.id)">
                      <el-icon>
                        <Edit />
                      </el-icon>
                      编辑
                    </el-button>
                  </Motion>
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-popconfirm v-if="userId !== row.id && !isAdd && row.id !== editableData[row.id]?.id"
                      title="确认删除吗?" confirm-button-text="确认" cancel-button-text="取消" @confirm="deleteRecord(row.id)">
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
        :transition="{ duration: 0.5, delay: 0.3 }" class="mt-4 flex justify-end">
        <el-pagination v-model:current-page="params.page" v-model:page-size="params.page_size" :total="total"
          :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </Motion>
    </el-card>
  </Motion>
</template>

<style scoped lang="scss">
.user-manage {
  .user-table {
    :deep(.el-table__row) {
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }

    :deep(.el-table__header) {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }
  }

  .el-card {
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    :deep(.el-card__body) {
      padding: 24px;
    }
  }

  .el-button {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .el-tag {
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}
</style>