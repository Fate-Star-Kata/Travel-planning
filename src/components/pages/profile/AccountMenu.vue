<template>
  <div class="card bg-base-100 shadow-xl border border-base-300/50 hover:shadow-2xl transition-all duration-300">
    <div class="card-body p-0">
      <h2 class="card-title px-6 pt-6 text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          class="inline-block w-6 h-6 stroke-current mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
          </path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        账户设置
      </h2>
      <ul class="menu menu-lg w-full">
        <li v-for="item in accountMenu" :key="item.key">
          <a @click.prevent="$emit('menu-click', item)"
            class="flex items-center gap-4 hover:bg-secondary/10 transition-all duration-300 group">
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
  accountMenu: MenuItem[]
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