<template>
  <el-dialog 
    v-model="visible" 
    :title="attraction?.name || '景点详情'"
    width="90%"
    max-width="1200px"
    :close-on-click-modal="false"
    class="attraction-detail-dialog"
    @update:model-value="handleVisibleChange">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="loading loading-spinner loading-lg text-primary"></div>
    </div>
    <div v-else-if="attraction" class="flex gap-6 h-[600px]">
      <!-- 左侧：景点信息 -->
      <div class="flex-1 overflow-y-auto pr-4 space-y-6">
      <!-- 景点基本信息 -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-base-content mb-2">{{ attraction.name }}</h2>
          <p class="text-base-content/70 mb-4">{{ attraction.description }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in attraction.tags" :key="tag" 
                  class="badge badge-outline badge-primary">{{ tag }}</span>
          </div>
        </div>
        <button 
          class="btn btn-ghost btn-circle hover:btn-error transition-all duration-300" 
          :class="{ 'text-red-500': attraction.isFavorited }"
          @click="handleFavorite"
          :disabled="favoriteLoading"
          :title="attraction.isFavorited ? '已收藏' : '收藏'">
          <div v-if="favoriteLoading" class="loading loading-spinner loading-sm"></div>
          <svg v-else class="w-6 h-6" :fill="attraction.isFavorited ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>

      <!-- 景点图片 -->
      <div v-if="attraction.images && attraction.images.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <img v-for="(image, index) in attraction.images" :key="index" 
             :src="image" 
             :alt="attraction.name"
             class="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      </div>

      <!-- 详细信息 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="attraction.address" class="space-y-2">
          <h3 class="text-lg font-semibold text-base-content">位置信息</h3>
          <p class="text-base-content/70">{{ attraction.address }}, {{ attraction.city }}, {{ attraction.province }}</p>
        </div>
        <div v-if="attraction.opening_hours" class="space-y-2">
          <h3 class="text-lg font-semibold text-base-content">开放时间</h3>
          <p class="text-base-content/70">{{ attraction.opening_hours }}</p>
        </div>
        <div v-if="attraction.ticket_price" class="space-y-2">
          <h3 class="text-lg font-semibold text-base-content">门票价格</h3>
          <p class="text-base-content/70">{{ attraction.ticket_price }}</p>
        </div>
        <div v-if="attraction.rating" class="space-y-2">
          <h3 class="text-lg font-semibold text-base-content">评分</h3>
          <div class="flex items-center gap-2">
            <div class="rating rating-sm">
              <input v-for="i in 5" :key="i" type="radio" :name="`rating-${attraction.id}`" 
                     class="mask mask-star-2 bg-orange-400" :checked="i <= Math.round(Number(attraction.rating))" disabled>
            </div>
            <span class="text-base-content/70">{{ attraction.rating }}/5 ({{ attraction.rating_count }}条评价)</span>
          </div>
        </div>
      </div>

        <!-- 详细描述 -->
        <div v-if="attraction.description" class="space-y-2">
          <h3 class="text-lg font-semibold text-base-content">详细介绍</h3>
          <p class="text-base-content/70 leading-relaxed">{{ attraction.description }}</p>
        </div>
      </div>
      
      <!-- 右侧：评价区域 -->
      <div class="w-96 border-l border-base-300 pl-6">
        <ReviewSection :attraction-id="attraction.id" />
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end gap-3">
        <button class="btn btn-ghost" @click="handleClose">关闭</button>
        <button v-if="attraction" class="btn btn-primary" @click="handleStartPlanning">
          开始规划行程
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AttractionDetail } from '@/types/Travel-planning/attraction'
import ReviewSection from './ReviewSection.vue'

interface Props {
  modelValue: boolean
  attraction: AttractionDetail | null
  loading: boolean
  favoriteLoading: boolean
}

interface Emits {
  'update:modelValue': [value: boolean]
  'favorite': [attractionId: number]
  'start-planning': [attractionName: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const handleVisibleChange = (value: boolean) => {
  emit('update:modelValue', value)
}

const handleFavorite = () => {
  if (props.attraction) {
    emit('favorite', props.attraction.id)
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleStartPlanning = () => {
  if (props.attraction) {
    emit('start-planning', props.attraction.name)
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
.attraction-detail-dialog {
  /* 可以添加自定义样式 */
}
</style>