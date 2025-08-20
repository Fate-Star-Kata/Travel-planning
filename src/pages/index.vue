<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any">
    <div class="min-h-screen bg-base-100">
      <!-- 标题区域：标题 + 搜索框 + 预设关键词 -->
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

    <!-- 主要内容：目的地推荐 -->
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
                <button class="btn btn-outline btn-primary gap-2 hover:scale-105 transition-all duration-300" @click="shuffleDestinations">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                  </svg>
                  换一换
                </button>
              </Motion>
            </div>
          </Motion>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Motion v-for="(d, index) in destinations" :key="d.id" 
                    :initial="cardVariants.initial" 
                    :animate="cardVariants.animate"
                    :whileHover="cardVariants.whileHover as any"
                    :transition="{ ...cardVariants.transition, delay: 1.4 + index * 0.1 } as any">
              <article class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 group border border-base-300/50 hover:border-primary/30">
                <div class="card-body p-6">
                  <div class="flex items-start justify-between mb-4">
                    <h3 class="card-title text-2xl font-bold group-hover:text-primary transition-colors duration-300">{{ d.name }}</h3>
                    <div class="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <p class="text-base-content/70 mb-4 leading-relaxed">{{ d.description }}</p>
                  <div class="card-actions justify-between items-center">
                    <div class="flex flex-wrap gap-2">
                      <span v-for="t in d.tags" :key="t" 
                            class="badge badge-outline badge-sm hover:badge-primary transition-all duration-300 cursor-default">{{ t }}</span>
                    </div>
                    <Motion :whileHover="buttonVariants.whileHover as any" :whileTap="buttonVariants.whileTap as any">
                      <button class="btn btn-primary btn-sm gap-2 transition-all duration-300 shadow-lg" @click="goPlanningWith(d.name)">
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

    <!-- 主要内容：旅游攻略 -->
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
                      <button class="btn btn-secondary btn-sm gap-2 transition-all duration-300 shadow-lg">
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

    <!-- 主要内容：旅游活动安排 -->
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
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h3 class="card-title text-2xl font-bold group-hover:text-accent transition-colors duration-300 mb-2">{{ a.name }}</h3>
                      <div class="flex flex-col gap-2">
                        <div class="flex items-center gap-2 text-base-content/70">
                          <svg class="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                          </svg>
                          <span class="font-medium">{{ a.date }}</span>
                        </div>
                        <div class="flex items-center gap-2 text-base-content/70">
                          <svg class="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                          </svg>
                          <span class="font-medium">{{ a.location }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="text-base-content/70 leading-relaxed mb-6">{{ a.desc }}</p>
                  <div class="card-actions justify-end">
                    <Motion :whileHover="buttonVariants.whileHover as any" :whileTap="buttonVariants.whileTap as any">
                      <button class="btn btn-accent btn-sm gap-2 transition-all duration-300 shadow-lg">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
                        </svg>
                        加入日程
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

    <!-- 底部信息区域 -->
    <Motion :initial="sectionVariants.initial" :animate="sectionVariants.animate" :transition="{ ...sectionVariants.transition, delay: 3.2 } as any">
      <footer class="bg-base-200 py-8 mt-16">
        <div class="container mx-auto px-4">
          <Motion :initial="titleVariants.initial" :animate="titleVariants.animate" :transition="{ ...titleVariants.transition, delay: 3.4 } as any">
            <div class="text-center">
              <h3 class="text-xl font-bold text-base-content mb-4">{{ serverConfig.VITE_APP_TITLE }}</h3>
              <p class="text-base-content/70">© 2024 智能旅游规划与导航 - 让每一次旅行都充满惊喜</p>
            </div>
          </Motion>
        </div>
      </footer>
    </Motion>
  </div>
</Motion>
</template>

<script setup lang="ts">
import serverConfig from '@/configs'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Motion } from 'motion-v'

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' }
}

const heroVariants = {
  initial: { opacity: 0, y: 50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 1.0, ease: 'easeOut' }
}

const titleVariants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' }
}

const searchVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, delay: 0.4, ease: 'easeOut' }
}

const keywordVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay: 0.6, ease: 'easeOut' }
}

const sectionVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: 'easeOut' }
}

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  whileHover: {
    scale: 1.02,
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  transition: { duration: 0.5, ease: 'easeOut' }
}

const iconVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  whileHover: {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const buttonVariants = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  whileTap: {
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeOut' }
  }
}

const router = useRouter()

// 搜索
const searchQuery = ref('')
const presetKeywords = ref<string[]>(['热门: 三亚', '亲子', '美食', '徒步', '海岛', '自驾'])
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  // 简单跳转到规划页并带上参数
  router.push({ path: '/planning', query: { q: searchQuery.value } })
}
const applyKeyword = (k: string) => {
  searchQuery.value = k.replace(/^热门:\s*/, '')
  handleSearch()
}

// 目的地推荐
interface Destination { id: number; name: string; description: string; tags: string[] }
const destinations = ref<Destination[]>([
  { id: 1, name: '三亚', description: '阳光海滩与美食天堂', tags: ['海岛', '美食', '亲子'] },
  { id: 2, name: '成都', description: '慢节奏美食之都，熊猫的故乡', tags: ['美食', '人文'] },
  { id: 3, name: '张家界', description: '世界自然遗产，绝美奇峰怪石', tags: ['徒步', '摄影'] },
  { id: 4, name: '杭州', description: '人间天堂西湖畔，茶香与古韵', tags: ['人文', '轻旅'] },
  { id: 5, name: '敦煌', description: '丝绸之路重镇，莫高窟壁画瑰宝', tags: ['历史', '人文'] },
  { id: 6, name: '青海湖', description: '高原湖泊，环湖骑行胜地', tags: ['自驾', '骑行'] },
])
const shuffleDestinations = () => {
  destinations.value = [...destinations.value].sort(() => Math.random() - 0.5)
}
const goPlanningWith = (name: string) => router.push({ path: '/planning', query: { dest: name } })

// 旅游攻略
interface Guide { id: number; title: string; summary: string }
const guides = ref<Guide[]>([
  { id: 1, title: '三亚自由行全攻略', summary: '机酒选择、景点路线与避坑指南，一文读懂三亚旅行。' },
  { id: 2, title: '成都美食地图', summary: '火锅、小吃、早茶、川菜馆的地道推荐与排队避坑。' },
  { id: 3, title: '青海湖环湖路线', summary: '自驾与骑行路线规划、补给点与露营地建议。' },
])

// 活动安排
interface Activity { id: number; name: string; date: string; location: string; desc: string }
const activities = ref<Activity[]>([
  { id: 1, name: '西湖夜游', date: '本周六 19:00', location: '杭州·西湖', desc: '乘船赏夜景，打卡音乐喷泉' },
  { id: 2, name: '落日骑行', date: '周末 17:30', location: '青海湖东岸', desc: '骑行看日落与星空' },
  { id: 3, name: '海鲜市集', date: '每日 10:00', location: '三亚·第一市场', desc: '尝遍新鲜海味，教你不被宰' },
])
</script>
