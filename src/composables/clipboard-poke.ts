import type { PokemonWithFavs } from '@/services/models'

export const CopyPokeClipboard = (poke: PokemonWithFavs) => {
  const prepareData = {
    name: poke.name,
    weight: poke.weight,
    height: poke.height,
    types: poke.types.map((pk) => pk.type.name).join(', '),
  }

  navigator.clipboard.writeText(
    `Name: ${prepareData.name}, weight: ${prepareData.weight}, height: ${prepareData.height}, types: ${prepareData.types}`,
  )
}
