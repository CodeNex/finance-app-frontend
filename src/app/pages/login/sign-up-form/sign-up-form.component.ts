import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up-form',
  imports: [FormsModule],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss'
})
export class SignUpFormComponent {
  @Output() changeWindow = new EventEmitter();
  
    emitChangeWindow(windowName: string) {
      this.changeWindow.emit(windowName);
    }

}
