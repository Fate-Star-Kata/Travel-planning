<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
        🧭 智能导航
      </h1>
      <p class="text-gray-600">为您规划最优出行路线</p>
    </div>

    <!-- 导航表单卡片 -->
    <div class="card bg-white shadow-xl border border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300">
      <div class="card-body">
        <div class="flex items-center justify-between mb-6">
          <h2 class="card-title text-xl text-gray-800">
            <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            路线规划
          </h2>
          <div class="flex gap-2">
            <button class="btn btn-primary btn-sm" @click="locate" :disabled="loading.nearby">
              <svg v-if="!loading.nearby" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              </svg>
              <span v-if="loading.nearby" class="loading loading-spinner loading-xs"></span>
              {{ loading.nearby ? '定位中...' : '📍 定位' }}
            </button>
            <button class="btn btn-outline btn-sm" @click="swapPoints">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
              🔄 交换
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 起点输入 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium text-gray-700">🚩 起点</span>
            </label>
            <input 
              v-model="form.origin" 
              type="text" 
              placeholder="请输入起点，如：深圳北站" 
              class="input input-bordered w-full focus:input-primary transition-all duration-200" 
            />
          </div>
          
          <!-- 终点输入 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium text-gray-700">🎯 终点</span>
            </label>
            <input 
              v-model="form.destination" 
              type="text" 
              placeholder="请输入终点，如：世界之窗" 
              class="input input-bordered w-full focus:input-primary transition-all duration-200" 
            />
          </div>
          
          <!-- 出行方式选择 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium text-gray-700">🚗 出行方式</span>
            </label>
            <select v-model="form.mode" class="select select-bordered w-full focus:select-primary">
              <option value="driving">🚗 驾车</option>
              <option value="walking">🚶 步行</option>
              <option value="transit">🚇 公交/地铁</option>
            </select>
          </div>
          
          <!-- 操作按钮 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text opacity-0">操作</span>
            </label>
            <div class="flex gap-2">
              <button 
                class="btn btn-primary flex-1" 
                @click="planRoute" 
                :disabled="loading.route"
              >
                <span v-if="loading.route" class="loading loading-spinner loading-sm"></span>
                <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                {{ loading.route ? '查询中...' : '查询路线' }}
              </button>
              <button class="btn btn-ghost" @click="reset">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 地图区域 -->
      <div class="lg:col-span-2">
        <div class="card bg-white shadow-xl border border-gray-100 h-[500px] hover:shadow-2xl transition-all duration-300">
          <div class="card-body flex items-center justify-center relative overflow-hidden">
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
            <div class="absolute top-4 right-4 w-20 h-20 bg-blue-200 rounded-full opacity-20"></div>
            <div class="absolute bottom-4 left-4 w-16 h-16 bg-purple-200 rounded-full opacity-20"></div>
            
            <!-- 地图占位内容 -->
            <div class="text-center z-10">
              <div class="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">🗺️ 智能地图</h3>
              <p class="text-gray-500 mb-4">地图功能开发中，可后续接入高德/百度地图</p>
              <div class="badge badge-primary badge-lg">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                即将上线
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧信息面板 -->
      <div class="space-y-6">
        <!-- 推荐路线卡片 -->
        <div class="card bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div class="card-body">
            <h3 class="card-title text-lg text-gray-800 mb-4">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
              🛣️ 推荐路线
            </h3>
            
            <!-- 加载状态 -->
            <div v-if="loading.route" class="space-y-4">
              <div class="skeleton h-4 w-full"></div>
              <div class="skeleton h-4 w-3/4"></div>
              <div class="skeleton h-4 w-1/2"></div>
              <div class="skeleton h-4 w-2/3"></div>
            </div>
            
            <!-- 无路线状态 -->
            <div v-else-if="routes.length === 0" class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 9.34c-1.44-1.122-3.12-1.34-5-1.34s-3.56.218-5 1.34M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-gray-500">暂无路线，试试查询吧</p>
            </div>
            
            <!-- 路线列表 -->
            <div v-else class="space-y-4">
              <div v-for="(route, idx) in routes" :key="idx" class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-semibold text-gray-800">{{ route.summary }}</h4>
                  <div class="badge badge-primary">{{ route.duration }}</div>
                </div>
                <p class="text-sm text-gray-600 mb-3">📏 距离：{{ route.distance }}</p>
                <div class="space-y-2">
                  <div v-for="(step, si) in route.steps" :key="si" class="flex items-start gap-2">
                    <div class="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span class="text-sm text-gray-600">{{ step }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 附近推荐卡片 -->
        <div class="card bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div class="card-body">
            <h3 class="card-title text-lg text-gray-800 mb-4">
              <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              📍 附近推荐
            </h3>
            
            <!-- 加载状态 -->
            <div v-if="loading.nearby" class="space-y-4">
              <div class="skeleton h-4 w-full"></div>
              <div class="skeleton h-4 w-3/4"></div>
              <div class="skeleton h-4 w-1/2"></div>
              <div class="skeleton h-4 w-2/3"></div>
            </div>
            
            <!-- 无数据状态 -->
            <div v-else-if="nearby.length === 0" class="text-center py-8">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <p class="text-gray-500">暂无数据</p>
            </div>
            
            <!-- 推荐列表 -->
            <div v-else class="space-y-3">
              <div v-for="(item, i) in nearby" :key="i" class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
                <div class="flex-1">
                  <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                  <p class="text-sm text-gray-500 mt-1">
                    <span class="badge badge-outline badge-sm mr-2">{{ item.category }}</span>
                    📏 距离约 {{ item.distance }}
                  </p>
                </div>
                <button class="btn btn-sm btn-primary" @click="setDestination(item.name)">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  设为终点
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 简单的消息提示函数
function showMessage(message: string, type: 'success' | 'warning' | 'error' = 'success') {
  // 创建 toast 元素
  const toast = document.createElement('div')
  toast.className = `alert alert-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'error'} fixed top-4 right-4 z-50 max-w-sm shadow-lg`
  toast.innerHTML = `
    <svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
      ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>' : 
        type === 'warning' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"></path>' :
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>'}
    </svg>
    <span>${message}</span>
  `
  
  document.body.appendChild(toast)
  
  // 3秒后自动移除
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 3000)
}

