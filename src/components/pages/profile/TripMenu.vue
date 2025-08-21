<template>
  <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
    <div class="card-body p-0">
      <h2 class="card-title px-6 pt-6 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          class="inline-block w-6 h-6 stroke-current mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
          </path>
        </svg>
        我的行程
      </h2>
      <ul class="menu menu-lg w-full">
        <li v-for="item in tripMenu" :key="item.key">
          <a @click.prevent="$emit('menu-click', item)"
            class="flex items-center gap-4 hover:bg-primary/10 transition-all duration-300 group">
            <span class="text-2xl group-hover:scale-110 transition-transform duration-300">{{ item.icon }}</span>
            <span class="flex-1 font-medium">{{ item.label }}</span>
            <span
              class="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">›</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '@/types/Travel-planning/attraction'

// Props
interface Props {
  tripMenu: MenuItem[]
}

defineProps<Props>()

// Emits
defineEmits<{
  'menu-click': [item: MenuItem]
}>()
</script>

<style scoped>
/* 组件特定样式 */
</style>