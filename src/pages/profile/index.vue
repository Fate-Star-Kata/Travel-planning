<template>
  <div class="w-full">
    <!-- 用户信息横幅 -->
    <UserProfileHeader :user="user" :loading="userLoading" @edit-profile="onEditProfile" @logout="onLogout" />

    <!-- 主体内容区 -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：功能菜单 -->
        <div class="space-y-6 lg:col-span-1">
          <!-- 行程菜单 -->
          <TripMenu :trip-menu="tripMenu" @menu-click="onMenuClick" />
        </div>

        <!-- 右侧：动态内容区（占两列） -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 最近行程 -->
          <RecentTrips v-if="currentView === 'trips'" :recent-trips="recentTrips" :loading="tripsLoading" @view-all-trips="onViewAllTrips"
            @create-trip="onCreateTrip" @trip-view="onTripView" @trip-edit="onTripEdit" />

          <!-- 收藏列表 -->
          <FavoritesList v-if="currentView === 'favorites'" :favorites-list="favoritesList" :loading="favoritesLoading"
            @view-all-favorites="onOpenFavorites" @explore-attractions="onExploreAttractions"
            @favorite-click="handleFavoriteClick" @remove-favorite="handleRemoveFavorite" />

          <!-- 偏好设置 -->
        <PreferencesSettings v-else-if="currentView === 'preferences'" />
        
        <!-- 账户设置 -->
        <AccountSettings v-else-if="currentView === 'account'" />
        </div>
      </div>
    </div>

    <!-- Toast 提示 -->
    <div class="toast toast-end z-50" v-if="toast.show">
      <div class="alert" :class="toast.type === 'success' ? 'alert-success' : 'alert-info'">
        <span>{{ toast.message }}</span>
      </div>
    </div>

    <!-- 景点详情弹窗 -->
    <AttractionDetailDialog v-model="dialogVisible" :attraction="selectedAttraction" :loading="detailLoading"
      :favorite-loading="favoriteLoading" @favorite="handleFavoriteFromDialog" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFavorites, getAttractionDetail, removeFavorite, getUserProfile } from '@/api/Travel-planning/attraction'
import { getUserTrips } from '@/api/Travel-planning/travel-plan'
import type {
  FavoriteItem,
  AttractionDetail,
  Attraction,
  TripItem,
  TripStatus,
  UserProfile,
  UserStatistics,
  MenuItem
} from '@/types/Travel-planning/attraction'
import type { SavedTrip } from '@/types/Travel-planning/travel-plan'
import { ElMessage } from 'element-plus'
import AttractionDetailDialog from '@/components/pages/index/AttractionDetailDialog.vue'
import UserProfileHeader from '@/components/pages/profile/UserProfileHeader.vue'
import TripMenu from '@/components/pages/profile/TripMenu.vue'
import RecentTrips from '@/components/pages/profile/RecentTrips.vue'
import FavoritesList from '@/components/pages/profile/FavoritesList.vue'
import PreferencesSettings from '@/components/pages/profile/PreferencesSettings.vue'
import AccountSettings from '@/components/pages/profile/AccountSettings.vue'

// 用户数据
const user: UserProfile = reactive({
  name: '',
  avatar: '',
  joinDate: '',
  stats: {
    completedTrips: 0,
    visitedCities: 0,
    favoritesCount: 0,
  },
})

// 加载状态
const userLoading = ref(false)
const router = useRouter()

// 当前显示的视图
const currentView = ref<'trips' | 'favorites' | 'preferences' | 'account'>('trips')

const tripMenu: MenuItem[] = reactive([
  { key: 'history', label: '历史行程', icon: '📅' },
  { key: 'favorites', label: '收藏景点', icon: '🔖' },
  { key: 'preferences', label: '偏好设置', icon: '⚙️' },
  { key: 'profile', label: '账户设置', icon: '👤' },
])

const recentTrips = ref<TripItem[]>([])
const tripsLoading = ref(false)

// 收藏相关状态
const favoritesList = ref<FavoriteItem[]>([])
const favoritesLoading = ref(false)
const dialogVisible = ref(false)
const selectedAttraction = ref<AttractionDetail | null>(null)
const detailLoading = ref(false)
const favoriteLoading = ref(false)

