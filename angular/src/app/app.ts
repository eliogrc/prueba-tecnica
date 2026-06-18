import { Component, signal, inject, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { PokemonsServiceTs } from './services/pokemons.service.ts';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PokemonModalComponent } from './components/pokemon-modal/pokemon-modal.component';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, PokemonModalComponent, UpperCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  svcPokemon = inject(PokemonsServiceTs);

  searchControl = new FormControl('');
  searchResult = signal<any | null>(null);
  isLoading = signal<boolean>(false);
  searchError = signal<string | null>(null);
  comparePokemons = signal<any[]>([]);
  selectedPokemon = signal<any | null>(null);

  ngOnInit(): void {
    this.svcPokemon.getPokemons();

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(term => {
          if (!term?.trim()) {
            this.searchResult.set(null);
            this.searchError.set(null);
          } else {
            this.isLoading.set(true);
            this.searchError.set(null);
            this.searchResult.set(null);
          }
        }),
        filter(term => !!term?.trim()),
        switchMap(term => 
          this.svcPokemon.searchPokemon(term!).pipe(
            catchError(err => {
              this.searchError.set('Pokémon no encontrado');
              this.isLoading.set(false);
              return of(null);
            })
          )
        )
      )
      .subscribe(result => {
        if (result) {
          this.searchResult.set(result);
        }
        this.isLoading.set(false);
      });
  }

  public filteredPokemons = computed(() => {
    const term = this.searchControl.value?.toLowerCase().trim();
    if (!term) return this.svcPokemon.list();
    return this.svcPokemon.list().filter(p => p.name.toLowerCase().trim().includes(term));
  });

  addCompare(pokemon: any): void {
    if (this.comparePokemons().length >= 2) {
      alert('Solo puedes comparar 2 Pokémon a la vez.');
      return;
    }

    if (this.comparePokemons().find(p => p.id === pokemon.id)) return;
    
    this.comparePokemons.update(currentsItems => [...currentsItems, pokemon]);
  }

  removeCompare(pokemonId: number): void {
    this.comparePokemons.update(currentsItems => currentsItems.filter(p => p.id !== pokemonId));
  }

  getStatWinner = computed(() => {
    const pokes = this.comparePokemons();
    if (pokes.length !== 2) return null;

    const [p1, p2] = pokes;
  
    const getStat = (p: any, statName: string) => 
      p.stats?.find((s: any) => s.stat.name === statName)?.base_stat || 0;

    return {
      hp: getStat(p1, 'hp') > getStat(p2, 'hp') ? p1.id : getStat(p2, 'hp') > getStat(p1, 'hp') ? p2.id : 0,
      attack: getStat(p1, 'attack') > getStat(p2, 'attack') ? p1.id : getStat(p2, 'attack') > getStat(p1, 'attack') ? p2.id : 0,
      defense: getStat(p1, 'defense') > getStat(p2, 'defense') ? p1.id : getStat(p2, 'defense') > getStat(p1, 'defense') ? p2.id : 0,
      speed: getStat(p1, 'speed') > getStat(p2, 'speed') ? p1.id : getStat(p2, 'speed') > getStat(p1, 'speed') ? p2.id : 0,
    };
  });

  async openModal(pokemonIdentifier: string | number) {
    this.isLoading.set(true);
    try {
      const fullDetail = await this.svcPokemon.fetchPokesDetail(pokemonIdentifier as number);
      this.selectedPokemon.set(fullDetail);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }

  closeModal() {
    this.selectedPokemon.set(null);
  }
}
