import { useState } from 'react';
import type { Pokemon } from './types/pokemon';
import styles from './App.module.css';

import { usePokemonList } from './hooks/usePokemonList';
import { PokemonRow } from './components/PokemonRow';

function App() {
  const { pokemons, favorites, toogleFavs, loadMore, types, fetchPokemonsByType } = usePokemonList();
  const [showFavs, setShowFavs] = useState(false);
  const [search, setSearch] = useState('');
  const [typeUrl, setTypeUrl] = useState('');

  const filtered = pokemons.filter(p => {
    const matchFavs = showFavs ? favorites.includes(p.id) : true;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchFavs && matchSearch;
  });

  return (
    <div className={styles.container}>
      <h1>App Pokemones</h1>
      
      <div className={styles.controls}>
        <button onClick={() => setShowFavs(!showFavs)}>
          {showFavs ? 'Ver todos' : 'Ver favoritos'}
        </button>

        <input 
          type="text" 
          placeholder="Buscar por nombre..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.input}
        />

        <select 
          value={typeUrl} 
          onChange={(e) => {
            setTypeUrl(e.target.value);
            fetchPokemonsByType(e.target.value);
          }} 
          className={styles.select}
        >
          <option value="">Todos los tipos</option>
          {types.map(t => (
            <option key={t.name} value={t.url}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Sprite</th>
            <th>Nombre</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p: Pokemon) => (
            <PokemonRow 
              key={p.id} 
              pokemon={p} 
              isFavorite={favorites.includes(p.id)}
              onToggleFavorite={toogleFavs}
            />
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p className={styles.textCenter}>No se encontraron resultados.</p>
      )}

      {!typeUrl && !showFavs && (
        <div className={styles.textCenter}>
          <button onClick={loadMore} className={styles.loadMoreBtn}>
            Cargar más
          </button>
        </div>
      )}
    </div>
  )
}

export default App
