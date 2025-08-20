<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/3 w-24 h-24 bg-accent rounded-full blur-2xl"></div>
    </div>
    
    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- 页面标题区 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="p-3 bg-primary/10 rounded-2xl">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">智能行程规划</h1>
        </div>
        <p class="text-lg opacity-70 max-w-2xl mx-auto">基于AI算法，根据你的偏好和预算自动生成个性化旅行日程</p>
        
        <!-- 快捷操作按钮 -->
        <div class="flex items-center justify-center gap-4 mt-6">
          <div class="join hidden md:inline-flex">
            <button class="btn btn-outline join-item gap-2" @click="resetForm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              重置表单
            </button>
            <button class="btn btn-primary join-item gap-2" :class="{ loading: generating }" @click="generatePlan">
              <svg v-if="!generating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              {{ generating ? '生成中...' : '智能生成' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 表单区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
            <div class="card-body space-y-6">
              <!-- 目的地输入 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    目的地
                  </span>
                </label>
                <input v-model="form.destination" type="text" placeholder="如：三亚、成都、巴厘岛..." class="input input-bordered w-full focus:input-primary transition-colors" />
              </div>
              
              <!-- 日期和天数 -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold flex items-center gap-2">
                      <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      出发日期
                    </span>
                  </label>
                  <input v-model="form.startDate" type="date" class="input input-bordered w-full focus:input-secondary transition-colors" />
                </div>
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-semibold flex items-center gap-2">
                      <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      天数
                    </span>
                  </label>
                  <input v-model.number="form.days" type="number" min="1" max="30" class="input input-bordered w-full focus:input-accent transition-colors" />
                </div>
              </div>
              
              <!-- 预算范围 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    预算范围 (¥{{ form.budgetMin.toLocaleString() }} - ¥{{ form.budgetMax.toLocaleString() }})
                  </span>
                </label>
                <div class="flex items-center gap-3">
                  <div class="flex-1">
                    <input v-model.number="form.budgetMin" type="number" min="0" placeholder="最低" class="input input-sm input-bordered w-full focus:input-warning transition-colors" />
                  </div>
                  <span class="text-base-content/50">至</span>
                  <div class="flex-1">
                    <input v-model.number="form.budgetMax" type="number" :min="form.budgetMin" placeholder="最高" class="input input-sm input-bordered w-full focus:input-warning transition-colors" />
                  </div>
                </div>
              </div>
              
              <!-- 出行方式 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    出行方式
                  </span>
                </label>
                <select v-model="form.groupType" class="select select-bordered w-full focus:select-info transition-colors">
                  <option value="solo">🧳 个人旅行</option>
                  <option value="couple">💕 情侣出行</option>
                  <option value="family">👨‍👩‍👧‍👦 亲子家庭</option>
                  <option value="friends">👥 朋友团体</option>
                </select>
              </div>
              
              <!-- 偏好标签 -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold flex items-center gap-2">
                    <svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    兴趣偏好
                  </span>
                </label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="tag in allTags" :key="tag" class="badge badge-outline cursor-pointer select-none hover:scale-105 transition-all duration-200" :class="{ 'badge-primary text-white shadow-lg': form.tags.includes(tag) }" @click="toggleTag(tag)">{{ tag }}</button>
                </div>
              </div>
              
              <!-- 移动端生成按钮 -->
              <div class="md:hidden pt-4">
                <button class="btn btn-primary w-full gap-2" :class="{ loading: generating }" @click="generatePlan">
                  <svg v-if="!generating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  {{ generating ? '生成中...' : '智能生成' }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 结果区 -->
        <section class="lg:col-span-2">
          <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <!-- 结果区标题 -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-xl">
                    <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h2 class="text-2xl font-bold">智能生成结果</h2>
                </div>
                <div class="join">
                  <button class="btn btn-ghost join-item gap-2" :disabled="!itinerary.length" @click="exportPlan">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    导出
                  </button>
                  <button class="btn btn-primary join-item gap-2" :disabled="!itinerary.length" @click="copyPlan">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    复制
                  </button>
                </div>
              </div>

              <!-- 空状态 -->
              <div v-if="!itinerary.length && !generating" class="text-center py-16">
                <div class="mb-6">
                  <div class="inline-flex p-4 bg-base-200 rounded-full mb-4">
                    <svg class="w-12 h-12 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold mb-2">开始规划你的旅程</h3>
                  <p class="text-base-content/60">填写左侧表单信息，点击"智能生成"按钮</p>
                </div>
              </div>
              
              <!-- 加载状态 -->
              <div v-if="generating" class="text-center py-16">
                <div class="flex flex-col items-center gap-4">
                  <span class="loading loading-spinner loading-lg text-primary"></span>
                  <div class="space-y-2">
                    <h3 class="text-xl font-semibold">AI正在为你规划行程...</h3>
                    <p class="text-base-content/60">根据你的偏好生成个性化旅行方案</p>
                  </div>
                </div>
              </div>

              <!-- 行程结果 -->
              <div v-if="itinerary.length" class="space-y-4">
                <article v-for="day in itinerary" :key="day.day" class="collapse collapse-arrow bg-gradient-to-r from-base-200 to-base-100 border border-base-300/30 hover:shadow-lg transition-all duration-300">
                  <input type="checkbox" />
                  <div class="collapse-title text-xl font-medium flex items-center gap-3">
                    <div class="badge badge-primary badge-lg">{{ day.day }}</div>
                    <span>{{ day.title }}</span>
                  </div>
                  <div class="collapse-content space-y-4 pt-4">
                    <!-- 活动安排 -->
                    <div class="bg-base-100 p-4 rounded-xl border border-base-300/30">
                      <div class="flex items-center gap-2 mb-3">
                        <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p class="font-semibold text-primary">活动安排</p>
                      </div>
                      <ul class="space-y-2">
                        <li v-for="a in day.activities" :key="a" class="flex items-start gap-2 text-base-content/80">
                          <span class="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>{{ a }}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <!-- 用餐安排 -->
                    <div v-if="day.meals?.length" class="bg-base-100 p-4 rounded-xl border border-base-300/30">
                      <div class="flex items-center gap-2 mb-3">
                        <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                        </svg>
                        <p class="font-semibold text-secondary">用餐推荐</p>
                      </div>
                      <ul class="space-y-2">
                        <li v-for="m in day.meals" :key="m" class="flex items-start gap-2 text-base-content/80">
                          <span class="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                          <span>{{ m }}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <!-- 其他信息 -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-if="day.accommodation" class="bg-base-100 p-3 rounded-lg border border-base-300/30">
                        <div class="flex items-center gap-2 mb-2">
                          <svg class="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                          </svg>
                          <span class="font-medium text-accent">住宿</span>
                        </div>
                        <p class="text-sm text-base-content/80">{{ day.accommodation }}</p>
                      </div>
                      <div v-if="day.transportation" class="bg-base-100 p-3 rounded-lg border border-base-300/30">
                        <div class="flex items-center gap-2 mb-2">
                          <svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                          </svg>
                          <span class="font-medium text-info">交通</span>
                        </div>
                        <p class="text-sm text-base-content/80">{{ day.transportation }}</p>
                      </div>
                    </div>
                    
                    <!-- 备注 -->
                    <div v-if="day.notes" class="bg-warning/10 p-3 rounded-lg border border-warning/20">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="font-medium text-warning">温馨提示</span>
                      </div>
                      <p class="text-sm text-base-content/70">{{ day.notes }}</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 底部信息 -->
      <footer class="mt-10 text-center opacity-70">
        温馨提示：以上方案为智能生成，仅供参考，请结合实际情况调整。
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteDay } from '@/types/apis/travel'

