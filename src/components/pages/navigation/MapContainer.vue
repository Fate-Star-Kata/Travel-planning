<template>
  <div class="card bg-white shadow-xl border border-gray-100 h-[865px] hover:shadow-2xl transition-all duration-300">
    <div class="card-body p-0 relative overflow-hidden">
      <!-- 地图容器 -->
      <div ref="mapContainer" class="w-full h-full rounded-lg"></div>

      <!-- 开始导航按钮 -->
      <div v-if="routes.length > 0" class="absolute bottom-4 right-4">
        <button @click="$emit('startNavigation')"
          class="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white font-semibold">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7">
            </path>
          </svg>
          开始导航
        </button>
      </div>

      <!-- 地图加载状态 -->
      <div v-if="!map"
        class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div class="text-center">
          <div
            class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>
          <p class="text-gray-600">🗺️ 地图加载中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  map: any
  routes: any[]
}

defineProps<Props>()

defineEmits<{
  startNavigation: []
}>()

const mapContainer = ref<HTMLDivElement>()

defineExpose({
  mapContainer
})
</script>