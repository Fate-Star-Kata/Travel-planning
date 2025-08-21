<template>
  <div class="min-h-screen bg-base-100">
    <!-- 标题区域组件 -->
    <HeroSection 
      :preset-keywords="presetKeywords"
      @search="handleSearch"
      @apply-keyword="applyKeyword"
    />

    <!-- 目的地推荐组件 -->
    <DestinationsSection 
      :destinations="destinations"
      :loading="loading"
      @favorite="handleFavorite"
      @show-detail="showAttractionDetail"
      @start-planning="goPlanningWith"
      @shuffle="shuffleDestinations"
    />

    <!-- 旅游攻略组件 -->
    <GuidesSection 
      :guides="guides"
      @read-guide="(guide) => console.log('阅读攻略:', guide)"
    />

    <!-- 旅游活动安排组件 -->
    <ActivitiesSection 
      :activities="activities"
      @book-activity="(activity) => console.log('预订活动:', activity)"
    />

    <!-- 底部信息区域 -->
    <footer class="bg-base-200 py-8 mt-16">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h3 class="text-xl font-bold text-base-content mb-4">{{ serverConfig.VITE_APP_TITLE }}</h3>
          <p class="text-base-content/70">© 2024 智能旅游规划与导航 - 让每一次旅行都充满惊喜</p>
        </div>
      </div>
    </footer>
  </div>

  <!-- 景点详情弹窗 -->
  <AttractionDetailDialog
    v-model="dialogVisible"
    :attraction="selectedAttraction"
    :loading="detailLoading"
    :favorite-loading="favoriteLoading"
    @favorite="handleFavoriteFromDialog"
    @start-planning="goPlanningWith"
  />
</template>

<script setup lang="ts">
import serverConfig from '@/configs'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Motion } from 'motion-v'
import { getAttractions, getAttractionDetail, addFavorite, getFavorites, removeFavorite } from '@/api/Travel-planning/attraction'
import type { Attraction, AttractionDetail, FavoriteItem } from '@/types/factory'
import { ElMessage, ElDialog } from 'element-plus'
import HeroSection from '@/components/pages/index/HeroSection.vue'
import DestinationsSection from '@/components/pages/index/DestinationsSection.vue'
import GuidesSection from '@/components/pages/index/GuidesSection.vue'
import ActivitiesSection from '@/components/pages/index/ActivitiesSection.vue'
import AttractionDetailDialog from '@/components/pages/index/AttractionDetailDialog.vue'

const router = useRouter()

// 搜索
const searchQuery = ref('')
const presetKeywords = ref<string[]>(['热门: 三亚', '亲子', '美食', '徒步', '海岛', '自驾'])
const handleSearch = (query?: string) => {
  const searchTerm = query || searchQuery.value
  if (!searchTerm.trim()) return
  // 简单跳转到规划页并带上参数
  router.push({ path: '/planning', query: { q: searchTerm } })
}
const applyKeyword = (k: string) => {
  searchQuery.value = k.replace(/^热门:\s*/, '')
  handleSearch(k.replace(/^热门:\s*/, ''))
}

// 目的地推荐
const allDestinations = ref<Attraction[]>([]) // 存储所有景点数据
const destinations = ref<Attraction[]>([]) // 当前显示的景点（最多6个）
const loading = ref(false)
const dialogVisible = ref(false)
const selectedAttraction = ref<AttractionDetail | null>(null)
const detailLoading = ref(false)
const favoriteLoading = ref(false)

// 收藏列表
const favoritesList = ref<FavoriteItem[]>([])
const favoritesMap = ref<Map<number, number>>(new Map()) // attractionId -> favoriteId

// 获取收藏列表
const loadFavorites = async () => {
  try {
    const response = await getFavorites({ page: 1, page_size: 1000 })
    if (response.code === 200) {
      favoritesList.value = response.data.favorites
      // 构建收藏映射表
      favoritesMap.value.clear()
      response.data.favorites.forEach(favorite => {
        favoritesMap.value.set(favorite.attraction.id, favorite.id)
      })
      // 更新景点收藏状态
      updateAttractionsWithFavorites()
    }
  } catch (error) {
    console.error('获取收藏列表失败:', error)
  }
}

