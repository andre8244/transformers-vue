<script setup lang="ts">
import { ref } from 'vue'
import { useTextGenerator } from '@/composables/useTextGenerator'

const { load, generate, ready, loading, generating, result, error } = useTextGenerator()

const userMessage = ref('Tell me a joke about cats.')

const sendMessage = async () => {
  if (!userMessage.value) {
    return
  }
  generate(userMessage.value)
}
</script>

<template>
  <div>
    <h1>Chatbot-1</h1>
    <button @click="load" :disabled="ready || loading">Load model</button>
    <span v-if="loading">Loading...</span>
    <form @submit.prevent="sendMessage">
      <input v-model="userMessage" placeholder="Type your message here" />
      <button :disabled="!ready || generating">Send</button>
      <span v-if="generating">Generating...</span>
    </form>
    <pre>{{ error }}</pre>
    <pre>{{ result }}</pre>
  </div>
</template>

<style scoped></style>
