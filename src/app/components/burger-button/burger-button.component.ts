import { CommonModule } from '@angular/common';
import { Component, Output, Input, EventEmitter, inject, computed } from '@angular/core';

import { BurgerButtonService } from './burger-button.service';

@Component({
  selector: 'app-burger-button',
  imports: [CommonModule],
  templateUrl: './burger-button.component.html',
  styleUrl: './burger-button.component.scss'
})
export class BurgerButtonComponent {
  private burgerButtonService = inject(BurgerButtonService);

  @Input() width: string = '40px';
  @Input() height: string = '40px';
  @Input() color: string = '#ffffff';

  @Output() IsBurgerOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isBurgerOpened = computed(() => this.burgerButtonService.isOpen());

  public toggleBurgerButton(): void {
    this.burgerButtonService.toggle();
    this.IsBurgerOpen.emit(this.isBurgerOpened());
  }  
}