// Toast 状态
const toast = reactive({ show: false, message: '', type: 'info' as 'info' | 'success' })
let toastTimer: number | undefined

function showToast(message: string, type: 'info' | 'success' = 'info') {
  toast.message = message
  toast.type = type
  toast.show = true
  if (toastTimer) window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.show = false), 1800)
}

// 交互事件
function onEditProfile() {
  currentView.value = 'account'
  showToast('已切换到账户设置', 'success')
}

function onLogout() {
  showToast('已退出登录', 'success')
  // 跳转到登录页面
  setTimeout(() => {
    router.push('/auth/login')
  }, 1000)
}

function onMenuClick(item: MenuItem) {
  if (item.key === 'favorites') {
    currentView.value = 'favorites'
    showToast('显示收藏景点', 'info')
  } else if (item.key === 'history') {
    currentView.value = 'trips'
    showToast('显示历史行程', 'info')
  } else if (item.key === 'preferences') {
    currentView.value = 'preferences'
    showToast('显示偏好设置', 'info')
  } else if (item.key === 'profile') {
    currentView.value = 'account'
    showToast('已切换到账户设置', 'success')
  } else {
    showToast(`${item.label} 功能正在建设中`, 'info')
  }
}

function onViewAllTrips() {
  showToast('查看全部行程（示例）', 'info')
}

function onTripView(trip: TripItem) {
  showToast(`查看行程：${trip.title}`, 'info')
}

function onTripEdit(trip: TripItem) {
  showToast(`修改行程：${trip.title}`, 'success')
}

function onCreateTrip() {
  showToast('创建新行程（示例）', 'info')
}

function onExploreAttractions() {
  showToast('探索景点（示例）', 'info')
}

// 处理收藏点击
function handleFavoriteClick(favorite: FavoriteItem) {
  showAttractionDetail(favorite.attraction.id)
}

// 处理移除收藏
function handleRemoveFavorite(favoriteId: number) {
  const favoriteItem = favoritesList.value.find(f => f.id === favoriteId)
  if (!favoriteItem) return

  handleFavoriteFromDialog(favoriteItem.attraction.id)
}

// 获取用户资料
const loadUserProfile = async () => {
  try {
    userLoading.value = true
    const response = await getUserProfile()
    if (response.code === 200) {
      const { user_info, statistics } = response.data

      // 更新用户信息
      user.name = user_info.username
      user.joinDate = new Date(user_info.date_joined).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long'
      })

      // 更新统计信息
      user.stats.completedTrips = statistics.trip_count
      user.stats.favoritesCount = statistics.favorite_count
      // 暂时将访问城市数设为评论数，后续可根据实际需求调整
      user.stats.visitedCities = statistics.review_count
    } else {
      ElMessage.error(response.msg || '获取用户资料失败')
    }
  } catch (error) {
    console.error('获取用户资料失败:', error)
    ElMessage.error('获取用户资料失败')
  } finally {
    userLoading.value = false
  }
}

