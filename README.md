# Pokédex

Una aplicación simple construida con Vue 3 y TypeScript que consume la PokeAPI para listar pokémon y mostrar su información básica.

## Tecnologías utilizadas

- 🔧 Framework: [Vue 3](https://vuejs.org/) + TypeScript + [Pinia](https://pinia.vuejs.org/)
- 🎨 CSS: [SASS](https://sass-lang.com/)
- 🔌 API: [PokeAPI](https://pokeapi.co/)
- 🧠 Tipado (y favicon): [pokenode-ts](https://pokenode-ts.vercel.app/)
- 🧾 SEO: [unhead.js](https://unhead.unjs.io/)

## Resumen

Esta aplicación cuenta con una única vista principal (Home) y un fallback (NotFound) para manejar rutas no válidas.

Al iniciar, se muestra un mensaje de bienvenida con un botón "Get started". Al hacer clic, se realiza la llamada a la API para obtener la lista de pokémon. Como la carga es muy liviana, se simula una demora de 1 segundo para dar lugar a una animación de carga visible.

Finalizada la carga (o cumplido el timeout, lo que ocurra primero), se listan todos los pokémon disponibles.

### Paginado

El listado actual muestra todos los resultados cargados. Para implementar paginado (por ejemplo, traer 20 resultados por página), se puede extender la lógica en el store:  
🗂️ `/stores/usePokemon.ts`  
Allí se debería agregar:

- Una variable de página
- Una función para modificar el offset en la URL, por ejemplo:  
  <https://pokeapi.co/api/v2/pokemon?offset=20&limit=20>

### Detalles de UI

- Se implementó un cursor personalizado visible únicamente al hacer hover sobre los ítems de la lista, para indicar que son interactivos.
- Al hacer clic en un pokémon, se copia su información al portapapeles y se muestra un toast de confirmación.
