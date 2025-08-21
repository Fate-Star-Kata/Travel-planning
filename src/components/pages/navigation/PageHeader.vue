<template>
  <div v-show="!hasRoutes" class="text-center mb-8">
    <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
      🧭 智能导航
    </h1>
    <p class="text-gray-600">为您规划最优出行路线</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hasRoutes: boolean
}

withDefaults(defineProps<Props>(), {
  hasRoutes: false
})
</script>