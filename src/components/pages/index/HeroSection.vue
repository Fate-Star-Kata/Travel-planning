<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any">
    <Motion :initial="heroVariants.initial" :animate="heroVariants.animate" :transition="heroVariants.transition as any">
      <section class="hero min-h-[70vh] bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 relative overflow-hidden">
        <!-- 装饰性背景元素 -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div class="hero-content text-center w-full max-w-5xl mx-auto relative z-10">
          <div class="w-full">
            <!-- 主标题区 -->
            <Motion :initial="titleVariants.initial" :animate="titleVariants.animate" :transition="titleVariants.transition as any">
              <div class="mb-8">
                <div class="flex items-center justify-center gap-4 mb-4">
                  <Motion :initial="iconVariants.initial" :animate="iconVariants.animate" :whileHover="iconVariants.whileHover as any" :transition="{ ...iconVariants.transition, delay: 0.3 } as any">
                    <div class="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                      <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z"/>
                      </svg>
                    </div>
                  </Motion>
                  <h1 class="text-6xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    智能旅游规划与导航
                  </h1>
                  <Motion :initial="iconVariants.initial" :animate="iconVariants.animate" :whileHover="iconVariants.whileHover as any" :transition="{ ...iconVariants.transition, delay: 0.4 } as any">
                    <div class="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center shadow-lg">
                      <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </Motion>
                </div>
                <p class="text-xl text-base-content/80 mb-2 font-medium">一站式规划行程、查询攻略与活动安排</p>
                <p class="text-base-content/60">🌟 享受轻松便捷的旅行体验 🌟</p>
              </div>
            </Motion>

            <!-- 搜索框 -->
            <Motion :initial="searchVariants.initial" :animate="searchVariants.animate" :transition="searchVariants.transition as any">
              <div class="relative mb-6">
                <div class="join w-full max-w-3xl mx-auto shadow-2xl">
                  <div class="relative join-item flex-1">
                    <input v-model="searchQuery" type="text" placeholder="🔍 搜索目的地、主题或景点..."
                           class="input input-bordered input-lg w-full pl-12 bg-base-100/95 backdrop-blur-sm border-2 border-primary/20 focus:border-primary focus:bg-base-100" 
                           @keyup.enter="handleSearch" />
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <Motion :whileHover="buttonVariants.whileHover as any" :whileTap="buttonVariants.whileTap as any">
                    <button class="btn btn-primary btn-lg join-item px-8 shadow-lg hover:shadow-xl transition-all duration-300" @click="handleSearch">
                      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                      </svg>
                      智能搜索
                    </button>
                  </Motion>
                </div>
              </div>
            </Motion>

            <!-- 预设关键词 -->
            <Motion :initial="keywordVariants.initial" :animate="keywordVariants.animate" :transition="keywordVariants.transition as any">
              <div class="flex flex-wrap gap-3 justify-center">
                <div class="text-sm text-base-content/60 mb-2 w-full">🔥 热门推荐</div>
                <Motion v-for="(k, index) in presetKeywords" :key="k" 
                        :initial="{ opacity: 0, scale: 0.8 }" 
                        :animate="{ opacity: 1, scale: 1 }"
                        :whileHover="{ scale: 1.1, transition: { duration: 0.2 } }"
                        :whileTap="{ scale: 0.95 }"
                        :transition="{ duration: 0.3, delay: 0.7 + index * 0.1, ease: 'easeOut' } as any">
                  <button class="badge badge-lg badge-outline cursor-pointer hover:badge-primary transition-all duration-300 shadow-md hover:shadow-lg px-4 py-3 font-medium"
                          @click="applyKeyword(k)">{{ k }}</button>
                </Motion>
              </div>
            </Motion>
          </div>
        </div>
      </section>
    </Motion>
  </Motion>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Motion } from 'motion-v'


// Props
interface Props {
  presetKeywords: string[]
}

const props = defineProps<Props>()

// Emits
interface Emits {
  search: [query: string]
  applyKeyword: [keyword: string]
}

const emit = defineEmits<Emits>()

// 响应式数据
const searchQuery = ref('')

// 动画变体
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease: 'easeOut' }
}

const heroVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: 'easeOut' }
}

const titleVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' }
}

const searchVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, delay: 0.4, ease: 'easeOut' }
}

const keywordVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.6, ease: 'easeOut' }
}

const iconVariants = {
  initial: { opacity: 0, scale: 0.5, rotate: -180 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  whileHover: { scale: 1.2, rotate: 10 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const buttonVariants = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
}

// 方法
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}

const applyKeyword = (keyword: string) => {
  searchQuery.value = keyword
  emit('applyKeyword', keyword)
}
</script>