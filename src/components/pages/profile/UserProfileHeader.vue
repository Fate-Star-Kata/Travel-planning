<template>
  <section class="w-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-30"></div>
    <div class="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-8 relative z-10">
      <div class="avatar group">
        <div
          class="w-32 rounded-full ring-4 ring-primary/30 ring-offset-base-100 ring-offset-4 transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-105">
          <img :src="user.avatar || defaultAvatar" alt="用户头像" class="transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      <div class="flex-1 w-full">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1
            class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <span v-if="loading" class="loading loading-dots loading-lg"></span>
            <span v-else>{{ user.name || '用户' }}</span>
          </h1>
        </div>
        <p class="text-base-content/80 mt-2 text-lg">
          🎯 加入时间：
          <span v-if="loading" class="loading loading-dots loading-sm"></span>
          <span v-else>{{ user.joinDate || '加载中...' }}</span>
        </p>

        <!-- 关键指标 -->
        <div class="stats shadow-xl mt-6 bg-base-100/90 backdrop-blur-sm border border-base-300/50">
          <div class="stat hover:bg-primary/5 transition-colors duration-300">
            <div class="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="stat-title text-primary/70">已完成行程</div>
            <div class="stat-value text-primary font-bold">
              <span v-if="loading" class="loading loading-spinner loading-md"></span>
              <span v-else>{{ user.stats.completedTrips }}</span>
            </div>
            <div class="stat-desc text-primary/60">次精彩旅程</div>
          </div>
          <div class="stat hover:bg-secondary/5 transition-colors duration-300">
            <div class="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div class="stat-title text-secondary/70">访问城市</div>
            <div class="stat-value text-secondary font-bold">
              <span v-if="loading" class="loading loading-spinner loading-md"></span>
              <span v-else>{{ user.stats.visitedCities }}</span>
            </div>
            <div class="stat-desc text-secondary/60">座美丽城市</div>
          </div>
          <div class="stat hover:bg-accent/5 transition-colors duration-300">
            <div class="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="inline-block w-8 h-8 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                </path>
              </svg>
            </div>
            <div class="stat-title text-accent/70">收藏景点</div>
            <div class="stat-value text-accent font-bold">
              <span v-if="loading" class="loading loading-spinner loading-md"></span>
              <span v-else>{{ user.stats.favoritesCount }}</span>
            </div>
            <div class="stat-desc text-accent/60">个心仪景点</div>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button class="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          @click="$emit('edit-profile')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block w-5 h-5 stroke-current mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
            </path>
          </svg>
          编辑资料
        </button>
        <button class="btn btn-outline btn-lg hover:btn-error transition-all duration-300" @click="$emit('logout')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block w-5 h-5 stroke-current mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          退出登录
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UserProfile } from '@/types/Travel-planning/attraction'
import defaultAvatar from '@/assets/user.jpg'

// Props
interface Props {
  user: UserProfile
  loading?: boolean
}

defineProps<Props>()

// Emits
defineEmits<{
  'edit-profile': []
  'logout': []
}>()
</script>

<style scoped>
/* 组件特定样式 */
</style>
