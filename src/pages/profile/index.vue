<template>
  <div class="w-full">
    <!-- 顶部个人信息横幅（全屏化重点区域） -->
    <section class="w-full bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-30"></div>
      <div class="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center gap-8 relative z-10">
        <div class="avatar group">
          <div class="w-32 rounded-full ring-4 ring-primary/30 ring-offset-base-100 ring-offset-4 transition-all duration-300 group-hover:ring-primary/50 group-hover:scale-105">
            <img :src="user.avatar" alt="用户头像" class="transition-transform duration-300 group-hover:scale-110" />
          </div>
        </div>
        <div class="flex-1 w-full">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{{ user.name }}</h1>
            <div class="badge badge-warning badge-lg shadow-lg animate-pulse">✨ {{ user.level }}</div>
          </div>
          <p class="text-base-content/80 mt-2 text-lg">🎯 加入时间：{{ user.joinDate }}</p>

          <!-- 关键指标 -->
          <div class="stats shadow-xl mt-6 bg-base-100/90 backdrop-blur-sm border border-base-300/50">
            <div class="stat hover:bg-primary/5 transition-colors duration-300">
              <div class="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div class="stat-title text-primary/70">已完成行程</div>
              <div class="stat-value text-primary font-bold">{{ user.stats.completedTrips }}</div>
              <div class="stat-desc text-primary/60">次精彩旅程</div>
            </div>
            <div class="stat hover:bg-secondary/5 transition-colors duration-300">
              <div class="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <div class="stat-title text-secondary/70">访问城市</div>
              <div class="stat-value text-secondary font-bold">{{ user.stats.visitedCities }}</div>
              <div class="stat-desc text-secondary/60">座美丽城市</div>
            </div>
            <div class="stat hover:bg-accent/5 transition-colors duration-300">
              <div class="stat-figure text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <div class="stat-title text-accent/70">收藏景点</div>
              <div class="stat-value text-accent font-bold">{{ user.stats.favoritesCount }}</div>
              <div class="stat-desc text-accent/60">个心仪景点</div>
            </div>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <button class="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" @click="onEditProfile">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            编辑资料
          </button>
          <button class="btn btn-outline btn-lg hover:btn-error transition-all duration-300" @click="onLogout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            退出登录
          </button>
        </div>
      </div>
    </section>

    <!-- 主体内容区 -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：功能菜单 -->
        <div class="space-y-6 lg:col-span-1">
          <!-- 我的行程 -->
          <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
            <div class="card-body p-0">
              <h2 class="card-title px-6 pt-6 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                我的行程
              </h2>
              <ul class="menu menu-lg w-full">
                <li v-for="item in tripMenu" :key="item.key">
                  <a @click.prevent="onMenuClick(item)" class="flex items-center gap-4 hover:bg-primary/10 transition-all duration-300 group">
                    <span class="text-2xl group-hover:scale-110 transition-transform duration-300">{{ item.icon }}</span>
                    <span class="flex-1 font-medium">{{ item.label }}</span>
                    <span class="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">›</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- 账户设置 -->
          <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
            <div class="card-body p-0">
              <h2 class="card-title px-6 pt-6 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                账户设置
              </h2>
              <ul class="menu menu-lg w-full">
                <li v-for="item in accountMenu" :key="item.key">
                  <a @click.prevent="onMenuClick(item)" class="flex items-center gap-4 hover:bg-secondary/10 transition-all duration-300 group">
                    <span class="text-2xl group-hover:scale-110 transition-transform duration-300">{{ item.icon }}</span>
                    <span class="flex-1 font-medium">{{ item.label }}</span>
                    <span class="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">›</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 右侧：最近行程（占两列） -->
        <div class="lg:col-span-2 space-y-6">
          <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center justify-between mb-4">
                <h2 class="card-title text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  最近行程
                </h2>
                <button class="btn btn-ghost btn-sm hover:btn-accent transition-all duration-300" @click="onViewAllTrips">
                  查看全部
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current ml-1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>

              <div v-if="recentTrips.length === 0" class="text-center py-12">
                <div class="text-6xl mb-4">🗺️</div>
                <p class="text-base-content/70 text-lg">暂无行程，去创建你的第一个行程吧～</p>
                <button class="btn btn-primary mt-4">创建行程</button>
              </div>

              <div v-else class="space-y-6">
                <div v-for="trip in recentTrips" :key="trip.id" class="group hover:bg-base-200/50 p-4 rounded-2xl transition-all duration-300">
                  <div class="grid grid-cols-12 gap-4 items-center">
                    <div class="col-span-12 sm:col-span-3">
                      <div class="rounded-2xl overflow-hidden aspect-[4/3] bg-base-200 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <img :src="trip.cover" alt="行程图片" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    </div>
                    <div class="col-span-12 sm:col-span-6">
                      <h3 class="font-bold text-xl mb-2 group-hover:text-primary transition-colors duration-300">{{ trip.title }}</h3>
                      <p class="text-base-content/70 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        {{ trip.dateRange }}
                      </p>
                      <div class="flex items-center gap-2">
                        <span class="badge badge-lg" :class="statusBadgeClass(trip.status)">{{ statusText(trip.status) }}</span>
                      </div>
                    </div>
                    <div class="col-span-12 sm:col-span-3 flex flex-col gap-2">
                      <button class="btn btn-sm btn-outline hover:btn-primary transition-all duration-300" @click="onTripView(trip)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current mr-1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        查看详情
                      </button>
                      <button class="btn btn-sm btn-primary shadow-lg hover:shadow-xl transition-all duration-300" @click="onTripEdit(trip)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current mr-1"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        修改行程
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 收藏/评价 快捷区（可选，增强信息密度） -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
              <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="card-title text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    我的收藏
                  </h3>
                  <div class="text-3xl">💝</div>
                </div>
                <div class="stats stats-vertical shadow bg-gradient-to-br from-accent/10 to-accent/5 mb-4">
                  <div class="stat">
                    <div class="stat-title text-accent/70">收藏景点</div>
                    <div class="stat-value text-accent font-bold">{{ user.stats.favoritesCount }}</div>
                    <div class="stat-desc text-accent/60">个心仪地点</div>
                  </div>
                </div>
                <button class="btn btn-accent btn-sm w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" @click="onOpenFavorites">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  查看收藏
                </button>
              </div>
            </div>
            <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
              <div class="card-body">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="card-title text-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                    我的评价
                  </h3>
                  <div class="text-3xl">⭐</div>
                </div>
                <div class="text-center py-6">
                  <div class="text-warning/70 mb-2">近期还没有新的评价</div>
                  <div class="text-sm text-base-content/50">分享你的旅行体验，帮助其他旅行者</div>
                </div>
                <button class="btn btn-warning btn-sm w-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" @click="onOpenReviews">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current mr-2"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>
                  去评价
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <div class="toast toast-end z-50" v-if="toast.show">
      <div class="alert" :class="toast.type === 'success' ? 'alert-success' : 'alert-info'">
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// 类型定义
interface UserStats {
  completedTrips: number
  visitedCities: number
  favoritesCount: number
}