// 更新景点收藏状态
const updateAttractionsWithFavorites = () => {
  allDestinations.value.forEach(attraction => {
    attraction.isFavorited = favoritesMap.value.has(attraction.id)
  })
  destinations.value.forEach(attraction => {
    attraction.isFavorited = favoritesMap.value.has(attraction.id)
  })
}

// 获取景点列表
const loadAttractions = async () => {
  try {
    loading.value = true
    const response = await getAttractions()
    if (response.code === 200) {
      allDestinations.value = response.data.attractions
      // 显示前6个景点
      destinations.value = allDestinations.value.slice(0, 6)
      // 加载完景点后更新收藏状态
      updateAttractionsWithFavorites()
    } else {
      ElMessage.error(response.msg || '获取景点列表失败')
    }
  } catch (error) {
    console.error('获取景点列表失败:', error)
    ElMessage.error('获取景点列表失败')
  } finally {
    loading.value = false
  }
}

// 获取景点详情
const showAttractionDetail = async (attractionId: number) => {
  try {
    detailLoading.value = true
    dialogVisible.value = true
    const response = await getAttractionDetail(attractionId)
    if (response.code === 200) {
      selectedAttraction.value = response.data
      // 设置收藏状态
      if (selectedAttraction.value) {
        selectedAttraction.value.isFavorited = favoritesMap.value.has(attractionId)
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

// 处理收藏/取消收藏
const handleFavorite = async (attractionId: number, event?: Event) => {
  if (event) {
    event.stopPropagation()
  }
  
  const isFavorited = favoritesMap.value.has(attractionId)
  favoriteLoading.value = true
  
  try {
    if (isFavorited) {
      // 取消收藏
      const favoriteId = favoritesMap.value.get(attractionId)!
      const response = await removeFavorite(favoriteId)
      if (response.code === 200) {
        ElMessage.success('取消收藏成功')
        // 更新本地数据
        favoritesMap.value.delete(attractionId)
        favoritesList.value = favoritesList.value.filter(f => f.id !== favoriteId)
        
        // 更新景点收藏状态
        if (selectedAttraction.value && selectedAttraction.value.id === attractionId) {
          selectedAttraction.value.isFavorited = false
        }
        const allAttraction = allDestinations.value.find(d => d.id === attractionId)
        if (allAttraction) {
          allAttraction.isFavorited = false
        }
        const attraction = destinations.value.find(d => d.id === attractionId)
        if (attraction) {
          attraction.isFavorited = false
        }
      } else {
        ElMessage.error(response.msg || '取消收藏失败')
      }
    } else {
      // 添加收藏
      const response = await addFavorite({ attraction_id: attractionId })
      if (response.code === 200) {
        ElMessage.success('收藏成功')
        // 重新加载收藏列表以获取最新数据
        await loadFavorites()
      } else {
        ElMessage.error(response.msg || '收藏失败')
      }
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    ElMessage.error('收藏操作失败')
  } finally {
    favoriteLoading.value = false
  }
}

// 处理从弹窗组件传递过来的收藏事件
const handleFavoriteFromDialog = async (attractionId: number) => {
  await handleFavorite(attractionId)
  // 确保弹窗中的收藏状态得到更新
  if (selectedAttraction.value && selectedAttraction.value.id === attractionId) {
    selectedAttraction.value.isFavorited = favoritesMap.value.has(attractionId)
  }
}

const shuffleDestinations = () => {
  if (allDestinations.value.length <= 6) {
    // 如果总数不超过6个，就随机排序
    destinations.value = [...allDestinations.value].sort(() => Math.random() - 0.5)
  } else {
    // 如果总数超过6个，随机选择6个不同的景点
    const shuffled = [...allDestinations.value].sort(() => Math.random() - 0.5)
    destinations.value = shuffled.slice(0, 6)
  }
}
const goPlanningWith = (destination: Attraction | string) => {
  if (typeof destination === 'string') {
    router.push({ path: '/planning', query: { dest: destination } })
  } else {
    router.push({ path: '/planning', query: { destination: destination.name, id: destination.id.toString() } })
  }
}

// 页面加载时获取数据
onMounted(async () => {
  // 先加载收藏列表，再加载景点列表
  await loadFavorites()
  await loadAttractions()
})

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
