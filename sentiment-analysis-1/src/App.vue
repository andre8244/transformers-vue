<script setup lang="ts">
import { pipeline } from '@huggingface/transformers'
import { ref } from 'vue'

const inputText = ref('I hate bugs in my code!')
const output = ref('')

//// show loading state

const analyzeSentiment = async () => {
  const sentimentAnalysis = await pipeline('sentiment-analysis')
  const result = await sentimentAnalysis(inputText.value)
  output.value = JSON.stringify(result, null, 2)
}
</script>

<template>
  <input v-model="inputText" placeholder="Enter text for sentiment analysis" />
  <button @click="analyzeSentiment">Analyze Sentiment</button>
  <pre>{{ output }}</pre>
</template>

<style scoped></style>
