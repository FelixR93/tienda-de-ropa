// ------------------------------------------------------
// Servicio global de loading.
// Lleva un contador interno de requests en curso.
// - show(): se llama al iniciar una request
// - hide(): se llama al terminar (success o error)
// - loading$ : observable que exponemos al root
// ------------------------------------------------------
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private count = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observable que usaremos en el root component
  loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.count++;
    if (this.count === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    if (this.count > 0) {
      this.count--;
    }

    if (this.count === 0) {
      this.loadingSubject.next(false);
    }
  }

  reset(): void {
    this.count = 0;
    this.loadingSubject.next(false);
  }
}
