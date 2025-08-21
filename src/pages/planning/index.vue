<template>
  <div class="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
    <!-- 页面头部 -->
    <PageHeader @quick-action="handleQuickAction" />

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 表单区 -->
        <section>
          <PlanningForm :form-data="form" :loading="generating" @update:form-data="updateFormData" @reset="resetForm"
            @generate="generatePlan" @toggle-preference="togglePreference" />
        </section>

        <!-- 结果区 -->
        <section class="lg:col-span-2">
          <ItineraryResult :itinerary="itinerary" :trip-plan="tripPlan" :loading="generating" :error="error"
            @export="exportPlan" @copy="copyPlan" />
        </section>
      </div>

      <!-- 页面底部 -->
    </div>
    <PageFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { generateTravelPlan, transformFormDataToRequest } from '@/api/Travel-planning/travel-plan'
import type { RouteDay } from '@/types/apis/travel'
import type { PlanningFormData, TripPlan } from '@/types/Travel-planning/travel-plan'
import PageHeader from '@/components/pages/planning/PageHeader.vue'
import PlanningForm from '@/components/pages/planning/PlanningForm.vue'
import ItineraryResult from '@/components/pages/planning/ItineraryResult.vue'
import PageFooter from '@/components/pages/planning/PageFooter.vue'

const route = useRoute()

const form = reactive<PlanningFormData>({
  destination: '',
  start_date: new Date().toISOString().slice(0, 10),
  end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // 默认3天后
  budget: 3000,
  preferences: [],
  travel_style: '休闲',
  max_attractions_per_day: 3,
  transportation: '公共交通',
  accessibility_needs: false,
})

// 移除allTags，现在使用TRAVEL_PREFERENCES常量
const generating = ref(false)
const itinerary = ref<RouteDay[]>([])
const tripPlan = ref<TripPlan | null>(null)
const error = ref<string>('')

onMounted(() => {
  // 从首页或外部链接带入关键词
  const q = (route.query.q as string) || (route.query.dest as string)
  if (q) form.destination = q
})

// 处理快捷操作
function handleQuickAction(action: string) {
  console.log('快捷操作:', action)
  // 这里可以根据不同的action执行相应的逻辑
  switch (action) {
    case 'popular':
      ElMessage.info('热门目的地功能开发中...')
      break
    case 'template':
      ElMessage.info('行程模板功能开发中...')
      break
    case 'history':
      ElMessage.info('历史记录功能开发中...')
      break
  }
}

// 更新表单数据
function updateFormData(newData: Partial<PlanningFormData>) {
  Object.assign(form, newData)
}

function togglePreference(preference: string) {
  const i = form.preferences.indexOf(preference)
  if (i >= 0) form.preferences.splice(i, 1)
  else form.preferences.push(preference)
}

function resetForm() {
  form.destination = ''
  form.start_date = new Date().toISOString().slice(0, 10)
  form.end_date = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  form.budget = 3000
  form.preferences = []
  form.travel_style = '休闲'
  form.max_attractions_per_day = 3
  form.transportation = '公共交通'
  form.accessibility_needs = false
  itinerary.value = []
  tripPlan.value = null
  error.value = ''
}

async function generatePlan() {
  if (!form.destination.trim()) {
    ElMessage.warning('请输入目的地')
    return
  }

  generating.value = true
  itinerary.value = []
  tripPlan.value = null
  error.value = ''

  try {
    // 转换表单数据为API请求格式
    const requestData = transformFormDataToRequest(form)

    // 调用API生成旅行计划
    const response = await generateTravelPlan(requestData)

    if (response.code === 200 && response.data) {
      tripPlan.value = response.data.trip_plan
      // 转换API响应数据为前端展示格式
      itinerary.value = transformTripPlanToRouteDay(response.data.trip_plan)
      ElMessage.success('行程规划生成成功！')
    } else {
      throw new Error(response.msg || '生成失败')
    }
  } catch (err: any) {
    console.error('生成旅行计划失败:', err)
    error.value = err.message || '生成失败，请稍后重试'
    ElMessage.error(error.value)

    // 如果API失败，回退到模拟数据（可选）
    if (import.meta.env.DEV) {
      console.log('开发环境：使用模拟数据')
      itinerary.value = mockItinerary()
    }
  } finally {
    generating.value = false
  }
}

/**
 * 将API响应的TripPlan转换为前端展示的RouteDay格式
 */
function transformTripPlanToRouteDay(tripPlan: TripPlan): RouteDay[] {
  return tripPlan.days.map(day => {
    const activities = day.attractions.map(attraction =>
      `${attraction.planned_start_time} ${attraction.attraction_name} (${Math.floor(attraction.planned_duration / 60)}小时)`
    )

    return {
      day: day.day_number,
      title: day.theme,
      activities,
      accommodation: undefined, // API响应中没有住宿安排，设为可选
      meals: [], // API响应中没有具体的餐饮安排，可以根据需要扩展
      transportation: '根据景点位置选择合适交通方式',
      notes: day.notes
    }
  })
}

/**
 * 模拟数据生成函数（开发环境备用）
 */
function mockItinerary(): RouteDay[] {
  const routeDays: RouteDay[] = []
  const dayCount = Math.ceil((new Date(form.end_date).getTime() - new Date(form.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1
  for (let i = 1; i <= dayCount; i++) {
    routeDays.push({
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
  return routeDays
}

function exportPlan() {
  const exportData = {
    formData: form,
    itinerary: itinerary.value,
    tripPlan: tripPlan.value,
    generatedAt: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `行程规划-${form.destination}-${form.start_date}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('行程已导出')
}

async function copyPlan() {
  try {
    let text = ''

    if (tripPlan.value) {
      text = `${tripPlan.value.title}\n`
      text += `目的地：${tripPlan.value.destination_city}\n`
      text += `时间：${tripPlan.value.start_date} 至 ${tripPlan.value.end_date}\n`
      text += `人数：${tripPlan.value.traveler_count}人\n`
      text += `预算：¥${tripPlan.value.estimated_budget}\n\n`

      if (tripPlan.value.overview) {
        text += `行程概述：\n${tripPlan.value.overview}\n\n`
      }
    }

    text += itinerary.value.map(d => {
      let dayText = `第${d.day}天 ${d.title}\n`
      dayText += d.activities.map(a => `• ${a}`).join('\n')
      if (d.notes) {
        dayText += `\n💡 ${d.notes}`
      }
      return dayText
    }).join('\n\n')

    if (tripPlan.value?.tips?.length) {
      text += '\n\n🎯 旅行小贴士：\n'
      text += tripPlan.value.tips.map(tip => `• ${tip}`).join('\n')
    }

    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}
</script>
