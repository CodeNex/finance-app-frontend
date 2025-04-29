import { Component, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-burger-button',
  imports: [],
  templateUrl: './burger-button.component.html',
  styleUrl: './burger-button.component.scss'
})
export class BurgerButtonComponent {

  @Input() width: string = '40px';
  @Input() height: string = '40px';
  @Input() color: string = '#ffffff';

  @Output() IsBurgerOpen: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isBurgerOpened: boolean = false;

  public toggleBurgerButton(): void {
    this.isBurgerOpened = !this.isBurgerOpened;
    this.IsBurgerOpen.emit(this.isBurgerOpened);
  }

  
}
