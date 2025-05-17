import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSeoStore = defineStore('seo', () => {
  const title = ref<string>('Welcome to Pokedex')

  const setTitle = (tit: string | null) => {
    if (tit) {
      title.value = tit
    }
  }

  return { title, setTitle }
})
