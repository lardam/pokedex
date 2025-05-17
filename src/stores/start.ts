import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStartStore = defineStore('start', () => {
  const pokedexStatus = ref<boolean>(false)

  const handlePokedexStatus = (st: boolean) => {
    pokedexStatus.value = st
  }

  return { pokedexStatus, handlePokedexStatus }
})
