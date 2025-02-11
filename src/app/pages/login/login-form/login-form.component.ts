import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from '../../../components/icons/icons.component';
import { AuthentificationService } from '../../../services/authentification.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, IconsComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {

  private authentificationService: AuthentificationService = inject(AuthentificationService);

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
  isPasswordVisible: boolean = false;

  changePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    let passwordInputRef = document.getElementById(
      'loginPasswordInput'
    ) as HTMLInputElement;
    passwordInputRef.type =
      passwordInputRef.type === 'password' ? 'text' : 'password';
  }

  isFormValid: boolean = false;

  doGuestLogin() {

  }
}
