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
          <div class="card-body p-0 relative overflow-hidden">
            <!-- 地图容器 -->
            <div ref="mapContainer" class="w-full h-full rounded-lg"></div>
            
            <!-- 地图加载状态 -->
            <div v-if="!map" class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p class="text-gray-600">🗺️ 地图加载中...</p>
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
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'

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

// 地图相关变量
const mapContainer = ref<HTMLDivElement>()
let map: any = null
let driving: any = null
let walking: any = null
let transit: any = null
let geolocation: any = null
const AMAP_KEY = import.meta.env.VITE_GDMAP_KEY

// 统一设置高德安全配置（必须在 loader 加载前设置）
function setAmapSecurityConfig() {
  const securityJsCode = (import.meta as any).env.VITE_AMAP_SECURITY_JS_CODE || (import.meta as any).env.VITE_GDMAP_SECURITY_JS_CODE || (import.meta as any).env.VITE_GDMAP_SECRET
  const serviceHost = `${window.location.origin}/_AMapService`
  ;(window as any)._AMapSecurityConfig = securityJsCode
    ? { serviceHost, securityJsCode }
    : { serviceHost }
}

// 初始化地图
async function initMap() {
  try {
    // 直接加载 JSAPI（若控制台开启了安全密钥，需要在加载前注入到 window._AMapSecurityConfig）
    console.log('AMAP_KEY', AMAP_KEY)
    setAmapSecurityConfig()

    const AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Driving', 'AMap.Walking', 'AMap.Transfer', 'AMap.Geolocation', 'AMap.PlaceSearch']
    })

    // 创建地图实例
    map = new AMap.Map(mapContainer.value, {
      zoom: 13,
      center: [114.057868, 22.543099], // 深圳市中心
      mapStyle: 'amap://styles/normal'
    })

    // 初始化路线规划服务
    driving = new AMap.Driving({
      map: map,
      panel: null
    })

    walking = new AMap.Walking({
      map: map,
      panel: null
    })

    transit = new AMap.Transfer({
      map: map,
      panel: null,
      city: '深圳市'
    })

    // 初始化定位服务
    geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      convert: true,
      showButton: false,
      buttonPosition: 'LB',
      showMarker: true,
      showCircle: true,
      panToLocation: true,
      zoomToAccuracy: true
    })

    console.log('地图初始化成功')
  } catch (error) {
    console.error('地图加载失败:', error)
    showMessage('地图加载失败，使用模拟模式', 'warning')
    initMockMap()
  }
}

// 模拟地图模式
function initMockMap() {
  if (mapContainer.value) {
    mapContainer.value.innerHTML = `
      <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div class="text-center">
          <div class="text-6xl mb-4">🗺️</div>
          <div class="text-lg font-medium text-gray-600">模拟地图模式</div>
          <div class="text-sm text-gray-500 mt-2">API Key配置后可使用真实地图</div>
        </div>
      </div>
    `
  }
  
  // 模拟地图对象
  map = {
    setCenter: () => {},
    getCenter: () => ({ lng: 114.057868, lat: 22.543099 }),
    clearMap: () => {},
    destroy: () => {}
  }
}

