<template>
  <div class="itinerary-result">
    <!-- 操作按钮 -->
    <div class="result-actions">
      <el-dropdown @command="handleExport">
        <el-button type="primary" icon="Download">
          导出行程
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="json">导出为JSON</el-dropdown-item>
            <el-dropdown-item command="pdf">导出为PDF</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button 
        icon="DocumentCopy" 
        @click="$emit('copy')"
      >
        复制行程
      </el-button>
    </div>

    <!-- 空状态 -->
    <div v-if="!hasData && !loading" class="empty-state">
      <div class="empty-icon">📋</div>
      <p>还没有生成行程，点击上方按钮开始规划吧！</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="6" animated />
      <div class="loading-text">
        <el-icon class="rotating"><Loading /></el-icon>
        正在为您生成专属行程...
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error-state">
      <el-alert
        :title="error"
        type="error"
        show-icon
        :closable="false"
      />
    </div>

    <!-- 行程结果 -->
    <div v-if="hasData && !loading" class="itinerary-content">
      <!-- 行程概览 -->
      <div v-if="tripPlan" class="trip-overview">
        <h2 class="trip-title">{{ tripPlan.title }}</h2>
        <div class="trip-meta">
          <div class="meta-item">
            <span class="label">目的地：</span>
            <span class="value">{{ tripPlan.destination_city }}</span>
          </div>
          <div class="meta-item">
            <span class="label">时间：</span>
            <span class="value">{{ tripPlan.start_date }} 至 {{ tripPlan.end_date }}</span>
          </div>
          <div class="meta-item">
            <span class="label">人数：</span>
            <span class="value">{{ tripPlan.traveler_count }}人</span>
          </div>
          <div class="meta-item">
            <span class="label">预算：</span>
            <span class="value budget">¥{{ tripPlan.estimated_budget }}</span>
          </div>
        </div>
        
        <div v-if="tripPlan.overview" class="trip-overview-text">
          <h3>行程概述</h3>
          <p>{{ tripPlan.overview }}</p>
        </div>
      </div>

      <!-- 每日行程 -->
      <div class="daily-itinerary">
        <div 
          v-for="day in itinerary" 
          :key="day.day"
          class="day-card"
        >
          <div class="day-header">
            <div class="day-number">第{{ day.day }}天</div>
            <h3 class="day-title">{{ day.title }}</h3>
          </div>
          
          <div class="day-content">
            <!-- 活动安排 -->
            <div class="activities">
              <h4><i class="icon">🎯</i>活动安排</h4>
              <ul class="activity-list">
                <li v-for="activity in day.activities" :key="activity">
                  {{ activity }}
                </li>
              </ul>
            </div>
            
            <!-- 用餐推荐 -->
            <div v-if="day.meals?.length" class="meals">
              <h4><i class="icon">🍽️</i>用餐推荐</h4>
              <ul class="meal-list">
                <li v-for="meal in day.meals" :key="meal">
                  {{ meal }}
                </li>
              </ul>
            </div>
            
            <!-- 交通方式 -->
            <div class="transportation">
              <h4><i class="icon">🚗</i>交通方式</h4>
              <p>{{ day.transportation }}</p>
            </div>
            
            <!-- 温馨提示 -->
            <div v-if="day.notes" class="notes">
              <h4><i class="icon">💡</i>温馨提示</h4>
              <p>{{ day.notes }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 旅行小贴士 -->
      <div v-if="tripPlan?.tips?.length" class="travel-tips">
        <h3><i class="icon">🎯</i>旅行小贴士</h3>
        <ul class="tips-list">
          <li v-for="tip in tripPlan.tips" :key="tip">
            {{ tip }}
          </li>
        </ul>
      </div>

      <!-- 预算明细 -->
      <div v-if="tripPlan?.budget_breakdown" class="budget-breakdown">
        <h3><i class="icon">💰</i>预算明细</h3>
        <div class="budget-items">
          <div class="budget-item">
            <span class="label">住宿费用：</span>
            <span class="amount">¥{{ tripPlan.budget_breakdown.accommodation }}</span>
          </div>
          <div class="budget-item">
            <span class="label">交通费用：</span>
            <span class="amount">¥{{ tripPlan.budget_breakdown.transportation }}</span>
          </div>
          <div class="budget-item">
            <span class="label">餐饮费用：</span>
            <span class="amount">¥{{ tripPlan.budget_breakdown.food }}</span>
          </div>
          <div class="budget-item">
            <span class="label">景点门票：</span>
            <span class="amount">¥{{ tripPlan.budget_breakdown.tickets }}</span>
          </div>
          <div class="budget-item">
            <span class="label">其他费用：</span>
            <span class="amount">¥{{ tripPlan.budget_breakdown.others }}</span>
          </div>
          <div class="budget-item total">
            <span class="label">总计：</span>
            <span class="amount">¥{{ tripPlan.estimated_budget }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loading, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { TripPlan } from '@/types/Travel-planning/travel-plan'

interface RouteDay {
  day: number
  title: string
  activities: string[]
  meals?: string[]
  transportation?: string
  notes?: string
}

interface Props {
  itinerary?: RouteDay[]
  tripPlan?: TripPlan | null
  loading?: boolean
  error?: string
}

interface Emits {
  (e: 'export'): void
  (e: 'exportPdf'): void
  (e: 'copy'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 处理导出选择
function handleExport(command: string) {
  if (command === 'json') {
    emit('export')
  } else if (command === 'pdf') {
    exportToPDF()
  }
}

// 导出为PDF
async function exportToPDF() {
  try {
    ElMessage.info('正在生成PDF，请稍候...')
    
    // 获取行程内容元素
    const element = document.querySelector('.itinerary-content') as HTMLElement
    if (!element) {
      ElMessage.error('未找到行程内容')
      return
    }
    
    // 创建一个临时容器来处理样式兼容性
    const tempContainer = element.cloneNode(true) as HTMLElement
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = element.clientWidth + 'px'
    
    // 替换不兼容的CSS属性
    const replaceIncompatibleStyles = (el: HTMLElement) => {
      const computedStyle = window.getComputedStyle(el)
      
      // 处理oklch颜色函数
      if (computedStyle.color && computedStyle.color.includes('oklch')) {
        el.style.color = '#333333' // 使用默认颜色
      }
      if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
        el.style.backgroundColor = '#ffffff' // 使用默认背景色
      }
      if (computedStyle.borderColor && computedStyle.borderColor.includes('oklch')) {
        el.style.borderColor = '#e0e0e0' // 使用默认边框色
      }
      
      // 递归处理子元素
      Array.from(el.children).forEach(child => {
        if (child instanceof HTMLElement) {
          replaceIncompatibleStyles(child)
        }
      })
    }
    
    document.body.appendChild(tempContainer)
    replaceIncompatibleStyles(tempContainer)
    
    // 创建canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 1.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      ignoreElements: (element) => {
        // 忽略可能有问题的元素
        return element.tagName === 'SCRIPT' || element.tagName === 'STYLE'
      }
    })
    
    // 移除临时容器
    document.body.removeChild(tempContainer)
    
    // 创建PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210 // A4宽度
    const pageHeight = 295 // A4高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    // 添加第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // 如果内容超过一页，添加更多页面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // 下载PDF
    const fileName = `行程规划-${props.tripPlan?.destination_city || '未知目的地'}-${new Date().toISOString().slice(0, 10)}.pdf`
    pdf.save(fileName)
    
    ElMessage.success('PDF导出成功')
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error(`PDF导出失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

const hasData = computed(() => {
  return props.itinerary && props.itinerary.length > 0
})
</script>

<style scoped>
.itinerary-result {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.itinerary-content {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.itinerary-content::-webkit-scrollbar {
  width: 6px;
}

.itinerary-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.itinerary-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.itinerary-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.result-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.loading-state {
  padding: 20px;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  color: #409eff;
  font-weight: 500;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-state {
  margin-bottom: 20px;
}

.trip-overview {
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.trip-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
}

.trip-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item .label {
  font-weight: 500;
  margin-right: 8px;
}

.meta-item .value {
  font-weight: 600;
}

.budget {
  color: #ffd700;
  font-size: 18px;
}

.trip-overview-text {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 8px;
}

.trip-overview-text h3 {
  margin-bottom: 8px;
  font-size: 16px;
}

.daily-itinerary {
  margin-bottom: 32px;
}

.day-card {
  margin-bottom: 24px;
  border: 1px solid #ebeef5;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.day-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.day-header {
  background: linear-gradient(135deg, #409eff, #36cfc9);
  color: white;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.day-number {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.day-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.day-content {
  padding: 20px;
}

.day-content > div {
  margin-bottom: 20px;
}

.day-content > div:last-child {
  margin-bottom: 0;
}

.day-content h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.icon {
  font-size: 18px;
}

.activity-list,
.meal-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-list li,
.meal-list li {
  padding: 8px 0;
  border-bottom: 1px solid #f5f7fa;
  position: relative;
  padding-left: 20px;
}

.activity-list li:before,
.meal-list li:before {
  content: '•';
  color: #409eff;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.activity-list li:last-child,
.meal-list li:last-child {
  border-bottom: none;
}

.transportation p,
.notes p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.travel-tips {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.travel-tips h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #333;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: 8px 0;
  position: relative;
  padding-left: 20px;
  color: #666;
}

.tips-list li:before {
  content: '💡';
  position: absolute;
  left: 0;
}

.budget-breakdown {
  background: #fff7e6;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ffd591;
}

.budget-breakdown h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #d48806;
}

.budget-items {
  display: grid;
  gap: 12px;
}

.budget-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #ffe7ba;
}

.budget-item:last-child {
  border-bottom: none;
}

.budget-item.total {
  font-weight: 600;
  font-size: 16px;
  color: #d48806;
  border-top: 2px solid #ffd591;
  padding-top: 12px;
  margin-top: 8px;
}

.budget-item .label {
  color: #8c8c8c;
}

.budget-item .amount {
  font-weight: 600;
  color: #d48806;
}

@media (max-width: 768px) {
  .result-actions {
    flex-direction: column;
  }
  
  .trip-meta {
    grid-template-columns: 1fr;
  }
  
  .day-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
