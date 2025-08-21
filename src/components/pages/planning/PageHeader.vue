<template>
  <div class="page-header">
    <!-- 背景装饰 -->
    <div class="header-bg">
      <div class="bg-pattern"></div>
      <div class="floating-elements">
        <div class="element element-1">✈️</div>
        <div class="element element-2">🗺️</div>
        <div class="element element-3">🎒</div>
        <div class="element element-4">📍</div>
      </div>
    </div>
    
    <!-- 头部内容 -->
    <div class="header-content">
      <div class="title-section">
        <h1 class="main-title">
          <span class="title-icon">🌟</span>
          智能旅行规划
        </h1>
        <p class="subtitle">让AI为您定制专属的旅行体验</p>
      </div>
      
      <!-- 快捷操作 -->
      <div class="quick-actions">
        <div class="action-card" @click="$emit('quickAction', 'popular')">
          <div class="action-icon">🔥</div>
          <div class="action-text">
            <div class="action-title">热门目的地</div>
            <div class="action-desc">查看推荐</div>
          </div>
        </div>
        
        <div class="action-card" @click="$emit('quickAction', 'template')">
          <div class="action-icon">📋</div>
          <div class="action-text">
            <div class="action-title">行程模板</div>
            <div class="action-desc">快速开始</div>
          </div>
        </div>
        
        <div class="action-card" @click="$emit('quickAction', 'history')">
          <div class="action-icon">📚</div>
          <div class="action-text">
            <div class="action-title">历史记录</div>
            <div class="action-desc">查看过往</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'quickAction', action: 'popular' | 'template' | 'history'): void
}

defineEmits<Emits>()
</script>

<style scoped>
.page-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  margin-bottom: 40px;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
}

.bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, white 2px, transparent 2px);
  background-size: 50px 50px;
  animation: float 20s ease-in-out infinite;
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.element {
  position: absolute;
  font-size: 24px;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  top: 60%;
  right: 15%;
  animation-delay: 1.5s;
}

.element-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 3s;
}

.element-4 {
  top: 40%;
  right: 30%;
  animation-delay: 4.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

.header-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.title-section {
  margin-bottom: 40px;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title-icon {
  font-size: 52px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.subtitle {
  font-size: 20px;
  opacity: 0.9;
  font-weight: 300;
  margin: 0;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.action-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-card:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.action-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.action-text {
  text-align: left;
  flex: 1;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 14px;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }
  
  .main-title {
    font-size: 36px;
    flex-direction: column;
    gap: 8px;
  }
  
  .subtitle {
    font-size: 18px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .action-card {
    padding: 16px;
  }
  
  .action-icon {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 28px;
  }
  
  .title-icon {
    font-size: 32px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}
</style>