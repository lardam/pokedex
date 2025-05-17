<script setup lang="ts">
import { useStartStore } from '@/stores/start'
import PikachuGreetings from './ui/PikachuGreetings.vue'

const start = useStartStore()
</script>

<template>
  <div :class="['welcome-screen', { 'hide-welcome-screen': start.pokedexStatus }]">
    <div class="max-width">
      <PikachuGreetings />
      <div class="welcome-text-container">
        <h1 class="title">Welcome to Pokédex</h1>
        <p class="welcome-text">
          The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in the
          Pokémon world.
        </p>
        <button type="button" class="btn" @click="start.handlePokedexStatus(true)">
          <span class="btn-txt">Get started</span>
        </button>
      </div>
    </div>
  </div>
</template>
