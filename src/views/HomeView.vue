<script setup lang="ts">
import { ref, watch, computed, onBeforeMount } from 'vue'
import { useHead } from '@unhead/vue'

import type { PokemonWithFavs } from '@/services/models'
import { CopyPokeClipboard } from '@/composables/clipboard-poke'

import { usePokemonStore } from '@/stores/usePokemon'
import { useSeoStore } from '@/stores/seo'
import { useStartStore } from '@/stores/start'

import WelcomeScreen from '@/components/WelcomeScreen.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import PokemonListItem from '@/components/ui/PokemonListItem.vue'

const store = usePokemonStore()
const start = useStartStore()
const seo = useSeoStore()

const showAll = ref<boolean>(true)
const searchTerm = ref<string>('')
const clipboardMessage = ref<string | null>(null)

const fetchData = async () => {
  try {
    await store.fetchList()
  } catch (error) {
    console.error('Error al cargar los Pokémon:', error)
  }
}

const filteredList = computed(() => {
  const baseList = showAll.value
    ? store.list
    : store.list.filter((pokemon) => pokemon.favs === true)

  if (searchTerm.value !== '') {
    seo.setTitle(`${searchTerm.value} | Pokédex`)
  } else {
    seo.setTitle(`Pokédex`)
  }

  return baseList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.value.toLowerCase()),
  )
})

const handleListSwitch = (status: boolean) => {
  showAll.value = status

  if (!status) {
    seo.setTitle('Favorites | Pokédex')
  } else {
    seo.setTitle('Pokédex')
  }
}

const clearSearchBar = () => {
  if (filteredList.value?.length === 0 && searchTerm.value !== '') {
    searchTerm.value = ''
  } else if (filteredList.value?.length === 0 && searchTerm.value === '') {
    showAll.value = true
  }
}

const clipboard = (poke: PokemonWithFavs) => {
  CopyPokeClipboard(poke)
  clipboardMessage.value = poke.name

  setTimeout(() => {
    clipboardMessage.value = null
  }, 3000)
}

const closeModal = () => {
  store.selectPokemon(null)
  seo.setTitle('Pokédex')
}

onBeforeMount(async () => {
  fetchData()
})

watch(
  () => start.pokedexStatus,
  async () => {
    if (start.pokedexStatus) {
      seo.setTitle('Pokédex')
      fetchData()
    }
  },
)

//SEO
useHead({
  title: () => seo.title,
})
</script>

