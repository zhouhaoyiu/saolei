<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
import GameIcon from './components/GameIcon.vue'
</script>

<template>
  <div class="desktop">
    <div class="game-window">
      <header class="window-titlebar">
        <h1><GameIcon name="mine" :size="18" />扫雷</h1>
        <span class="window-caption">Minesweeper</span>
      </header>
      <nav class="window-menubar" aria-label="游戏选项">
        <span>经典 · 10 × 10</span>
        <div>
          <button type="button" :aria-pressed="isDark" :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'" @click="toggleDark()">{{ isDark ? '浅色' : '深色' }}</button>
          <a href="https://github.com/zhouhaoyiu/saolei" target="_blank" rel="noreferrer">源码 ↗</a>
        </div>
      </nav>
      <main><router-view /></main>
    </div>
    <p class="desktop-note">左键揭开 · 右键插旗 · 点击笑脸重开</p>
  </div>
</template>
