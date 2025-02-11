import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconsComponent } from '../../../components/icons/icons.component';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-sign-up-form',
  imports: [FormsModule, IconsComponent],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
})
export class SignUpFormComponent {

  private loginService: LoginService = inject(LoginService);

  /**
   * Emits an event to change the window between login and register components
   */
  @Output() changeWindow = new EventEmitter();

  emitChangeWindow(windowName: string) {
    this.changeWindow.emit(windowName);
  }

  /**
   * Toggles the visibility of the password input field
   */
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

  isFormValid: boolean = false;
}