<template>
  <WelcomeScreen />
  <LoadingScreen v-if="store.loading" />
  <div v-else-if="store.error">
    <h1>{{ store.error }}</h1>
  </div>

  <template v-else-if="store.list.length > 0">
    <div class="pokemon-list-container">
      <div class="search-bar-container">
        <div class="max-width">
          <input
            v-model="searchTerm"
            type="text"
            name="search"
            class="input search-bar"
            placeholder="Search"
          />
          <div class="search-icon-container">
            <svg
              class="search-icon"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.7552 15.5622L14.2499 12.0574C14.0917 11.8992 13.8772 11.8113 13.6522 11.8113H13.0791C14.0495 10.5705 14.6261 9.00967 14.6261 7.31179C14.6261 3.27273 11.3528 0 7.31304 0C3.27329 0 0 3.27273 0 7.31179C0 11.3508 3.27329 14.6236 7.31304 14.6236C9.01121 14.6236 10.5723 14.0471 11.8134 13.0768V13.6498C11.8134 13.8748 11.9013 14.0892 12.0595 14.2474L15.5648 17.7522C15.8953 18.0826 16.4297 18.0826 16.7567 17.7522L17.7517 16.7573C18.0822 16.4269 18.0822 15.8926 17.7552 15.5622ZM7.31304 11.8113C4.82731 11.8113 2.81271 9.80061 2.81271 7.31179C2.81271 4.82648 4.82379 2.81223 7.31304 2.81223C9.79876 2.81223 11.8134 4.82297 11.8134 7.31179C11.8134 9.79709 9.80228 11.8113 7.31304 11.8113Z"
                fill="#BFBFBF"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="results-container max-width">
        <ul class="all-pokemons-list pokemon-list">
          <li v-for="pokemon in filteredList" :key="pokemon.name">
            <PokemonListItem :pokemon="pokemon" />
          </li>
        </ul>
        <div class="no-results" v-if="filteredList.length === 0">
          <p class="h1">Uh-oh!</p>
          <p class="no-results-text">You look lost on your journey!</p>
          <button type="button" class="btn" @click="clearSearchBar">
            <span class="btn-txt">Go back home</span>
          </button>
        </div>
      </div>
      <div class="filters-container">
        <div class="max-width">
          <div :class="['btn', { 'disabled-btn': !showAll }]" @click="handleListSwitch(true)">
            <svg
              class="btn-icon"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.4375 16.9231H0.6875C0.505164 16.9231 0.330295 17.0122 0.201364 17.1709C0.0724328 17.3296 0 17.5448 0 17.7692L0 21.1538C0 21.3783 0.0724328 21.5935 0.201364 21.7522C0.330295 21.9109 0.505164 22 0.6875 22H3.4375C3.61984 22 3.7947 21.9109 3.92364 21.7522C4.05257 21.5935 4.125 21.3783 4.125 21.1538V17.7692C4.125 17.5448 4.05257 17.3296 3.92364 17.1709C3.7947 17.0122 3.61984 16.9231 3.4375 16.9231ZM3.4375 0H0.6875C0.505164 0 0.330295 0.0891481 0.201364 0.247833C0.0724328 0.406517 0 0.62174 0 0.846154L0 4.23077C0 4.45518 0.0724328 4.67041 0.201364 4.82909C0.330295 4.98777 0.505164 5.07692 0.6875 5.07692H3.4375C3.61984 5.07692 3.7947 4.98777 3.92364 4.82909C4.05257 4.67041 4.125 4.45518 4.125 4.23077V0.846154C4.125 0.62174 4.05257 0.406517 3.92364 0.247833C3.7947 0.0891481 3.61984 0 3.4375 0ZM3.4375 8.46154H0.6875C0.505164 8.46154 0.330295 8.55069 0.201364 8.70937C0.0724328 8.86806 0 9.08328 0 9.30769L0 12.6923C0 12.9167 0.0724328 13.1319 0.201364 13.2906C0.330295 13.4493 0.505164 13.5385 0.6875 13.5385H3.4375C3.61984 13.5385 3.7947 13.4493 3.92364 13.2906C4.05257 13.1319 4.125 12.9167 4.125 12.6923V9.30769C4.125 9.08328 4.05257 8.86806 3.92364 8.70937C3.7947 8.55069 3.61984 8.46154 3.4375 8.46154ZM21.3125 17.7692H7.5625C7.38016 17.7692 7.2053 17.8584 7.07636 18.0171C6.94743 18.1757 6.875 18.391 6.875 18.6154V20.3077C6.875 20.5321 6.94743 20.7473 7.07636 20.906C7.2053 21.0647 7.38016 21.1538 7.5625 21.1538H21.3125C21.4948 21.1538 21.6697 21.0647 21.7986 20.906C21.9276 20.7473 22 20.5321 22 20.3077V18.6154C22 18.391 21.9276 18.1757 21.7986 18.0171C21.6697 17.8584 21.4948 17.7692 21.3125 17.7692ZM21.3125 0.846154H7.5625C7.38016 0.846154 7.2053 0.935302 7.07636 1.09399C6.94743 1.25267 6.875 1.46789 6.875 1.69231V3.38462C6.875 3.60903 6.94743 3.82425 7.07636 3.98294C7.2053 4.14162 7.38016 4.23077 7.5625 4.23077H21.3125C21.4948 4.23077 21.6697 4.14162 21.7986 3.98294C21.9276 3.82425 22 3.60903 22 3.38462V1.69231C22 1.46789 21.9276 1.25267 21.7986 1.09399C21.6697 0.935302 21.4948 0.846154 21.3125 0.846154ZM21.3125 9.30769H7.5625C7.38016 9.30769 7.2053 9.39684 7.07636 9.55552C6.94743 9.71421 6.875 9.92943 6.875 10.1538V11.8462C6.875 12.0706 6.94743 12.2858 7.07636 12.4445C7.2053 12.6032 7.38016 12.6923 7.5625 12.6923H21.3125C21.4948 12.6923 21.6697 12.6032 21.7986 12.4445C21.9276 12.2858 22 12.0706 22 11.8462V10.1538C22 9.92943 21.9276 9.71421 21.7986 9.55552C21.6697 9.39684 21.4948 9.30769 21.3125 9.30769Z"
                fill="white"
              />
            </svg>
            <span class="btn-txt">All</span>
          </div>
          <div :class="['btn', { 'disabled-btn': showAll }]" @click="handleListSwitch(false)">
            <svg
              class="btn-icon"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.81981 0.765294L7.13459 6.45365L1.12675 7.36877C0.0493653 7.53204 -0.38241 8.91975 0.398897 9.71458L4.74543 14.1398L3.7174 20.391C3.53235 21.5209 4.67141 22.3673 5.62543 21.8389L11 18.8873L16.3746 21.8389C17.3286 22.363 18.4677 21.5209 18.2826 20.391L17.2546 14.1398L21.6011 9.71458C22.3824 8.91975 21.9506 7.53204 20.8733 7.36877L14.8654 6.45365L12.1802 0.765294C11.6991 -0.248643 10.305 -0.261532 9.81981 0.765294Z"
                fill="white"
              />
            </svg>

            <span class="btn-txt">Favorites</span>
          </div>
        </div>
      </div>
    </div>
  </template>

  <div :class="['modal-container', { 'open-modal': store.selected }]">
    <div class="modal-bg"></div>
    <div class="selected-pokemon-modal" v-if="store.selected">
      <div class="close-modal-btn" @click="closeModal">
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 0C5.81855 0 0 5.81855 0 13C0 20.1815 5.81855 26 13 26C20.1815 26 26 20.1815 26 13C26 5.81855 20.1815 0 13 0ZM19.3742 16.4125C19.6206 16.6589 19.6206 17.0573 19.3742 17.3036L17.2984 19.3742C17.052 19.6206 16.6536 19.6206 16.4073 19.3742L13 15.9355L9.5875 19.3742C9.34113 19.6206 8.94274 19.6206 8.69637 19.3742L6.62581 17.2984C6.37944 17.052 6.37944 16.6536 6.62581 16.4073L10.0645 13L6.62581 9.5875C6.37944 9.34113 6.37944 8.94274 6.62581 8.69637L8.70161 6.62056C8.94798 6.37419 9.34637 6.37419 9.59274 6.62056L13 10.0645L16.4125 6.62581C16.6589 6.37944 17.0573 6.37944 17.3036 6.62581L19.3794 8.70161C19.6258 8.94798 19.6258 9.34637 19.3794 9.59274L15.9355 13L19.3742 16.4125Z"
            fill="white"
          />
        </svg>
      </div>
      <div class="selected-img-container">
        <img
          src="/images/modal-bg.jpg"
          alt="Selected Pokemon - Background"
          class="selected-img-bg"
          loading="eager"
        />
        <img
          v-if="
            store.selected.sprites.other &&
            store.selected.sprites.other['official-artwork'].front_default
          "
          :src="store.selected.sprites.other['official-artwork'].front_default"
          :alt="'Picture of ' + store.selected.name"
          class="selected-img"
          loading="lazy"
        />
      </div>
      <div class="selected-data-container">
        <ul class="selected-data-list">
          <li class="selected-data-item">
            <span class="selected-data-item-title">Name: </span>{{ store.selected.name }}
          </li>
          <li class="selected-data-item">
            <span class="selected-data-item-title">Weight: </span>{{ store.selected.weight }}
          </li>
          <li class="selected-data-item">
            <span class="selected-data-item-title">Height: </span>{{ store.selected.height }}
          </li>
          <li class="selected-data-item">
            <span class="selected-data-item-title">Types: </span
            ><span v-for="(types, i) in store.selected.types" :key="i" class="selected-data-type"
              >{{ types.type.name }}{{ i <= store.selected.types.length - 2 ? ', ' : '' }}</span
            >
          </li>
        </ul>
        <div class="selected-actions-cont">
          <button type="button" class="btn" @click="clipboard(store.selected)">
            <span class="btn-txt">Share to my friends</span>
          </button>
          <div
            :class="[
              'fav-btn',
              { 'fav-active': filteredList.find((pk) => pk.name === store.selected!.name)?.favs },
            ]"
            @click="store.handleFavs(store.selected)"
          >
            <svg
              class="fav-btn-icon"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6052 0.904438L8.43178 7.62704L1.33161 8.70855C0.0583408 8.9015 -0.451939 10.5415 0.471424 11.4809L5.60824 16.7107L4.39329 24.0984C4.1746 25.4338 5.52076 26.4341 6.64824 25.8096L13 22.3213L19.3518 25.8096C20.4792 26.429 21.8254 25.4338 21.6067 24.0984L20.3918 16.7107L25.5286 11.4809C26.4519 10.5415 25.9417 8.9015 24.6684 8.70855L17.5682 7.62704L14.3948 0.904438C13.8262 -0.293851 12.1787 -0.309084 11.6052 0.904438Z"
                fill="#BFBFBF"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div :class="['clipboard-toast', { 'show-toast': clipboardMessage }]">
    <p class="toast-msg">
      Copied <span class="copied-name">{{ clipboardMessage }}</span> to clipboard
    </p>
  </div>
</template>
