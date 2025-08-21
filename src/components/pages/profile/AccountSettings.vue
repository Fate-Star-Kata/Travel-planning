<template>
  <div class="account-settings">
    <!-- 基本信息设置 -->
    <div class="settings-section">
      <h3 class="section-title">基本信息</h3>
      <el-form ref="baseInfoFormRef" :model="baseInfoData" :rules="baseInfoRules" label-width="80px" @submit.prevent="handleBaseInfoSubmit">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="baseInfoData.username" disabled placeholder="用户名" />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="baseInfoData.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="baseInfoLoading" @click="handleBaseInfoSubmit">
            {{ baseInfoLoading ? '提交中...' : '更新信息' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 密码修改 -->
    <div class="settings-section">
      <h3 class="section-title">修改密码</h3>
      <el-form ref="passwordFormRef" :model="passwordData" :rules="passwordRules" label-width="80px" @submit.prevent="handlePasswordSubmit">
        <!-- 原密码 -->
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordData.oldPassword" type="password" placeholder="请输入原密码" show-password />
        </el-form-item>

        <!-- 新密码 -->
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordData.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>

        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordData.confirmPassword" type="password" placeholder="请再次输入新密码" show-password />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" :loading="passwordLoading" @click="handlePasswordSubmit">
            {{ passwordLoading ? '修改中...' : '修改密码' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Toast 提示 -->
    <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { getUserDetailInfo, updateUserInfo, changePassword } from '@/api/user/userinfo'
import type { UserDetailInfo, UpdateUserInfoRequest, ChangePasswordRequest } from '@/types/factory'

// 定义组件名称
defineOptions({
  name: 'AccountSettings'
})

// 响应式数据
const baseInfoLoading = ref(false)
const passwordLoading = ref(false)
const baseInfoFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const router = useRouter()

// Toast 状态
const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'warning'
})

// 显示 Toast
const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

// 基本信息表单数据
const baseInfoData = ref<UserDetailInfo>({
  id: 0,
  username: '',
  email: '',
})

// 密码修改表单数据
const passwordData = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 自定义验证函数
const validateConfirmPassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passwordData.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 基本信息表单验证规则
const baseInfoRules = reactive<FormRules<UserDetailInfo>>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ]
})

// 密码修改表单验证规则
const passwordRules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getUserDetailInfo()
    if (response.code === 200 && response.data) {
      baseInfoData.value = response.data
    } else if (response.code === 401) {
      showToast('身份认证失败，请先登录', 'error')
      router.push('/auth/login')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    showToast('获取用户信息失败', 'error')
  }
}

// 提交基本信息
const handleBaseInfoSubmit = async () => {
  if (!baseInfoFormRef.value) return
  try {
    await baseInfoFormRef.value.validate()
    baseInfoLoading.value = true

    const requestData: UpdateUserInfoRequest = {
      id: baseInfoData.value.id,
      username: baseInfoData.value.username,
      email: baseInfoData.value.email,
    }

    const response = await updateUserInfo(requestData)

    if (response.code === 200) {
      showToast('更新成功', 'success')
    } else if (response.code === 401) {
      showToast('身份认证失败，请先登录', 'error')
      router.push('/auth/login')
    } else {
      showToast(response.msg || '更新失败', 'error')
    }
  } catch (error) {
    console.error('提交失败:', error)
    showToast('提交失败，请稍后重试', 'error')
  } finally {
    baseInfoLoading.value = false
  }
}

// 提交密码修改
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true

    const requestData: ChangePasswordRequest = {
      old_password: passwordData.oldPassword,
      new_password: passwordData.newPassword,
      reset_password: passwordData.confirmPassword
    }

    const response = await changePassword(requestData)

    if (response.code === 200) {
      showToast('密码修改成功', 'success')
      // 清空表单
      passwordData.oldPassword = ''
      passwordData.newPassword = ''
      passwordData.confirmPassword = ''
      passwordFormRef.value.resetFields()
    } else if (response.code === 401) {
      showToast('身份认证失败，请先登录', 'error')
      router.push('/auth/login')
    } else {
      showToast(response.msg || '密码修改失败', 'error')
    }
  } catch (error) {
    console.error('修改密码失败:', error)
    showToast('修改密码失败，请稍后重试', 'error')
  } finally {
    passwordLoading.value = false
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped lang="scss">
.account-settings {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.8);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e5e7eb;
}

// Element Plus 表单样式优化
:deep(.el-form-item) {
  margin-bottom: 20px;

  .el-form-item__label {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }

  .el-input__wrapper {
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
      border-color: #d1d5db;
    }

    &.is-focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }

  .el-button {
    border-radius: 8px;
    font-weight: 600;
    padding: 12px 24px;
    transition: all 0.3s ease;

    &.el-button--primary {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// Toast 样式
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 9999;
  animation: slideIn 0.3s ease;

  &.toast-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  &.toast-error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  &.toast-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>