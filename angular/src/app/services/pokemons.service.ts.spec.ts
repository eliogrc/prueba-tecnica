import { TestBed } from '@angular/core/testing';

import { PokemonsServiceTs } from './pokemons.service.ts';

describe('PokemonsServiceTs', () => {
  let service: PokemonsServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonsServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
