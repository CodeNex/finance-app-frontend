import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-warning-screen',
  imports: [],
  templateUrl: './warning-screen.component.html',
  styleUrl: './warning-screen.component.scss',
})
export class WarningScreenComponent {
  @Output() changeWindow = new EventEmitter();

  emitChangeWindow(windowName: string) {
    this.changeWindow.emit(windowName);
  }
}
