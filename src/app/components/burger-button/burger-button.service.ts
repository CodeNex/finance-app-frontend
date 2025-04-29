import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BurgerButtonService {

  public isOpen: WritableSignal<boolean> = signal(false);

  public toggle(): void {
    this.isOpen.set(!this.isOpen());
  }
}
