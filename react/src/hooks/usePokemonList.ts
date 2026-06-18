import { useState, useEffect } from "react";
import type { Pokemon } from "../types/pokemon";
import { useLocalStorage } from "./useLocalStorage";

const BASE_URL_API = "https://pokeapi.co/api/v2/";

export function usePokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useLocalStorage<number[]>("favs", []);
  const [offset, setOffset] = useState(0);

  const [types, setTypes] = useState<any[]>([]);

  const fetchPokes = async (currentOffset: number) => {
    const resp = await fetch(`${BASE_URL_API}pokemon?limit=20&offset=${currentOffset}`);
    const respData = await resp.json();

    const parseData = respData.results.map((p: any) => {
      const idMatch = p.url.match(/\d+/g);
      const id = idMatch ? parseInt(idMatch[1], 10) : 0;
      return { id, name: p.name, url: p.url };
    });

    if (currentOffset === 0) {
      setPokemons(parseData);
    } else {
      setPokemons(prev => [...prev, ...parseData]);
    }
  };

  useEffect(() => {
    fetchPokes(offset);
  }, [offset]);

  useEffect(() => {
    fetch(`${BASE_URL_API}type`)
      .then(r => r.json())
      .then(d => setTypes(d.results));
  }, []);

  const toogleFavs = (id: number) => {
    const updatedFavs = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];

    setFavorites(updatedFavs);
  };

  const loadMore = () => setOffset(prev => prev + 20);

  const fetchPokemonsByType = async (typeUrl: string) => {
    if (!typeUrl) {
      if (offset !== 0) {
        setOffset(0);
      } else {
        fetchPokes(0);
      }
      return;
    }
    const resp = await fetch(typeUrl);
    const data = await resp.json();
    const parseData = data.pokemon.map((p: any) => {
      const idMatch = p.pokemon.url.match(/\d+/g);
      const id = idMatch ? parseInt(idMatch[1], 10) : 0;
      return { id, name: p.pokemon.name, url: p.pokemon.url };
    });
    setPokemons(parseData);
  };

  return {
    pokemons,
    favorites,
    toogleFavs,
    loadMore,
    types,
    fetchPokemonsByType
  };
}
