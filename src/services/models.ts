import type { Pokemon } from 'pokenode-ts'

export interface PokemonWithFavs extends Pokemon {
  favs: boolean
}
