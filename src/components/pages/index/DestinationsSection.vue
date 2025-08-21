<template>
  <Motion :initial="sectionVariants.initial" :animate="sectionVariants.animate" :transition="{ ...sectionVariants.transition, delay: 0.8 } as any">
    <section class="py-16 bg-gradient-to-b from-base-100 to-base-200/50">
      <div class="container mx-auto px-4">
        <Motion :initial="titleVariants.initial" :animate="titleVariants.animate" :transition="{ ...titleVariants.transition, delay: 1.0 } as any">
          <div class="flex items-end justify-between mb-10">
            <div class="flex items-center gap-4">
              <Motion :initial="iconVariants.initial" :animate="iconVariants.animate" :whileHover="iconVariants.whileHover as any" :transition="{ ...iconVariants.transition, delay: 1.2 } as any">
                <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
              </Motion>
              <h2 class="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">旅游目的地推荐</h2>
            </div>
            <Motion :whileHover="buttonVariants.whileHover as any" :whileTap="buttonVariants.whileTap as any">
              <button class="btn btn-outline btn-primary gap-2 hover:scale-105 transition-all duration-300" @click="handleShuffle">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                </svg>
                换一换
              </button>
            </Motion>
          </div>
        </Motion>
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="loading loading-spinner loading-lg text-primary"></div>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Motion v-for="(d, index) in destinations" :key="d.id" 
                  :initial="cardVariants.initial" 
                  :animate="cardVariants.animate"
                  :whileHover="cardVariants.whileHover as any"
                  :transition="{ ...cardVariants.transition, delay: 1.4 + index * 0.1 } as any">
            <article class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 group border border-base-300/50 hover:border-primary/30 cursor-pointer" @click="handleShowDetail(d.id)">
              <div class="card-body p-6">
                <div class="flex items-start justify-between mb-4">
                  <h3 class="card-title text-2xl font-bold group-hover:text-primary transition-colors duration-300">{{ d.name }}</h3>
                  <div class="flex items-center gap-2">
                    <button 
                      class="btn btn-ghost btn-sm btn-circle hover:btn-error transition-all duration-300" 
                      :class="{ 'text-red-500': d.isFavorited }"
                      @click="handleFavorite(d.id, $event)"
                      :title="d.isFavorited ? '已收藏' : '收藏'">
                      <svg class="w-5 h-5" :fill="d.isFavorited ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                    </button>
                    <div class="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="text-base-content/70 mb-4 leading-relaxed">{{ d.description }}</p>
                <div class="card-actions justify-between items-center">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="t in d.tags" :key="t" 
                          class="badge badge-outline badge-sm hover:badge-primary transition-all duration-300 cursor-default">{{ t }}</span>
                  </div>
                  <Motion :whileHover="buttonVariants.whileHover as any" :whileTap="buttonVariants.whileTap as any">
                    <button class="btn btn-primary btn-sm gap-2 transition-all duration-300 shadow-lg" @click.stop="handleGoPlanning(d.name)">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
                      </svg>
                      去规划
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

import type { Attraction } from '@/types/Travel-planning/attraction'

// Props
interface Props {
  destinations: Attraction[]
  loading: boolean
}

const props = defineProps<Props>()

// Emits
interface Emits {
  shuffle: []
  showDetail: [id: number]
  favorite: [id: number, event: Event]
  startPlanning: [name: string]
}

const emit = defineEmits<Emits>()

// 动画变体
const sectionVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
}

const titleVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
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
const handleShuffle = () => {
  emit('shuffle')
}

const handleShowDetail = (id: number) => {
  emit('showDetail', id)
}

const handleFavorite = (id: number, event: Event) => {
  emit('favorite', id, event)
}

const handleGoPlanning = (name: string) => {
  emit('startPlanning', name)
}
</script>