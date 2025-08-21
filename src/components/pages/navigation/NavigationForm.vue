<template>
  <div class="card bg-white shadow-xl border border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300">
    <div class="card-body">
      <div class="flex items-center justify-between mb-6">
        <h2 class="card-title text-xl text-gray-800">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          路线规划
        </h2>
        <div class="flex gap-2">
          <button class="btn btn-primary btn-sm" @click="$emit('locate')" :disabled="loading.nearby">
            <svg v-if="!loading.nearby" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            </svg>
            <span v-if="loading.nearby" class="loading loading-spinner loading-xs"></span>
            {{ loading.nearby ? '定位中...' : '📍 定位' }}
          </button>
          <button class="btn btn-outline btn-sm" @click="$emit('swapPoints')">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
            </svg>
            🔄 交换
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 起点输入 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-gray-700">🚩 起点</span>
          </label>
          <input 
            :value="form.origin" 
            @input="$emit('updateOrigin', ($event.target as HTMLInputElement).value)" 
            type="text" 
            placeholder="请输入起点，如：深圳北站"
            class="input input-bordered w-full focus:input-primary transition-all duration-200" 
          />
        </div>

        <!-- 终点输入 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-gray-700">🎯 终点</span>
          </label>
          <input 
            :value="form.destination" 
            @input="$emit('updateDestination', ($event.target as HTMLInputElement).value)" 
            type="text" 
            placeholder="请输入终点，如：世界之窗"
            class="input input-bordered w-full focus:input-primary transition-all duration-200" 
          />
        </div>

        <!-- 出行方式选择 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-gray-700">🚗 出行方式</span>
          </label>
          <select 
            :value="form.mode" 
            @change="$emit('updateMode', ($event.target as HTMLSelectElement).value as 'driving' | 'walking' | 'transit')" 
            class="select select-bordered w-full focus:select-primary"
          >
            <option value="driving">🚗 驾车</option>
            <option value="walking">🚶 步行</option>
            <option value="transit">🚇 公交/地铁</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text opacity-0">操作</span>
          </label>
          <div class="flex gap-2">
            <button class="btn btn-primary flex-1" @click="$emit('planRoute')" :disabled="loading.route">
              <span v-if="loading.route" class="loading loading-spinner loading-sm"></span>
              <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7">
                </path>
              </svg>
              {{ loading.route ? '查询中...' : '查询路线' }}
            </button>
            <button class="btn btn-ghost" @click="$emit('reset')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                </path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  form: {
    origin: string
    destination: string
    mode: 'driving' | 'walking' | 'transit'
  }
  loading: {
    route: boolean
    nearby: boolean
  }
}

defineProps<Props>()

defineEmits<{
  updateOrigin: [value: string]
  updateDestination: [value: string]
  updateMode: [value: 'driving' | 'walking' | 'transit']
  locate: []
  swapPoints: []
  planRoute: []
  reset: []
}>()
</script>