import { useState, useEffect } from "react";
import type { Pokemon } from "../types/pokemon";

const BASE_URL_API = "https://pokeapi.co/api/v2/pokemon?limit=50&offset=0";
const BASE_URL_DETAIL = "https://pokeapi.co/api/v2/pokemon/";

export function usePokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    async function fetchPokes() {
      const resp = await fetch(BASE_URL_API);

      const respData = await resp.json();

      const parseData = await Promise.all(
        respData.results.map(async (p: any) => {
          const id = p.url.match(/\d+/g)[1];

          const detalle = await fetchPokesDetail(id);

          return { id, name: p.name, image: detalle.sprites.back_default };
        }),
      );

      console.log("Pokemons:", parseData);

      setPokemons(parseData);
      const favsLocal = localStorage.getItem("favs");

      if (favsLocal) setFavorites(JSON.parse(favsLocal));
    }

    fetchPokes();
  }, []);

  const toogleFavs = (id: number) => {
    const updatedFavs = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(updatedFavs);

    localStorage.setItem("favs", JSON.stringify(updatedFavs));
  };

  return { pokemons, favorites, toogleFavs };
}

async function fetchPokesDetail(id: number) {
  const detailPk = await fetch(`${BASE_URL_DETAIL}${id}`);

  return await detailPk.json();
}