interface UserProfile {
  name: string
  avatar: string
  level: '黄金会员' | '白银会员' | '铂金会员' | '普通会员'
  joinDate: string
  stats: UserStats
}

interface MenuItem {
  key: string
  label: string
  icon: string // 使用 Emoji 充当图标，避免额外依赖
}

type TripStatus = 'completed' | 'upcoming' | 'planning'

interface TripItem {
  id: string
  title: string
  dateRange: string
  status: TripStatus
  cover: string
}

// 模拟数据
const user: UserProfile = reactive({
  name: '张三',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNGRkY3RUQiLz4KPHN2ZyB4PSIzMiIgeT0iMjQiIHdpZHRoPSI2NCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRjU5RTBCIj4KPHA+dGggZD0iTTEyIDEyYzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00LTQgMS43OS00IDQgMS43OSA0IDQgNHptMCAyYy0yLjY3IDAtOCAxLjM0LTggNHYyaDE2di0yYzAtMi42Ni01LjMzLTQtOC00eiIvPgo8L3N2Zz4KPC9zdmc+',
  level: '黄金会员',
  joinDate: '2023年5月',
  stats: {
    completedTrips: 15,
    visitedCities: 42,
    favoritesCount: 128,
  },
})

const tripMenu: MenuItem[] = reactive([
  { key: 'history', label: '历史行程', icon: '📅' },
  { key: 'favorites', label: '收藏景点', icon: '🔖' },
  { key: 'reviews', label: '我的评价', icon: '❤️' },
])

const accountMenu: MenuItem[] = reactive([
  { key: 'profile', label: '个人信息', icon: '👤' },
  { key: 'preferences', label: '偏好设置', icon: '⚙️' },
  { key: 'privacy', label: '隐私安全', icon: '🛡️' },
])

const recentTrips: TripItem[] = reactive([
  {
    id: 't1',
    title: '北京文化之旅',
    dateRange: '2024年2月15日 - 2月18日',
    status: 'completed',
    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDMyMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRkZGN0VEIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iI0Y1OUUwQiIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuWMl+S6rOaWh+WMluS5i+aXhTwvdGV4dD4KPC9zdmc+',
  },
  {
    id: 't2',
    title: '杭州西湖游',
    dateRange: '2024年3月20日 - 3月22日',
    status: 'upcoming',
    cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDMyMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRUZGNkZGIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iIzM3MzNEQyIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuadreW3nuilv+a5luaXhTwvdGV4dD4KPC9zdmc+',
  },
])

// Toast 状态
const toast = reactive({ show: false, message: '', type: 'info' as 'info' | 'success' })
let toastTimer: number | undefined

function showToast(message: string, type: 'info' | 'success' = 'info') {
  toast.message = message
  toast.type = type
  toast.show = true
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.show = false), 1800)
}

// 交互事件
function onEditProfile() {
  showToast('打开个人资料编辑（示例）', 'info')
}

function onLogout() {
  showToast('已退出（示例）', 'success')
}

function onMenuClick(item: MenuItem) {
  showToast(`${item.label} 功能正在建设中`, 'info')
}

function onViewAllTrips() {
  showToast('查看全部行程（示例）', 'info')
}

function onTripView(trip: TripItem) {
  showToast(`查看行程：${trip.title}`, 'info')
}

function onTripEdit(trip: TripItem) {
  showToast(`修改行程：${trip.title}`, 'success')
}

function onOpenFavorites() {
  showToast('查看我的收藏（示例）', 'info')
}

function onOpenReviews() {
  showToast('查看我的评价（示例）', 'info')
}

// 工具：状态文本与样式
function statusText(status: TripStatus) {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'upcoming':
      return '即将开始'
    default:
      return '规划中'
  }
}

function statusBadgeClass(status: TripStatus) {
  switch (status) {
    case 'completed':
      return 'badge-success'
    case 'upcoming':
      return 'badge-warning'
    default:
      return 'badge-info'
  }
}
</script>
