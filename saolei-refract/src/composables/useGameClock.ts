import type { Ref } from 'vue'

export function useGameClock(isRunning: () => boolean, elapsed: Ref<number> = ref(0)) {
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    timer = setInterval(() => {
      if (isRunning())
        elapsed.value++
    }, 1000)
  })
  onUnmounted(() => clearInterval(timer))
  return elapsed
}
