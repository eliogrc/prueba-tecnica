import { useState, useEffect } from "react";
import type { Pokemon } from "../types/pokemon";
import styles from "../App.module.css";

const BASE_URL_DETAIL = "https://pokeapi.co/api/v2/pokemon/";

interface Props {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export function PokemonRow({ pokemon, isFavorite, onToggleFavorite }: Props) {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    fetch(`${BASE_URL_DETAIL}${pokemon.id}`)
      .then(r => r.json())
      .then(d => setImage(d.sprites.front_default))
      .catch(e => console.error("Error al obtener detalle", e));
  }, [pokemon.id]);

  return (
    <tr>
      <td>{pokemon.id}</td>
      <td>
        {image ? (
          <img src={image} alt={pokemon.name} width="80" />
        ) : (
          "Cargando..."
        )}
      </td>
      <td style={{ textTransform: "capitalize" }}>{pokemon.name}</td>
      <td>
        <button
          className={`${styles.favBtn} ${isFavorite ? styles.fav : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(pokemon.id);
          }}
        >
          {isFavorite ? '⭐ Favorito' : '☆ Marcar Favorito'}
        </button>
      </td>
    </tr>
  );
}