const route = useRoute()

const form = reactive({
  destination: '',
  startDate: new Date().toISOString().slice(0, 10),
  days: 3,
  budgetMin: 1000,
  budgetMax: 5000,
  groupType: 'solo' as 'solo' | 'couple' | 'family' | 'friends',
  tags: [] as string[],
})

const allTags = ['美食', '人文', '自然', '海岛', '徒步', '摄影', '自驾', '亲子', '轻奢', '省钱']
const generating = ref(false)
const itinerary = ref<RouteDay[]>([])

onMounted(() => {
  // 从首页或外部链接带入关键词
  const q = (route.query.q as string) || (route.query.dest as string)
  if (q) form.destination = q
})

function toggleTag(tag: string) {
  const i = form.tags.indexOf(tag)
  if (i >= 0) form.tags.splice(i, 1)
  else form.tags.push(tag)
}

function resetForm() {
  form.destination = ''
  form.days = 3
  form.budgetMin = 1000
  form.budgetMax = 5000
  form.groupType = 'solo'
  form.tags = []
  itinerary.value = []
}

async function generatePlan() {
  if (!form.destination.trim()) return alert('请输入目的地')
  generating.value = true
  itinerary.value = []
  // 纯本地模拟生成，保留加载态体验
  await new Promise(resolve => setTimeout(resolve, 600))
  itinerary.value = mockItinerary()
  generating.value = false
}

function mockItinerary(): RouteDay[] {
  const days: RouteDay[] = []
  for (let i = 1; i <= form.days; i++) {
    days.push({
      day: i,
      title: `${form.destination}·城市探索${i}`,
      activities: [
        '上午：热门景点打卡',
        '中午：本地美食体验',
        '下午：特色街区漫步',
        '晚上：夜景/市集',
      ],
      meals: ['午餐：当地小吃', '晚餐：网红餐厅'],
      transportation: '地铁/打车/步行',
      notes: '合理安排休息，注意防晒补水',
    })
  }
  return days
}

function exportPlan() {
  const blob = new Blob([JSON.stringify({ ...form, itinerary: itinerary.value }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `行程规划-${form.destination}-${form.startDate}.json`
  a.click()
  URL.revokeObjectURL(url)
}

async function copyPlan() {
  const text = itinerary.value.map(d => `第${d.day}天 ${d.title}\n- ${d.activities.join('\n- ')}`).join('\n\n')
  await navigator.clipboard.writeText(text)
  alert('已复制到剪贴板')
}
</script>