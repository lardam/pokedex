import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { PokemonWithFavs } from '@/services/models'
import type { Pokemon } from 'pokenode-ts'

export const usePokemonStore = defineStore('pokemon', () => {
  const list = ref<PokemonWithFavs[]>([])
  const selected = ref<PokemonWithFavs | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchList() {
    loading.value = true
    error.value = null

    try {
      const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20')
      list.value = res.data.results.map((p: Pokemon) => ({
        ...p,
        favs: false,
      }))
    } catch {
      error.value = 'Failed to load list'
    } finally {
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }
  }

  async function selectPokemon(poke: PokemonWithFavs | null, fav?: boolean) {
    if (!poke) {
      selected.value = null
      return
    }

    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${poke.name}`)
      selected.value = { ...res.data, favs: fav }
    } catch {
      error.value = 'Failed to load details'
    } finally {
      loading.value = false
    }
  }

  function handleFavs(poke: PokemonWithFavs) {
    const index = list.value.findIndex((p) => p.name === poke.name)

    if (index !== -1) {
      list.value[index].favs = !list.value[index].favs
    }
  }

  return {
    list,
    selected,
    loading,
    error,
    fetchList,
    selectPokemon,
    handleFavs,
  }
})
