<template>
  <Motion :initial="sectionVariants.initial" :animate="sectionVariants.animate" :transition="{ ...sectionVariants.transition, delay: 1.6 } as any">
    <section class="py-16 bg-gradient-to-br from-base-200/80 via-base-200 to-base-300/50 relative">
      <!-- 装饰背景 -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-10 right-20 w-24 h-24 bg-primary rounded-full blur-2xl"></div>
        <div class="absolute bottom-10 left-20 w-32 h-32 bg-secondary rounded-full blur-2xl"></div>
      </div>
      
      <div class="container mx-auto px-4 relative z-10">
        <Motion :initial="titleVariants.initial" :animate="titleVariants.animate" :transition="{ ...titleVariants.transition, delay: 1.8 } as any">
          <div class="text-center mb-12">
            <div class="flex items-center justify-center gap-4 mb-4">
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate" :whileHover="iconVariants.whileHover as any" :transition="{ ...iconVariants.transition, delay: 2.0 } as any">
                <div class="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                  </svg>
                </div>
              </Motion>
              <h2 class="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">旅游攻略</h2>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate" :whileHover="iconVariants.whileHover as any" :transition="{ ...iconVariants.transition, delay: 2.1 } as any">
                <div class="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </Motion>
            </div>
            <p class="text-base-content/70 text-lg">📚 精选旅游攻略，让你的旅行更精彩</p>
          </div>
        </Motion>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Motion v-for="(g, index) in guides" :key="g.id" 
                  :initial="cardVariants.initial" 
                  :animate="cardVariants.animate"
                  :whileHover="cardVariants.whileHover as any"
                  :transition="{ ...cardVariants.transition, delay: 2.2 + index * 0.15 } as any">
            <article class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 group border border-base-300/50 hover:border-secondary/30">
              <div class="card-body p-6">
                <div class="flex items-start gap-3 mb-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <svg class="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                    </svg>
                  </div>
                  <h3 class="card-title text-xl font-bold group-hover:text-secondary transition-colors duration-300 leading-tight">{{ g.title }}</h3>
                </div>
                <p class="text-base-content/70 line-clamp-3 leading-relaxed mb-6">{{ g.summary }}</p>
                <div class="card-actions justify-end">
                  <Motion :whileHover="buttonVariants.whileHover as any" :whileTap="buttonVariants.whileTap as any">
                    <button class="btn btn-secondary btn-sm gap-2 transition-all duration-300 shadow-lg" @click="handleViewDetail(g.id)">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                      查看详情
                    </button>
                  </Motion>
                </div>
              </div>
            </article>
          </Motion>
        </div>
      </div>
    </section>
  </Motion>
</template>

<script setup lang="ts">
import { Motion } from 'motion-v'


// 攻略接口定义
interface Guide {
  id: number
  title: string
  summary: string
}

// Props
interface Props {
  guides: Guide[]
}

const props = defineProps<Props>()

// Emits
interface Emits {
  viewDetail: [id: number]
}

const emit = defineEmits<Emits>()

// 动画变体
const sectionVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
}

const titleVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: { y: -5, scale: 1.02 },
  transition: { duration: 0.5, ease: 'easeOut' }
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
const handleViewDetail = (id: number) => {
  emit('viewDetail', id)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>