import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-pokemon-modal',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './pokemon-modal.component.html',
  styleUrl: './pokemon-modal.component.css'
})

export class PokemonModalComponent implements AfterViewInit {
  @Input() pokemon: any;
  @Output() closed = new EventEmitter<void>();
  
  @ViewChild('modalContainer') modalContainer!: ElementRef;
  
  private destroyRef = inject(DestroyRef);

  ngAfterViewInit() {
    this.modalContainer.nativeElement.focus();
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event.key === 'Escape') {
          this.close();
        }
      });
  }

  close() {
    this.closed.emit();
  }
}