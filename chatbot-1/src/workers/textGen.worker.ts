import { pipeline } from '@huggingface/transformers'

let generator: any = null
let history = [{ role: 'system', content: 'You are a helpful and friendly assistant.' }]

self.onmessage = async (event) => {
  const { type, payload } = event.data

  try {
    if (type === 'load') {
      if (generator) {
        throw new Error('Generator already loaded')
      }

      generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct', {
        dtype: 'q4',
        // device: 'auto', ////
      })

      self.postMessage({ type: 'loaded' })
    }

    if (type === 'generate') {
      if (!generator) {
        throw new Error('Generator not loaded')
      }

      history.push({ role: 'user', content: payload.prompt })

      const result = await generator(history, {
        max_new_tokens: payload.maxNewTokens ?? 128,
      })

      history.push({ role: 'assistant', content: result[0]?.generated_text.at(-1).content })

      self.postMessage({
        type: 'result',
        result,
      })
    }
  } catch (err: any) {
    self.postMessage({
      type: 'error',
      error: err.message,
    })
  }
}
