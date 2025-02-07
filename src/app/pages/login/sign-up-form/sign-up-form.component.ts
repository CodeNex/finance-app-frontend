import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconsComponent } from '../../../components/icons/icons.component';

@Component({
  selector: 'app-sign-up-form',
  imports: [FormsModule, IconsComponent],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
})
export class SignUpFormComponent {
  @Output() changeWindow = new EventEmitter();

  emitChangeWindow(windowName: string) {
    this.changeWindow.emit(windowName);
  }

  isCreatePasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;

  changePasswordVisibility(type: string) {
    type === 'create' ? this.isCreatePasswordVisible = !this.isCreatePasswordVisible : this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    let passwordInputRef = document.getElementById(
      type === 'create' ? 'singupCreatePasswordInput' : 'singupConfirmPasswordInput'
    ) as HTMLInputElement;
    passwordInputRef.type =
        passwordInputRef.type === 'password' ? 'text' : 'password';
  }
}
