<template>
  <div class="preferences-settings">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-6">
          <span class="text-2xl">⚙️</span>
          偏好设置
        </h2>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>

        <!-- 偏好设置表单 -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 偏好类别 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-semibold">🎯 旅游偏好</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <label 
                v-for="category in PREFERENCE_CATEGORIES" 
                :key="category"
                class="label cursor-pointer justify-start gap-2"
              >
                <input 
                  type="checkbox" 
                  :value="category"
                  v-model="formData.preferred_categories"
                  class="checkbox checkbox-primary checkbox-sm"
                >
                <span class="label-text text-sm">{{ category }}</span>
              </label>
            </div>
          </div>

          <!-- 预算范围 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-semibold">💰 预算范围</span>
            </label>
            <div class="flex flex-wrap gap-4">
              <label class="label cursor-pointer justify-start gap-2">
                <input 
                  type="radio" 
                  value="low"
                  v-model="formData.budget_range"
                  class="radio radio-primary radio-sm"
                >
                <span class="label-text">经济型</span>
              </label>
              <label class="label cursor-pointer justify-start gap-2">
                <input 
                  type="radio" 
                  value="medium"
                  v-model="formData.budget_range"
                  class="radio radio-primary radio-sm"
                >
                <span class="label-text">舒适型</span>
              </label>
              <label class="label cursor-pointer justify-start gap-2">
                <input 
                  type="radio" 
                  value="high"
                  v-model="formData.budget_range"
                  class="radio radio-primary radio-sm"
                >
                <span class="label-text">高端型</span>
              </label>
              <label class="label cursor-pointer justify-start gap-2">
                <input 
                  type="radio" 
                  value="luxury"
                  v-model="formData.budget_range"
                  class="radio radio-primary radio-sm"
                >
                <span class="label-text">奢华型</span>
              </label>
            </div>
          </div>

          <!-- 旅行风格 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-semibold">🎨 旅行风格</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <label 
                v-for="style in TRAVEL_STYLES" 
                :key="style"
                class="label cursor-pointer justify-start gap-2"
              >
                <input 
                  type="radio" 
                  :value="style"
                  v-model="formData.travel_style"
                  class="radio radio-primary radio-sm"
                >
                <span class="label-text">{{ style }}</span>
              </label>
            </div>
          </div>

          <!-- 交通偏好 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-semibold">🚗 交通偏好</span>
            </label>
            <select v-model="formData.transportation_preference" class="select select-bordered w-full">
              <option value="">请选择交通方式</option>
              <option v-for="transport in TRANSPORTATION_PREFERENCES" :key="transport" :value="transport">
                {{ transport }}
              </option>
            </select>
          </div>

          <!-- 住宿等级 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text text-lg font-semibold">🏨 住宿等级</span>
            </label>
            <select v-model="formData.accommodation_level" class="select select-bordered w-full">
              <option value="">请选择住宿等级</option>
              <option v-for="level in ACCOMMODATION_LEVELS" :key="level" :value="level">
                {{ level }}
              </option>
            </select>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions justify-end pt-4">
            <button 
              type="button" 
              @click="resetForm" 
              class="btn btn-ghost"
              :disabled="saving"
            >
              重置
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="saving"
            >
              <span v-if="saving" class="loading loading-spinner loading-sm"></span>
              {{ saving ? '保存中...' : '保存设置' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { getUserPreferences, updateUserPreferences } from '@/api/Travel-planning/user-preferences'
import type { 
  UpdateUserPreferencesRequest,
  UserPreferences
} from '@/types/Travel-planning/user-preferences'
import {
  PREFERENCE_CATEGORIES,
  TRAVEL_STYLES,
  BUDGET_RANGES,
  TRANSPORTATION_PREFERENCES,
  ACCOMMODATION_LEVELS
} from '@/types/Travel-planning/user-preferences'
import { ElMessage } from 'element-plus'

// 表单数据
const formData = reactive<UpdateUserPreferencesRequest>({
  preferred_categories: [],
  budget_range: '',
  travel_style: '',
  transportation_preference: '',
  accommodation_level: ''
})

// 原始数据备份
const originalData = ref<UserPreferences | null>(null)

// 状态
const loading = ref(false)
const saving = ref(false)

// Toast 状态
const toast = reactive({ show: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' })
let toastTimer: number | undefined

function showToast(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
  toast.message = message
  toast.type = type
  toast.show = true
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.show = false), 3000)
}

// 加载用户偏好
const loadPreferences = async () => {
  try {
    loading.value = true
    const response = await getUserPreferences()
    
    if (response.code === 200) {
      const data = response.data
      originalData.value = data
      
      // 填充表单数据
      formData.preferred_categories = [...data.preferred_categories]
      formData.budget_range = data.budget_range
      formData.travel_style = data.travel_style
      // 注意：API返回的字段名可能不同，需要适配
      formData.transportation_preference = data.preferred_transport?.[0] || ''
      formData.accommodation_level = ''
    } else {
      showToast('暂无偏好设置，请设置您的旅游偏好', 'warning')
    }
  } catch (error) {
    console.error('获取偏好设置失败:', error)
    showToast('获取偏好设置失败', 'error')
  } finally {
    loading.value = false
  }
}

// 保存偏好设置
const handleSubmit = async () => {
  try {
    // 验证必填项
    if (formData.preferred_categories.length === 0) {
      ElMessage.warning('请至少选择一个旅游偏好')
      return
    }
    
    if (!formData.budget_range) {
      ElMessage.warning('请选择预算范围')
      return
    }
    
    if (!formData.travel_style) {
      ElMessage.warning('请选择旅行风格')
      return
    }

    saving.value = true
    const response = await updateUserPreferences(formData)
    
    if (response.code === 200) {
      ElMessage.success('偏好设置保存成功')
      originalData.value = response.data
    } else {
      ElMessage.error(response.msg || '保存失败，请重试')
    }
  } catch (error) {
    console.error('保存偏好设置失败:', error)
    ElMessage.error('保存失败，请检查网络连接后重试')
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  if (originalData.value) {
    formData.preferred_categories = [...originalData.value.preferred_categories]
    formData.budget_range = originalData.value.budget_range
    formData.travel_style = originalData.value.travel_style
    formData.transportation_preference = originalData.value.preferred_transport?.[0] || ''
    formData.accommodation_level = ''
  } else {
    formData.preferred_categories = []
    formData.budget_range = ''
    formData.travel_style = ''
    formData.transportation_preference = ''
    formData.accommodation_level = ''
  }
}

// 页面加载时获取偏好设置
onMounted(() => {
  loadPreferences()
})
</script>

<style scoped>
.preferences-settings {
  max-width: 800px;
}

.form-control {
  margin-bottom: 1.5rem;
}

.label-text {
  font-weight: 500;
}

.checkbox, .radio {
  margin-right: 0.5rem;
}

.grid {
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
