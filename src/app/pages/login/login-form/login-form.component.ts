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

  @Output() changeWindow = new EventEmitter();

  private authentificationService: AuthentificationService = inject(AuthentificationService);

  isPasswordVisible: boolean = false;

  isFormValid: boolean = false;

  /**
   * Emits an event to change the window between login and register components
   */
  emitChangeWindow(windowName: string) {
    this.changeWindow.emit(windowName);
  }

  /**
   * Toggles the visibility of the password input field
   */
  changePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    let passwordInputRef = document.getElementById(
      'loginPasswordInput'
    ) as HTMLInputElement;
    passwordInputRef.type =
      passwordInputRef.type === 'password' ? 'text' : 'password';
  }

  /**
   * Logs in as a guest user
   */
  async doGuestLogin() {
    let body = {
      'email': 'guest@guest.com',
      'password': 'password'
    }
    await this.authentificationService.doAuthentificationRequest('guest', body);
  }

  /**
   * Logs in as a registered user
   */
  async doLogin() {
    // do validation of input fields
    // set isFormValid to true
    // build body object
    //fire authentification function
  }
}
