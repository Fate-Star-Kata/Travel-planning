<template>
  <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h2 class="card-title text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
            </path>
          </svg>
          我的收藏
        </h2>
        <button class="btn btn-ghost btn-sm hover:btn-accent transition-all duration-300"
          @click="$emit('view-all-favorites')">
          查看全部
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block w-4 h-4 stroke-current ml-1">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- 无收藏状态 -->
      <div v-else-if="favoritesList.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">❤️</div>
        <p class="text-base-content/70 text-lg">暂无收藏，去发现更多精彩景点吧～</p>
        <button class="btn btn-primary mt-4" @click="$emit('explore-attractions')">探索景点</button>
      </div>

      <!-- 收藏列表 -->
      <div v-else class="space-y-4">
        <div v-for="favorite in favoritesList.slice(0, 5)" :key="favorite.id"
          class="group hover:bg-base-200/50 p-4 rounded-2xl transition-all duration-300 cursor-pointer"
          @click="$emit('favorite-click', favorite)">
          <div class="grid grid-cols-12 gap-4 items-center">
            <div class="col-span-12 sm:col-span-3">
              <div
                class="rounded-2xl overflow-hidden aspect-[4/3] bg-base-200 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img :src="favorite.attraction.images?.[0] || '/placeholder-image.jpg'" :alt="favorite.attraction.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            </div>
            <div class="col-span-12 sm:col-span-9">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                    {{ favorite.attraction.name }}
                  </h3>
                  <p class="text-base-content/70 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      class="inline-block w-4 h-4 stroke-current mr-2">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                      </path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ favorite.attraction.address }}
                  </p>
                  <div class="flex items-center gap-4">
                    <div class="flex items-center">
                      <div class="rating rating-sm">
                        <input v-for="i in 5" :key="i" type="radio" :name="`rating-${favorite.id}`"
                          :class="`mask mask-star-2 ${i <= Math.floor(parseFloat(favorite.attraction.rating)) ? 'bg-orange-400' : 'bg-gray-300'}`"
                          disabled />
                      </div>
                      <span class="text-sm text-base-content/70 ml-2">{{ favorite.attraction.rating }}</span>
                    </div>
                    <span class="text-sm text-base-content/50">
                      收藏于 {{ formatDate(favorite.created_at) }}
                    </span>
                  </div>
                </div>
                <button class="btn btn-ghost btn-sm hover:btn-error transition-all duration-300"
                  @click.stop="$emit('remove-favorite', favorite.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    class="inline-block w-4 h-4 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                    </path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 显示更多提示 -->
        <div v-if="favoritesList.length > 5" class="text-center pt-4">
          <p class="text-base-content/70 text-sm">
            还有 {{ favoritesList.length - 5 }} 个收藏，
            <button class="link link-primary" @click="$emit('view-all-favorites')">查看全部</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FavoriteItem } from '@/types/Travel-planning/attraction'

// Props
interface Props {
  favoritesList: FavoriteItem[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false
})

// Emits
defineEmits<{
  'view-all-favorites': []
  'explore-attractions': []
  'favorite-click': [favorite: FavoriteItem]
  'remove-favorite': [favoriteId: number]
}>()

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
/* 组件特定样式 */
</style>