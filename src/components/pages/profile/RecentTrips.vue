<template>
  <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h2 class="card-title text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          最近行程
        </h2>
        <button class="btn btn-ghost btn-sm hover:btn-accent transition-all duration-300"
          @click="$emit('view-all-trips')">
          查看全部
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block w-4 h-4 stroke-current ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="grid grid-cols-12 gap-4 items-center p-4">
            <div class="col-span-12 sm:col-span-3">
              <div class="bg-base-300 rounded-2xl aspect-[4/3]"></div>
            </div>
            <div class="col-span-12 sm:col-span-6 space-y-3">
              <div class="h-6 bg-base-300 rounded w-3/4"></div>
              <div class="h-4 bg-base-300 rounded w-1/2"></div>
              <div class="h-4 bg-base-300 rounded w-1/4"></div>
            </div>
            <div class="col-span-12 sm:col-span-3 space-y-2">
              <div class="h-8 bg-base-300 rounded w-full"></div>
              <div class="h-8 bg-base-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="recentTrips.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">🗺️</div>
        <p class="text-base-content/70 text-lg">暂无行程，去创建你的第一个行程吧～</p>
        <button class="btn btn-primary mt-4" @click="$emit('create-trip')">创建行程</button>
      </div>

      <div v-else class="space-y-6">
        <div v-for="trip in recentTrips" :key="trip.id"
          class="group hover:bg-base-200/50 p-4 rounded-2xl transition-all duration-300">
          <div class="grid grid-cols-12 gap-4 items-center">
            <div class="col-span-12 sm:col-span-3">
              <div
                class="rounded-2xl overflow-hidden aspect-[4/3] bg-base-200 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img :src="trip.cover" alt="行程图片"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
            <div class="col-span-12 sm:col-span-6">
              <h3 class="font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">{{ trip.title }}</h3>
              <p class="text-base-content/70 mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="inline-block w-4 h-4 stroke-current mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                  </path>
                </svg>
                {{ trip.dateRange }}
              </p>
              <div class="flex items-center gap-2">
                <span class="badge badge-lg" :class="statusBadgeClass(trip.status)">{{ statusText(trip.status) }}</span>
              </div>
            </div>
            <div class="col-span-12 sm:col-span-3 flex flex-col gap-2">
              <button class="btn btn-sm btn-outline hover:btn-primary transition-all duration-300"
                @click="$emit('trip-view', trip)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="inline-block w-4 h-4 stroke-current mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
                  </path>
                </svg>
                查看详情
              </button>
              <button class="btn btn-sm btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
                @click="$emit('trip-edit', trip)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  class="inline-block w-4 h-4 stroke-current mr-1">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                  </path>
                </svg>
                修改行程
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TripItem } from '@/types/Travel-planning/attraction'

// Props
interface Props {
  recentTrips: TripItem[]
  loading?: boolean
}

defineProps<Props>()

// Emits
defineEmits<{
  'view-all-trips': []
  'create-trip': []
  'trip-view': [trip: TripItem]
  'trip-edit': [trip: TripItem]
}>()

// 状态文本
const statusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'planning': '规划中',
    'ongoing': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 状态徽章样式
const statusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    'planning': 'badge-warning',
    'ongoing': 'badge-info',
    'completed': 'badge-success',
    'cancelled': 'badge-error'
  }
  return classMap[status] || 'badge-neutral'
}
</script>

<style scoped>
/* 组件特定样式 */
</style>