interface RouteOption {
  summary: string
  distance: string
  duration: string
  steps: string[]
}

interface NearbyItem {
  name: string
  category: string
  distance: string
}

const form = reactive({
  origin: '',
  destination: '',
  mode: 'driving' as 'driving' | 'walking' | 'transit',
})

const routes = ref<RouteOption[]>([])
const nearby = ref<NearbyItem[]>([])

const loading = reactive({ route: false, nearby: false })

function swapPoints() {
  ;[form.origin, form.destination] = [form.destination, form.origin]
}

function reset() {
  form.origin = ''
  form.destination = ''
  form.mode = 'driving'
  routes.value = []
  nearby.value = []
}

function setDestination(name: string) {
  form.destination = name
}

async function planRoute() {
  if (!form.origin || !form.destination) {
    showMessage('请填写起点和终点', 'warning')
    return
  }
  loading.route = true
  routes.value = []
  // 纯本地假数据，模拟网络延时
  await new Promise((r) => setTimeout(r, 500))
  const base = [
    { summary: '路线A（建议）', distance: '12.4 km', duration: '28 分钟', steps: ['从起点出发', '沿XX大道直行 5km', '进入快速路 6km', '到达终点'] },
    { summary: '路线B（备选）', distance: '13.1 km', duration: '32 分钟', steps: ['从起点出发', '走城市次干道 7km', '右转进入XX路 4km', '到达终点'] },
  ] as RouteOption[]
  if (form.mode === 'walking') {
    routes.value = [
      { summary: '步行优选', distance: '3.2 km', duration: '45 分钟', steps: ['从起点向东步行 800m', '穿过公园 1.1km', '沿人行道直行 1.3km', '到达终点'] },
    ]
  } else if (form.mode === 'transit') {
    routes.value = [
      { summary: '地铁直达', distance: '—', duration: '35 分钟', steps: ['步行至A站', '乘坐2号线 3站', '换乘1号线 2站', '步行至终点'] },
    ]
  } else {
    routes.value = base
  }
  loading.route = false
}

async function locate() {
  loading.nearby = true
  // 优先使用浏览器定位，如果不可用则使用默认坐标
  const doNearby = async () => {
    await new Promise((r) => setTimeout(r, 500))
    nearby.value = [
      { name: '欢乐海岸', category: '景点', distance: '1.2 km' },
      { name: '深业上城', category: '商圈', distance: '2.5 km' },
      { name: '深圳博物馆', category: '博物馆', distance: '3.8 km' },
    ]
    loading.nearby = false
  }

  if ('geolocation' in navigator) {
    // 为无权限或长时间未响应场景添加超时兜底
    const timeout = setTimeout(async () => {
      if (loading.nearby) {
        showMessage('定位超时，已为你推荐附近热门地点', 'warning')
        if (!form.origin) form.origin = '我的位置'
        await doNearby()
      }
    }, 1500)
  
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timeout)
        const { latitude, longitude } = pos.coords
        form.origin = `我的位置(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        await doNearby()
      },
      async () => {
        clearTimeout(timeout)
        showMessage('定位失败，已为你推荐附近热门地点', 'error')
        if (!form.origin) form.origin = '我的位置'
        await doNearby()
      },
      { enableHighAccuracy: false, timeout: 1500, maximumAge: 0 },
    )
  } else {
    showMessage('浏览器不支持定位，已为你推荐附近热门地点', 'warning')
    if (!form.origin) form.origin = '我的位置'
    await doNearby()
  }
}
</script>
