import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-loading-screen',
  imports: [],
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.scss'
})
export class LoadingScreenComponent {
  @Output() changeWindow = new EventEmitter();
  
    emitChangeWindow(windowName: string) {
      this.changeWindow.emit(windowName);
    }

}
