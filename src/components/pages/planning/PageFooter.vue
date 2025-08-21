<template>
  <div class="page-footer">
    <div class="footer-bottom">
      <p class="copyright">
        © 2024 智能旅行规划系统 - 让每一次旅行都成为美好回忆
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需props和emits，纯展示组件
</script>

<style scoped>
.page-footer {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  margin-top: 60px;
  padding: 40px 0 20px;
}



.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.copyright {
  color: #666;
  font-size: 14px;
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .page-footer {
    padding: 30px 0 15px;
  }
}
</style>