// 获取收藏列表
const loadFavorites = async () => {
  try {
    favoritesLoading.value = true
    const response = await getFavorites({ page: 1, page_size: 1000 })
    if (response.code === 200) {
      favoritesList.value = response.data.favorites
      // 更新用户统计数据
      user.stats.favoritesCount = response.data.favorites.length
    } else {
      ElMessage.error(response.msg || '获取收藏列表失败')
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    ElMessage.error('获取收藏列表失败')
  } finally {
    favoritesLoading.value = false
  }
}

// 显示收藏景点详情
const showAttractionDetail = async (attractionId: number) => {
  try {
    detailLoading.value = true
    dialogVisible.value = true
    const response = await getAttractionDetail(attractionId)
    if (response.code === 200) {
      selectedAttraction.value = response.data
      // 设置收藏状态为true（因为是从收藏列表点击的）
      if (selectedAttraction.value) {
        selectedAttraction.value.isFavorited = true
      }
    } else {
      ElMessage.error(response.msg || '获取景点详情失败')
      dialogVisible.value = false
    }
  } catch (error) {
    console.error('获取景点详情失败:', error)
    ElMessage.error('获取景点详情失败')
    dialogVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

// 处理取消收藏
const handleFavoriteFromDialog = async (attractionId: number) => {
  const favoriteItem = favoritesList.value.find(f => f.attraction.id === attractionId)
  if (!favoriteItem) return

  favoriteLoading.value = true

  try {
    const response = await removeFavorite(favoriteItem.id)
    if (response.code === 200) {
      ElMessage.success('取消收藏成功')
      // 更新本地数据
      favoritesList.value = favoritesList.value.filter(f => f.id !== favoriteItem.id)
      user.stats.favoritesCount = favoritesList.value.length

      // 更新弹窗中的收藏状态
      if (selectedAttraction.value && selectedAttraction.value.id === attractionId) {
        selectedAttraction.value.isFavorited = false
      }

      // 关闭弹窗
      dialogVisible.value = false
    } else {
      ElMessage.error(response.msg || '取消收藏失败')
    }
  } catch (error) {
    console.error('取消收藏失败:', error)
    ElMessage.error('取消收藏失败')
  } finally {
    favoriteLoading.value = false
  }
}

function onOpenFavorites() {
  if (favoritesList.value.length === 0) {
    showToast('暂无收藏的景点', 'info')
    return
  }
  showToast('显示收藏列表', 'info')
  // 这里可以展开显示收藏列表或跳转到收藏页面
}



// 获取用户行程
const loadUserTrips = async () => {
  try {
    tripsLoading.value = true
    const response = await getUserTrips()
    if (response.code === 200) {
      // 转换API数据为组件需要的格式
      recentTrips.value = response.data.trips.map((trip: SavedTrip) => {
        // 根据开始时间、结束时间和当前时间判断行程状态
        const startDate = new Date(trip.start_date)
        const endDate = new Date(trip.end_date)
        const currentDate = new Date()
        
        let status: TripStatus
        
        if (endDate < currentDate) {
          // 结束时间已过，行程已完成
          status = 'completed'
        } else if (startDate <= currentDate && currentDate <= endDate) {
          // 当前时间在行程期间内，行程进行中
          status = 'ongoing'
        } else if (startDate > currentDate) {
          // 行程还未开始
          const timeDiff = startDate.getTime() - currentDate.getTime()
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
          
          if (daysDiff <= 1) {
            // 小于等于一天，即将开始
            status = 'upcoming'
          } else {
            // 大于一天，已规划
            status = 'planned'
          }
        } else {
          // 默认状态
          status = 'planned'
        }
        
        return {
          id: trip.id.toString(),
          title: trip.title,
          dateRange: `${trip.start_date} - ${trip.end_date}`,
          status,
          cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDMyMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRkZGN0VEIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZmlsbD0iI0Y1OUUwQiIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiPuihjOeoi+WbvueJhzwvdGV4dD4KPC9zdmc+'
        }
      })
    } else {
      ElMessage.error(response.msg || '获取行程列表失败')
    }
  } catch (error) {
    console.error('获取行程列表失败:', error)
    ElMessage.error('获取行程列表失败')
  } finally {
    tripsLoading.value = false
  }
}

// 页面加载时获取用户资料和收藏数据
onMounted(async () => {
  await Promise.all([
    loadUserProfile(),
    loadFavorites(),
    loadUserTrips()
  ])
})

// 工具：状态文本与样式
function statusText(status: TripStatus) {
  switch (status) {
    case 'completed':
      return '已完成'
    case 'ongoing':
      return '进行中'
    case 'upcoming':
      return '即将开始'
    case 'planned':
      return '已规划'
    default:
      return '已规划'
  }
}

function statusBadgeClass(status: TripStatus) {
  switch (status) {
    case 'completed':
      return 'badge-success'  // 绿色
    case 'ongoing':
      return 'badge-warning'  // 黄色
    case 'upcoming':
      return 'badge-error'    // 红色
    case 'planned':
      return 'badge-info'     // 蓝色
    default:
      return 'badge-info'
  }
}

// 注册组件
const components = {
  RecentTrips,
  FavoritesList,
  PreferencesSettings,
  AccountSettings
}
</script>
