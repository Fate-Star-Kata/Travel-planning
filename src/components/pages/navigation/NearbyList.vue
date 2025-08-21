<template>
  <div class="card bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
    <div class="card-body">
      <h3 class="card-title text-lg text-gray-800 mb-4">
        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        📍 附近推荐
      </h3>

      <!-- 加载状态 -->
      <div v-if="loading" class="space-y-4">
        <div class="skeleton h-4 w-full"></div>
        <div class="skeleton h-4 w-3/4"></div>
        <div class="skeleton h-4 w-1/2"></div>
        <div class="skeleton h-4 w-2/3"></div>
      </div>

      <!-- 无数据状态 -->
      <div v-else-if="nearby.length === 0" class="text-center py-8 h-80 flex flex-col justify-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <p class="text-gray-500">暂无数据</p>
      </div>

      <!-- 推荐列表 -->
      <div v-else class="max-h-80 overflow-y-auto space-y-3">
        <div v-for="(item, i) in nearby" :key="i"
          class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
          <div class="flex-1">
            <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
            <p class="text-sm text-gray-500 mt-1">
              <span class="badge badge-outline badge-sm mr-2">{{ item.category }}</span>
              📏 距离约 {{ item.distance }}
            </p>
          </div>
          <button class="btn btn-sm btn-primary" @click="$emit('setDestination', item.name)">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            设为终点
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NearbyItem {
  name: string
  category: string
  distance: string
}

interface Props {
  nearby: NearbyItem[]
  loading: boolean
}

defineProps<Props>()

defineEmits<{
  setDestination: [name: string]
}>()
</script>