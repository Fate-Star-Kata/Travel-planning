<template>
  <div class="card bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
    <div class="card-body">
      <h3 class="card-title text-lg text-gray-800 mb-4">
        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7">
          </path>
        </svg>
        🛣️ 推荐路线
      </h3>

      <!-- 加载状态 -->
      <div v-if="loading" class="space-y-4">
        <div class="skeleton h-4 w-full"></div>
        <div class="skeleton h-4 w-3/4"></div>
        <div class="skeleton h-4 w-1/2"></div>
        <div class="skeleton h-4 w-2/3"></div>
      </div>

      <!-- 无路线状态 -->
      <div v-else-if="routes.length === 0" class="text-center py-8 h-80 flex flex-col justify-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.34c-1.44-1.122-3.12-1.34-5-1.34s-3.56.218-5 1.34M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
        </div>
        <p class="text-gray-500">暂无路线，试试查询吧</p>
      </div>

      <!-- 路线列表 -->
      <div v-else class="max-h-80 overflow-y-auto space-y-4">
        <div v-for="(route, idx) in routes" :key="idx"
          class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold text-gray-800">{{ route.summary }}</h4>
            <div class="badge badge-primary">{{ route.duration }}</div>
          </div>
          <p class="text-sm text-gray-600 mb-3">📏 距离：{{ route.distance }}</p>
          <div class="space-y-2">
            <div v-for="(step, si) in route.steps" :key="si" class="flex items-start gap-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <span class="text-sm text-gray-600">{{ step }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RouteOption {
  summary: string
  distance: string
  duration: string
  steps: string[]
}

interface Props {
  routes: RouteOption[]
  loading: boolean
}

defineProps<Props>()
</script>