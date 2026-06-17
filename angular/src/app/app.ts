import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { PokemonsServiceTs } from './services/pokemons.service.ts';
import { FormControl } from '@angular/forms';
import { Pokemon } from './models/pokemon.model.js';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  svcPokemon = inject(PokemonsServiceTs);

  searchInput = signal<string>('');
  comparePokemons = signal<Pokemon[]>([]);


  ngOnInit(): void {
    this.svcPokemon.getPokemons();
  }

  public filteredPokemons =  computed(() => {
    const term = this.searchInput().toLowerCase().trim();

    if (!term) return this.svcPokemon.list()

    return this.svcPokemon.list().filter(p => p.name.toLowerCase().trim().includes(term))
  })
  

  onSearch(value: Event): void {
    const searchTerm = value.target as HTMLInputElement;

    this.searchInput.set(searchTerm.value);
  }


  addCompare(pokemon: Pokemon): void {
    this.comparePokemons.update(currentsItems => [...currentsItems, pokemon]);
    console.log(pokemon);
  }

}
