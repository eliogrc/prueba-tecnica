import { useState } from 'react';
import type { Pokemon } from '../src/types/pokemon';
import styles from './App.module.css';

import { usePokemonList } from './hooks/usePokemonList';

function App() {
  const { pokemons, favorites, toogleFavs } = usePokemonList();
  const [showFavs, setShowFavs] = useState(false);


  const filtered = pokemons.filter(p => {
    const matchFavs = showFavs ? favorites.includes(p.id) : true;

    return matchFavs;
  })

  return (
    <>
      <h1>App Pokemones</h1>
      <div>
        <button onClick={() => setShowFavs(!showFavs)} >{showFavs ? 'Ver todos' : 'Ver favoritos'}</button>
        <div className={styles.grid}>
          {
            filtered.map((p: Pokemon) => (
              <div className={styles.card} key={p.id}>
                <img src={p.image} alt={p.name} width='80' />
                <h2>{p.name}</h2>
                <button className={styles[favorites.includes(p.id) ? 'fav' : '']}
                  onClick={(e) => { e.stopPropagation(); toogleFavs(p.id) }}>
                  ⭐ Agrega Favorito
                </button>
              </div>
            ))
          }
        </div>
      </div>

    </>
  )
}

export default App
