<script setup lang="ts">
import { ref } from 'vue'
import type { PokemonWithFavs } from '@/services/models'
import { usePokemonStore } from '@/stores/usePokemon'
import { useSeoStore } from '@/stores/seo'

const props = defineProps({
  pokemon: {
    type: Object as () => PokemonWithFavs,
    required: true,
  },
})

const store = usePokemonStore()
const seo = useSeoStore()

const capitalizeName = (name: string) => {
  const capital = name.charAt(0).toUpperCase()
  const lower = name.slice(1)

  return capital + lower
}

const cursorX = ref(0)
const cursorY = ref(0)
const isHovering = ref(false)
const cursorMessage = ref(`Read more about ${capitalizeName(props.pokemon.name)}`)

const openDetails = (poke: PokemonWithFavs | null) => {
  store.selectPokemon(poke)
  if (poke) {
    seo.setTitle(`${capitalizeName(poke.name)} | Pokédex`)
  }
}

const updateCursor = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  cursorX.value = e.clientX - rect.left
  cursorY.value = e.clientY - rect.top
}

const showCursor = () => {
  isHovering.value = true
}

const hideCursor = () => {
  isHovering.value = false
}
</script>

<template>
  <div
    class="pokemon-list-item"
    @mousemove="updateCursor"
    @mouseenter="showCursor"
    @mouseleave="hideCursor"
    @click="openDetails(props.pokemon)"
  >
    <p class="pokemon-name">{{ props.pokemon.name }}</p>
    <div
      :class="['fav-btn', { 'fav-active': props.pokemon.favs }]"
      @click.stop="store.handleFavs(props.pokemon)"
      @mouseenter="cursorMessage = `Add ${capitalizeName(props.pokemon.name)} to favorites`"
      @mouseleave="cursorMessage = `Read more about ${capitalizeName(props.pokemon.name)}`"
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
    <div
      v-show="isHovering"
      class="cursor-data"
      :style="{
        top: cursorY + 40 + 'px',
        left: cursorX + 40 + 'px',
      }"
    >
      <p>
        {{ cursorMessage }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pokemon-list-item {
  position: relative;
  &:hover .cursor-data {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.cursor-data {
  padding: 4px 8px;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  background-color: #f22539;
  pointer-events: none;
  z-index: 10;
  p {
    text-wrap: nowrap;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
  }
}

@media screen and (max-width: 1023px) {
  .cursor-data {
    display: none;
  }
}
</style>
