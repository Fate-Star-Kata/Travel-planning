<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
    <!-- 页面标题 -->
    <PageHeader v-show="routes.length === 0" :has-routes="routes.length > 0" />

    <!-- 导航表单卡片 -->
    <NavigationForm
      :form="form"
      :loading="loading"
      @update-origin="form.origin = $event"
      @update-destination="form.destination = $event"
      @update-mode="form.mode = $event"
      @locate="locate"
      @swap-points="swapPoints"
      @plan-route="planRoute"
      @reset="reset"
    />

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 地图区域 -->
      <div class="lg:col-span-2">
        <MapContainer
           :map="map"
           :routes="routes"
           @start-navigation="startNavigation"
           ref="mapContainerComponent"
         />
      </div>

      <!-- 右侧信息面板 -->
      <div class="space-y-6">
        <!-- 推荐路线卡片 -->
        <RouteList
          :routes="routes"
          :loading="loading.route"
        />

        <!-- 附近推荐卡片 -->
        <NearbyList
          :nearby="nearby"
          :loading="loading.nearby"
          @set-destination="setDestination"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, nextTick } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import PageHeader from '../../components/pages/navigation/PageHeader.vue'
import NavigationForm from '../../components/pages/navigation/NavigationForm.vue'
import MapContainer from '../../components/pages/navigation/MapContainer.vue'
import RouteList from '../../components/pages/navigation/RouteList.vue'
import NearbyList from '../../components/pages/navigation/NearbyList.vue'

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
const mapContainerComponent = ref<any>()
const map = ref<any>(null)
let driving: any = null
let walking: any = null
let transit: any = null
let geolocation: any = null
const AMAP_KEY = import.meta.env.VITE_GDMAP_KEY

// 统一设置高德安全配置（必须在 loader 加载前设置）
function setAmapSecurityConfig() {
  const securityJsCode = import.meta.env.VITE_GDMAP_SECRET || import.meta.env.VITE_AMAP_SECURITY_JS_CODE
  const serviceHost = `${window.location.origin}/_AMapService`

  if (securityJsCode) {
    ; (window as any)._AMapSecurityConfig = {
      securityJsCode: securityJsCode,
      serviceHost: serviceHost
    }
    console.log('高德地图安全配置已设置', { serviceHost, securityJsCode: '***已配置***' })
  } else {
    console.warn('未找到高德地图安全密钥，可能影响地图功能')
  }
}

// 初始化地图
async function initMap() {
  try {
    // 确保DOM元素已经准备好
    const mapContainer = mapContainerComponent.value?.mapContainer
    if (!mapContainer) {
      console.error('地图容器未找到')
      setTimeout(() => initMap(), 100) // 延迟重试
      return
    }

    console.log('开始初始化地图...', {
      容器元素: mapContainer,
      容器尺寸: {
        宽度: mapContainer.offsetWidth,
        高度: mapContainer.offsetHeight
      },
      AMAP_KEY: AMAP_KEY ? '已配置' : '未配置'
    })

    // 检查API Key
    if (!AMAP_KEY) {
      console.warn('高德地图API Key未配置，使用模拟模式')
      showMessage('地图API Key未配置，使用模拟模式', 'warning')
      initMockMap()
      return
    }

    // 设置安全配置
    setAmapSecurityConfig()

    const AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Driving', 'AMap.Walking', 'AMap.Transfer', 'AMap.Geolocation', 'AMap.PlaceSearch']
    })

    console.log('高德地图JSAPI加载成功')

    // 创建地图实例
    map.value = new AMap.Map(mapContainer, {
      zoom: 13,
      center: [114.057868, 22.543099], // 深圳市中心
      mapStyle: 'amap://styles/normal',
      resizeEnable: true,
      rotateEnable: true,
      pitchEnable: true,
      zoomEnable: true,
      dragEnable: true
    })

    // 等待地图完全加载
    map.value.on('complete', () => {
      console.log('地图渲染完成')
      // 强制触发地图重绘和显示
      setTimeout(() => {
        if (map.value && map.value.getContainer()) {
          map.value.getContainer().style.visibility = 'visible'
          map.value.getContainer().style.display = 'block'
          map.value.getContainer().style.opacity = '1'
          // 触发地图重新计算尺寸
          map.value.getSize()
          map.value.setCenter(map.value.getCenter())
        }
      }, 50)
    })

    // 初始化路线规划服务
    driving = new AMap.Driving({
      map: map.value,
      panel: null
    })

    walking = new AMap.Walking({
      map: map.value,
      panel: null
    })

    transit = new AMap.Transfer({
      map: map.value,
      panel: null,
      city: '深圳市'
    })

    // 初始化定位服务
    geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 15000,  // 超时时间15秒
      maximumAge: 0,   // 不使用缓存，获取最新位置
      convert: true,   // 自动转换坐标系
      showButton: false,
      buttonPosition: 'LB',
      showMarker: true,
      showCircle: true,
      panToLocation: true,
      zoomToAccuracy: true,
      // 定位方式配置 - 修复配置错误
      GeoLocationFirst: true,   // 优先使用浏览器定位
      noIpLocate: 0,           // 0表示允许IP定位，1表示禁用
      noGeoLocation: 0,        // 0表示允许浏览器定位，1表示禁用
      useNative: true          // 使用原生定位API
    })

    console.log('地图初始化成功', {
      地图实例: map.value,
      定位服务: geolocation,
      路线服务: { driving, walking, transit }
    })

    // 立即强制触发地图重绘和显示
    if (map.value && map.value.getContainer()) {
      const container = map.value.getContainer()
      container.style.visibility = 'visible'
      container.style.display = 'block'
      container.style.opacity = '1'
      container.style.width = '100%'
      container.style.height = '100%'
      
      // 触发地图重新计算尺寸和重绘
      setTimeout(() => {
        map.value.getSize()
        map.value.setCenter([114.057868, 22.543099])
        map.value.setZoom(13)
      }, 100)
      
      // 再次确保地图显示
      setTimeout(() => {
        map.value.getSize()
        map.value.setCenter(map.value.getCenter())
      }, 300)
    }

  } catch (error) {
    console.error('地图加载失败:', error)
    showMessage(`地图加载失败: ${error.message || '未知错误'}，使用模拟模式`, 'warning')
    initMockMap()
  }
}