// 清理地图资源
function destroyMap() {
  if (map) {
    map.destroy()
    map = null
  }
  driving = null
  walking = null
  transit = null
  geolocation = null
}

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
  
  if (!map) {
    showMessage('地图未加载完成，请稍后再试', 'warning')
    return
  }

  loading.route = true
  routes.value = []

  try {
    // 清除之前的路线
    map.clearMap()

    if (form.mode === 'driving') {
      driving.search([{ keyword: form.origin }, { keyword: form.destination }], (status: string, result: any) => {
        if (status === 'complete' && result?.routes?.length) {
          const route = result.routes[0]
          routes.value = [{
            summary: `驾车路线（推荐）`,
            distance: `${(route.distance / 1000).toFixed(1)} km`,
            duration: `${Math.ceil(route.time / 60)} 分钟`,
            steps: (route.steps || []).map((step: any) => step.instruction)
          }]
        } else {
          showMessage('路线规划失败，请检查起点和终点', 'error')
        }
        loading.route = false
      })
    } else if (form.mode === 'walking') {
      walking.search([{ keyword: form.origin }, { keyword: form.destination }], (status: string, result: any) => {
        if (status === 'complete' && result?.routes?.length) {
          const route = result.routes[0]
          routes.value = [{
            summary: `步行路线`,
            distance: `${(route.distance / 1000).toFixed(1)} km`,
            duration: `${Math.ceil(route.time / 60)} 分钟`,
            steps: (route.steps || []).map((step: any) => step.instruction)
          }]
        } else {
          showMessage('步行路线规划失败，请检查起点和终点', 'error')
        }
        loading.route = false
      })
    } else if (form.mode === 'transit') {
      transit.search([{ keyword: form.origin }, { keyword: form.destination }], (status: string, result: any) => {
        if (status === 'complete' && result?.plans?.length) {
          const plan = result.plans[0]
          routes.value = [{
            summary: `公交/地铁路线`,
            distance: `${(plan.distance / 1000).toFixed(1)} km`,
            duration: `${Math.ceil(plan.time / 60)} 分钟`,
            steps: (plan.segments || []).map((segment: any) => {
              if (segment?.walking) {
                const d = segment.walking.distance || 0
                return `步行 ${Math.ceil(d)}米`
              }
              if (segment?.bus?.buslines?.length) {
                return `乘坐${segment.bus.buslines[0].name}`
              }
              return '按导航指引前进'
            })
          }]
        } else {
          showMessage('公交路线规划失败，请检查起点和终点', 'error')
        }
        loading.route = false
      })
    }
  } catch (error) {
    console.error('路线规划错误:', error)
    showMessage('路线规划失败，请重试', 'error')
    loading.route = false
  }
}

async function locate() {
  if (!map || !geolocation) {
    showMessage('地图未加载完成，请稍后再试', 'warning')
    return
  }

  loading.nearby = true
  
  geolocation.getCurrentPosition((status: string, result: any) => {
    if (status === 'complete') {
      const lng = result?.position?.lng ?? result?.position?.getLng?.()
      const lat = result?.position?.lat ?? result?.position?.getLat?.()
      if (lng != null && lat != null) {
        form.origin = `我的位置(${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)})`
        // 设置地图中心到当前位置
        map.setCenter([lng, lat])
        // 搜索附近的POI
        searchNearby(lng, lat)
        showMessage('定位成功', 'success')
      } else {
        showMessage('定位信息解析失败，使用默认位置', 'warning')
        searchNearby(114.057868, 22.543099)
      }
    } else {
      showMessage('定位失败，请检查定位权限', 'error')
      // 使用默认位置搜索附近POI
      searchNearby(114.057868, 22.543099)
    }
  })
}

// 搜索附近POI
async function searchNearby(lng: number, lat: number) {
  try {
    setAmapSecurityConfig()
    const AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.PlaceSearch']
    })
    
    const placeSearch = new AMap.PlaceSearch({
      pageSize: 10,
      pageIndex: 1,
      city: '全国',
      map: map,
      panel: null
    })
    
    placeSearch.searchNearBy('', [lng, lat], 5000, (status: string, result: any) => {
      if (status === 'complete' && result?.poiList?.pois?.length) {
        nearby.value = result.poiList.pois.slice(0, 6).map((poi: any) => ({
          name: poi.name,
          category: (poi.type || '').split(';')[1] || '地点',
          distance: `${(poi.distance / 1000).toFixed(1)} km`
        }))
      } else {
        // 使用默认数据
        nearby.value = [
          { name: '欢乐海岸', category: '景点', distance: '1.2 km' },
          { name: '深业上城', category: '商圈', distance: '2.5 km' },
          { name: '深圳博物馆', category: '博物馆', distance: '3.8 km' },
        ]
      }
      loading.nearby = false
    })
  } catch (error) {
    console.error('搜索附近POI失败:', error)
    // 使用默认数据
    nearby.value = [
      { name: '欢乐海岸', category: '景点', distance: '1.2 km' },
      { name: '深业上城', category: '商圈', distance: '2.5 km' },
      { name: '深圳博物馆', category: '博物馆', distance: '3.8 km' },
    ]
    loading.nearby = false
  }
}

// 生命周期钩子
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  destroyMap()
})
</script>
