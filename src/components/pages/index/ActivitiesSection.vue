<template>
  <Motion :initial="sectionVariants.initial" :animate="sectionVariants.animate" :transition="{ ...sectionVariants.transition, delay: 2.4 } as any">
    <section class="py-16 bg-gradient-to-b from-base-100 to-base-200/30">
      <div class="container mx-auto px-4">
        <Motion :initial="titleVariants.initial" :animate="titleVariants.animate" :transition="{ ...titleVariants.transition, delay: 2.6 } as any">
          <div class="text-center mb-12">
            <div class="flex items-center justify-center gap-4 mb-4">
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate" :whileHover="iconVariants.whileHover as any" :transition="{ ...iconVariants.transition, delay: 2.8 } as any">
                <div class="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </Motion>
              <h2 class="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">旅游活动安排</h2>
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate" :whileHover="iconVariants.whileHover as any" :transition="{ ...iconVariants.transition, delay: 2.9 } as any">
                <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </Motion>
            </div>
            <p class="text-base-content/70 text-lg">🎯 精彩活动等你参与，丰富你的旅行体验</p>
          </div>
        </Motion>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Motion v-for="(a, index) in activities" :key="a.id" 
                  :initial="cardVariants.initial" 
                  :animate="cardVariants.animate"
                  :whileHover="cardVariants.whileHover as any"
                  :transition="{ ...cardVariants.transition, delay: 3.0 + index * 0.15 } as any">
            <article class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 group border border-base-300/50 hover:border-accent/30">
              <div class="card-body p-6">
                <div class="flex items-start gap-4 mb-4">
                  <div class="w-14 h-14 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <svg class="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="card-title text-2xl font-bold group-hover:text-accent transition-colors duration-300 mb-2">{{ a.title }}</h3>
                    <div class="flex items-center gap-2 text-sm text-base-content/60 mb-3">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                      </svg>
                      <span>{{ a.duration }}</span>
                      <span class="mx-2">•</span>
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                      </svg>
                      <span>{{ a.location }}</span>
                    </div>
                  </div>
                </div>
                <p class="text-base-content/70 leading-relaxed mb-6">{{ a.description }}</p>
                <div class="card-actions justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold text-accent">{{ a.price }}</span>
                    <span class="text-sm text-base-content/60">起</span>
                  </div>
                  <Motion :whileHover="buttonVariants.whileHover as any" :whileTap="buttonVariants.whileTap as any">
                    <button class="btn btn-accent btn-sm gap-2 transition-all duration-300 shadow-lg" @click="handleJoinActivity(a.id)">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                      立即参与
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


// 活动接口定义
interface Activity {
  id: number
  title: string
  description: string
  duration: string
  location: string
  price: string
}

// Props
interface Props {
  activities: Activity[]
}

const props = defineProps<Props>()

// Emits
interface Emits {
  joinActivity: [id: number]
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
const handleJoinActivity = (id: number) => {
  emit('joinActivity', id)
}
</script>