// 模拟地图模式
function initMockMap() {
  const mapContainer = mapContainerComponent.value?.mapContainer
  if (mapContainer) {
    mapContainer.innerHTML = `
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
  map.value = {
    setCenter: () => { },
    getCenter: () => ({ lng: 114.057868, lat: 22.543099 }),
    clearMap: () => { },
    destroy: () => { }
  }
}

// 清理地图资源
function destroyMap() {
  if (map.value && typeof map.value.destroy === 'function') {
    map.value.destroy()
  }
  map.value = null
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

  if (!map.value) {
    showMessage('地图未加载完成，请稍后再试', 'warning')
    return
  }

  loading.route = true
  routes.value = []

  try {
    // 清除之前的路线
    map.value.clearMap()

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
          // 搜索终点附近的推荐
          searchDestinationNearby(form.destination)

          // 滚动到页面底部
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            })
          }, 500)


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
          // 搜索终点附近的推荐
          searchDestinationNearby(form.destination)

          // 滚动到页面底部
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            })
          }, 500)


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
          // 搜索终点附近的推荐
          searchDestinationNearby(form.destination)

          // 滚动到页面底部
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            })
          }, 500)


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
  if (!map.value) {
    showMessage('地图未加载完成，请稍后再试', 'warning')
    return
  }

  loading.nearby = true

  // 添加用户提示
  showMessage('正在获取位置信息，请允许浏览器访问您的位置...', 'success')

  // 优先尝试高德地图定位
  if (geolocation) {
    geolocation.getCurrentPosition((status: string, result: any) => {
      if (status === 'complete') {
        const lng = result?.position?.lng ?? result?.position?.getLng?.()
        const lat = result?.position?.lat ?? result?.position?.getLat?.()
        if (lng != null && lat != null) {
          // 打印定位信息到控制台
          console.log('高德定位成功:', {
            经度: lng,
            纬度: lat,
            位置描述: `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`,
            定位方式: result.location_type || '未知',
            精度: result.accuracy || '未知',
            原始结果: result
          })
          handleLocationSuccess(lng, lat, '高德定位')
          return
        }
      }

      console.log('高德定位失败，尝试浏览器原生定位:', { status, result })
      tryNativeGeolocation()
    }, (error: any) => {
      console.log('高德定位错误，尝试浏览器原生定位:', error)
      tryNativeGeolocation()
    })
  } else {
    // 如果高德定位服务未初始化，直接使用浏览器原生定位
    tryNativeGeolocation()
  }
}

// 尝试浏览器原生定位
function tryNativeGeolocation() {
  if (!navigator.geolocation) {
    console.log('浏览器不支持定位服务')
    handleLocationError('浏览器不支持定位服务，使用默认位置')
    return
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lng = position.coords.longitude
      const lat = position.coords.latitude
      console.log('浏览器原生定位成功:', {
        经度: lng,
        纬度: lat,
        精度: position.coords.accuracy,
        时间戳: new Date(position.timestamp).toLocaleString()
      })
      handleLocationSuccess(lng, lat, '浏览器定位')
    },
    (error) => {
      console.log('浏览器原生定位失败:', error)
      let errorMessage = '定位失败，使用默认位置'

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '定位被拒绝，请在浏览器设置中允许位置访问'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = '位置信息不可用，使用默认位置'
          break
        case error.TIMEOUT:
          errorMessage = '定位超时，请检查网络连接或稍后重试'
          break
      }

      handleLocationError(errorMessage)
    },
    options
  )
}

// 处理定位成功
function handleLocationSuccess(lng: number, lat: number, method: string) {
  loading.nearby = false
  form.origin = `我的位置(${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)})`
  // 设置地图中心到当前位置
  if (map && map.setCenter) {
    map.setCenter([lng, lat])
  }
  // 搜索附近的POI
  searchNearby(lng, lat)
  showMessage(`${method}成功！`, 'success')
}

// 处理定位失败
function handleLocationError(message: string) {
  loading.nearby = false
  showMessage(message, 'warning')
  // 使用默认位置（深圳市中心）搜索附近POI
  searchNearby(114.057868, 22.543099)
}

// 搜索终点附近的推荐
async function searchDestinationNearby() {
  if (!form.destination) {
    console.warn('终点地址为空，无法搜索附近POI')
    return
  }

  console.log('开始搜索终点附近POI:', form.destination)

  loading.nearby = true

  try {
    setAmapSecurityConfig()
    const AMap = await AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Geocoder', 'AMap.PlaceSearch']
    })

    // 先通过地理编码获取终点坐标
    const geocoder = new AMap.Geocoder()

    geocoder.getLocation(form.destination, (status: string, result: any) => {
      console.log('地理编码结果:', { status, result })
      if (status === 'complete' && result?.geocodes?.length) {
        const location = result.geocodes[0].location
        const lng = location.lng
        const lat = location.lat
        console.log('终点坐标:', { lng, lat })

        // 搜索终点附近的POI
        const placeSearch = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
          city: '全国',
          map: null,
          panel: null
        })

        placeSearch.searchNearBy('', [lng, lat], 3000, (status: string, result: any) => {
          console.log('POI搜索结果:', { status, result })
          if (status === 'complete' && result?.poiList?.pois?.length) {
            nearby.value = result.poiList.pois.slice(0, 6).map((poi: any) => ({
              name: poi.name,
              category: (poi.type || '').split(';')[1] || '地点',
              distance: `${(poi.distance / 1000).toFixed(1)} km`
            }))
            console.log('附近推荐更新成功:', nearby.value)
          } else {
            console.log('POI搜索无结果，使用默认数据')
            // 使用默认数据
            nearby.value = [
              { name: '附近餐厅', category: '美食', distance: '0.5 km' },
              { name: '附近景点', category: '景点', distance: '0.8 km' },
              { name: '附近商场', category: '购物', distance: '1.2 km' },
            ]
          }
          loading.nearby = false
        })
      } else {
        console.log('地理编码失败，使用默认数据')
        // 地理编码失败，使用默认数据
        nearby.value = [
          { name: '附近餐厅', category: '美食', distance: '0.5 km' },
          { name: '附近景点', category: '景点', distance: '0.8 km' },
          { name: '附近商场', category: '购物', distance: '1.2 km' },
        ]
        loading.nearby = false
      }
    })
  } catch (error) {
    console.error('搜索终点附近POI失败:', error)
    // 使用默认数据
    nearby.value = [
      { name: '附近餐厅', category: '美食', distance: '0.5 km' },
      { name: '附近景点', category: '景点', distance: '0.8 km' },
      { name: '附近商场', category: '购物', distance: '1.2 km' },
    ]
    loading.nearby = false
  }
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
      map: null,
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

// 开始导航功能
function startNavigation() {
  if (!form.origin || !form.destination) {
    showMessage('请先规划路线后再开始导航', 'warning')
    return
  }

  if (routes.value.length === 0) {
    showMessage('暂无可用路线，请先查询路线', 'warning')
    return
  }

  // 显示导航开始提示
  showMessage(`🧭 开始导航：${form.origin} → ${form.destination}`, 'success')

  // 这里可以添加实际的导航逻辑，比如：
  // 1. 启动实时位置跟踪
  // 2. 开始语音播报
  // 3. 显示导航界面
  // 4. 调用第三方导航应用

  console.log('导航已开始:', {
    起点: form.origin,
    终点: form.destination,
    路线模式: form.mode,
    路线信息: routes.value[0]
  })

  // 模拟导航功能 - 可以根据需要扩展
  setTimeout(() => {
    showMessage('导航进行中...', 'success')
  }, 2000)
}

// 页面挂载时初始化地图
onMounted(() => {
  // 延迟初始化，确保组件完全挂载
  nextTick(() => {
    setTimeout(() => {
      initMap()
    }, 100)
  })
})

onUnmounted(() => {
  destroyMap()
})
</script>
