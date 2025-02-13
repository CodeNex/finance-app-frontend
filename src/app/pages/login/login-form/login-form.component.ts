import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';

import { IconsComponent } from '../../../components/icons/icons.component';

import { AuthentificationService } from '../../../services/authentification.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, ReactiveFormsModule, IconsComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {

  @Output() changeWindow = new EventEmitter();

  private authentificationService: AuthentificationService = inject(AuthentificationService);

  private formBuilder: FormBuilder = inject(FormBuilder);

  isPasswordVisible: boolean = false;

  isFormValid: boolean = false;

  public loginBody = this.formBuilder.group({
    email: ['', Validators.required, Validators.email],
    password: ['']
  }) 

  /**
   * Logs in as a registered user
   */
  async doLogin() {
    console.log("Login-Body: ", this.loginBody.value);
    
    // do validation of input fields
    // set isFormValid to true
    // build body object
    //fire authentification function
  }

  /**
   * Logs in as a guest user
   */
  async doGuestLogin() {
    let body = {
      'email': 'test@example.com',
      'password': 'password',

      // 'email': 'guest@guest.com',
      // 'password': 'password'
    }
    await this.authentificationService.doAuthentificationRequest('guest', body);
  }

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
}
