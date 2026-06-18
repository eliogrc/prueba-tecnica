import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL_API = 'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0';
const BASE_URL_DETAIL = 'https://pokeapi.co/api/v2/pokemon/';

@Injectable({
  providedIn: 'root',
})
export class PokemonsServiceTs {
  private http = inject(HttpClient);
  readonly list = signal<any[]>([]);

  async getPokemons() {
    try {
      const resp = await fetch(BASE_URL_API);
      const respData = await resp.json();

      const parseData = await Promise.all(
        respData.results.map(async (p: any) => {
          const id = p.url.match(/\d+/g)[1];
          const detalle = await this.fetchPokesDetail(id);

          return { ...detalle, image: detalle.sprites.back_default };
        }),
      );
      console.log('Pokemons:', parseData);

      this.list.set(parseData);
    } catch (error) {}
  }

  async fetchPokesDetail(id: string | number) {
    const detailPk = await fetch(`${BASE_URL_DETAIL}${id}`);
    return await detailPk.json();
  }

  searchPokemon(name: string): Observable<any> {
    return this.http.get<any>(`${BASE_URL_DETAIL}${name.toLowerCase()}`);
  }
}
