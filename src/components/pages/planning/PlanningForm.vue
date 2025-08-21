<template>
  <div class="planning-form">
    <!-- 基本信息 -->
    <div class="form-section">
      <h3 class="section-title">基本信息</h3>
      <div class="form-grid">
        <!-- 目的地 -->
        <div class="form-item">
          <label>目的地 <span class="required">*</span></label>
          <el-input 
            v-model="formData.destination" 
            placeholder="请输入目的地，如：北京"
            @input="$emit('update:formData', { ...formData, destination: $event })"
          />
        </div>
        
        <!-- 开始日期 -->
        <div class="form-item">
          <label>开始日期 <span class="required">*</span></label>
          <el-date-picker
            v-model="formData.start_date"
            type="date"
            placeholder="选择开始日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="$emit('update:formData', { ...formData, start_date: $event })"
          />
        </div>
        
        <!-- 结束日期 -->
        <div class="form-item">
          <label>结束日期 <span class="required">*</span></label>
          <el-date-picker
            v-model="formData.end_date"
            type="date"
            placeholder="选择结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="$emit('update:formData', { ...formData, end_date: $event })"
          />
        </div>
        
        <!-- 预算 -->
        <div class="form-item">
          <label>预算 <span class="required">*</span></label>
          <el-input-number 
            v-model="formData.budget" 
            :min="0" 
            :step="100"
            placeholder="请输入预算金额"
            @change="$emit('update:formData', { ...formData, budget: $event })"
          />
        </div>
      </div>
    </div>

    <!-- 旅行偏好 -->
    <div class="form-section">
      <h3 class="section-title">旅行偏好</h3>
      <div class="tags-container">
        <div 
          v-for="preference in TRAVEL_PREFERENCES" 
          :key="preference"
          :class="['tag', { active: formData.preferences && formData.preferences.includes(preference) }]"
          @click="togglePreference(preference)"
        >
          {{ preference }}
        </div>
      </div>
    </div>

    <!-- 旅行设置 -->
    <div class="form-section">
      <h3 class="section-title">旅行设置</h3>
      <div class="form-grid">
        <!-- 旅行风格 -->
        <div class="form-item">
          <label>旅行风格 <span class="required">*</span></label>
          <el-select 
            v-model="formData.travel_style" 
            placeholder="请选择旅行风格"
            @change="$emit('update:formData', { ...formData, travel_style: $event })"
          >
            <el-option 
              v-for="style in TRAVEL_STYLES" 
              :key="style" 
              :label="style" 
              :value="style"
            />
          </el-select>
        </div>
        
        <!-- 交通方式 -->
        <div class="form-item">
          <label>交通方式 <span class="required">*</span></label>
          <el-select 
            v-model="formData.transportation" 
            placeholder="请选择交通方式"
            @change="$emit('update:formData', { ...formData, transportation: $event })"
          >
            <el-option 
              v-for="transport in TRANSPORTATION_OPTIONS" 
              :key="transport" 
              :label="transport" 
              :value="transport"
            />
          </el-select>
        </div>
        
        <!-- 每日最大景点数 -->
        <div class="form-item">
          <label>每日最大景点数</label>
          <el-input-number 
            v-model="formData.max_attractions_per_day" 
            :min="1" 
            :max="10"
            @change="$emit('update:formData', { ...formData, max_attractions_per_day: $event })"
          />
        </div>
        
        <!-- 无障碍需求 -->
        <div class="form-item">
          <label>无障碍需求</label>
          <el-switch 
            v-model="formData.accessibility_needs" 
            @change="$emit('update:formData', { ...formData, accessibility_needs: $event })"
          />
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="form-actions">
      <el-button @click="$emit('reset')">重置</el-button>
      <el-button 
        type="primary" 
        :loading="loading"
        @click="$emit('generate')"
      >
        {{ loading ? '生成中...' : '生成行程' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlanningFormData } from '@/types/Travel-planning/travel-plan'
import { TRAVEL_PREFERENCES, TRAVEL_STYLES, TRANSPORTATION_OPTIONS } from '@/types/Travel-planning/travel-plan'

interface Props {
  formData: PlanningFormData
  loading?: boolean
}

interface Emits {
  (e: 'update:formData', value: PlanningFormData): void
  (e: 'reset'): void
  (e: 'generate'): void
  (e: 'togglePreference', preference: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function togglePreference(preference: string) {
  // 通过emit让父组件处理偏好切换逻辑
  emit('togglePreference', preference)
}
</script>

<style scoped>
.planning-form {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-height: 720px;
  overflow-y: auto;
}

/* 滚动条样式 */
.planning-form::-webkit-scrollbar {
  width: 6px;
}

.planning-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.planning-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.planning-form::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  border-left: 4px solid #409eff;
  padding-left: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-item label {
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.required {
  color: #f56c6c;
}

.budget-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.travel-mode {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag {
  padding: 8px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  color: #666;
  background: #f8f9fa;
}

.tag:hover {
  border-color: #409eff;
  color: #409eff;
}

.tag.active {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .budget-options,
  .travel-mode {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
