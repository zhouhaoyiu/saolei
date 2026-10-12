<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
import GameIcon from './components/GameIcon.vue'
</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="brand"><span class="brand-mark"><GameIcon name="mine" :size="23" /></span><div><h1>扫雷</h1><span>MINESWEEPER</span></div></div>
      <div class="header-actions">
        <button type="button" class="icon-button" :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'" :title="isDark ? '切换到浅色模式' : '切换到深色模式'" @click="toggleDark()"><GameIcon :name="isDark ? 'sun' : 'moon'" :size="20" /></button>
        <a class="source-link" href="https://github.com/zhouhaoyiu/saolei" target="_blank" rel="noreferrer">GitHub<GameIcon name="arrow" :size="15" /></a>
      </div>
    </header>
    <main><router-view /></main>
    <footer class="site-footer"><span class="footer-mark" />一场与数字的小小博弈<span class="footer-separator">/</span><span>不计输赢，享受下一步。</span></footer>
  </div>
</template>
