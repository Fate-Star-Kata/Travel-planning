<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { AttractionData, CategoryOption } from '@/types/factory'

// Props定义
interface Props {
  visible: boolean
  attraction?: AttractionData | null
  isEdit?: boolean
}

// Emits定义
interface Emits {
  'update:visible': [value: boolean]
  'confirm': [data: AttractionData]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  attraction: null,
  isEdit: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const loading = ref(false)

// 表单数据
const formData = reactive<AttractionData>({
  id: null,
  name: '',
  description: '',
  category: 'cultural',
  address: '',
  city: '',
  province: '',
  latitude: 0,
  longitude: 0,
  ticketPrice: 0,
  openingHours: '09:00-17:00',
  visitDuration: 120,
  rating: 5.0,
  ratingCount: 0,
  images: [],
  tags: [],
  isActive: true,
  createdAt: '',
  updatedAt: '',
  visitCount: 0
})

// 景点分类选项
const categoryOptions: CategoryOption[] = [
  { label: '文化古迹', value: 'cultural' },
  { label: '自然风光', value: 'natural' },
  { label: '历史遗迹', value: 'historical' },
  { label: '现代建筑', value: 'modern' },
  { label: '娱乐休闲', value: 'entertainment' },
  { label: '宗教场所', value: 'religious' }
]

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入景点名称', trigger: 'blur' },
    { min: 2, max: 50, message: '景点名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入景点描述', trigger: 'blur' },
    { min: 10, max: 500, message: '景点描述长度在 10 到 500 个字符', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入景点地址', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入所在城市', trigger: 'blur' }
  ],
  province: [
    { required: true, message: '请输入所在省份', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择景点分类', trigger: 'change' }
  ],
  ticketPrice: [
    { required: true, message: '请输入门票价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '门票价格不能为负数', trigger: 'blur' }
  ],
  openingHours: [
    { required: true, message: '请输入开放时间', trigger: 'blur' }
  ],
  visitDuration: [
    { required: true, message: '请输入建议游览时长', trigger: 'blur' },
    { type: 'number', min: 30, max: 1440, message: '游览时长应在30-1440分钟之间', trigger: 'blur' }
  ]
}

// 监听弹窗显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    initFormData()
  }
})

// 初始化表单数据
const initFormData = () => {
  if (props.attraction && props.isEdit) {
    // 编辑模式，填充现有数据
    Object.assign(formData, props.attraction)
  } else {
    // 新增模式，重置表单
    resetForm()
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: null,
    name: '',
    description: '',
    category: 'cultural',
    address: '',
    city: '',
    province: '',
    latitude: 0,
    longitude: 0,
    ticketPrice: 0,
    openingHours: '09:00-17:00',
    visitDuration: 120,
    rating: 5.0,
    ratingCount: 0,
    images: [],
    tags: [],
    isActive: true,
    createdAt: '',
    updatedAt: '',
    visitCount: 0
  })
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 添加标签
const newTag = ref('')
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    newTag.value = ''
  }
}

// 删除标签
const removeTag = (index: number) => {
  formData.tags.splice(index, 1)
}

// 确认提交
const handleConfirm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // 提交数据
    emit('confirm', { ...formData })

  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    loading.value = false
  }
}

// 取消操作
const handleCancel = () => {
  emit('update:visible', false)
}

// 关闭弹窗后重置表单
const handleClose = () => {
  resetForm()
}
</script>

<template>
  <el-dialog :model-value="visible" :title="isEdit ? '编辑景点' : '添加景点'" width="800px" top="5vh"
    :before-close="handleCancel" @closed="handleClose" @update:model-value="emit('update:visible', $event)"
    class="attraction-dialog">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" class="attraction-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="景点名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入景点名称" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="景点分类" prop="category">
            <el-select v-model="formData.category" placeholder="请选择分类" class="w-full">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="景点描述" prop="description">
        <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入景点描述" maxlength="500"
          show-word-limit />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="所在省份" prop="province">
            <el-input v-model="formData.province" placeholder="请输入省份" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所在城市" prop="city">
            <el-input v-model="formData.city" placeholder="请输入城市" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门票价格" prop="ticketPrice">
            <el-input-number v-model="formData.ticketPrice" :min="0" :precision="2" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="详细地址" prop="address">
        <el-input v-model="formData.address" placeholder="请输入详细地址" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="纬度" prop="latitude">
            <el-input-number v-model="formData.latitude" :precision="6" class="w-full" placeholder="请输入纬度" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经度" prop="longitude">
            <el-input-number v-model="formData.longitude" :precision="6" class="w-full" placeholder="请输入经度" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="开放时间" prop="openingHours">
            <el-input v-model="formData.openingHours" placeholder="如：09:00-17:00" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="游览时长" prop="visitDuration">
            <el-input-number v-model="formData.visitDuration" :min="30" :max="1440" class="w-full" />
            <span class="text-xs text-gray-500 ml-2">分钟</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="景点标签">
        <div class="tag-container">
          <el-tag v-for="(tag, index) in formData.tags" :key="index" closable @close="removeTag(index)"
            class="mr-2 mb-2">
            {{ tag }}
          </el-tag>
          <el-input v-model="newTag" size="small" placeholder="添加标签" style="width: 120px" @keyup.enter="addTag"
            class="mr-2" />
          <el-button size="small" @click="addTag">添加</el-button>
        </div>
      </el-form-item>

      <el-form-item label="状态">
        <el-switch v-model="formData.isActive" active-text="启用" inactive-text="禁用" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleConfirm">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.attraction-form {
  padding: 0 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.dialog-footer {
  text-align: right;
}

.w-full {
  width: 100%;
}

:deep(.attraction-dialog .el-dialog) {
  max-height: 90vh;
  margin-top: 5vh !important;
  margin-bottom: 5vh !important;
}

:deep(.attraction-dialog .el-dialog__body) {
  max-height: calc(90vh - 120px);
  overflow-y: auto;
  padding: 20px;
}
</style>