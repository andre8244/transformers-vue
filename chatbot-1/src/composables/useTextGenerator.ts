import { ref, onUnmounted } from 'vue'

export function useTextGenerator() {
  const worker = new Worker(new URL('../workers/textGen.worker.js', import.meta.url), {
    type: 'module',
  })

  const ready = ref(false)
  const loading = ref(false)
  const result = ref(null)
  const generating = ref(false)
  const error = ref(null)

  worker.onmessage = (event) => {
    const { type } = event.data

    if (type === 'loaded') {
      ready.value = true
      loading.value = false
    }

    if (type === 'result') {
      result.value = event.data.result
      generating.value = false
    }

    if (type === 'error') {
      error.value = event.data.error
    }
  }

  const load = () => {
    loading.value = true
    worker.postMessage({ type: 'load' })
  }

  const generate = (prompt: string, maxNewTokens?: number) => {
    generating.value = true
    worker.postMessage({
      type: 'generate',
      payload: { prompt, maxNewTokens },
    })
  }

  onUnmounted(() => {
    worker.terminate()
  })

  return {
    load,
    generate,
    ready,
    result,
    loading,
    generating,
    error,
  }
}
