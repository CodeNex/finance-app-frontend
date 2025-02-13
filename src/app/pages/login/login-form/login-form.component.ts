import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgClass } from '@angular/common';

import { IconsComponent } from '../../../components/icons/icons.component';

import { AuthentificationService } from '../../../services/authentification.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, NgClass, ReactiveFormsModule, IconsComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @Output() changeWindow = new EventEmitter();

  private authentificationService: AuthentificationService = inject(
    AuthentificationService
  );

  private formBuilder: FormBuilder = inject(FormBuilder);

  isPasswordVisible: boolean = false;

  isFormValid: boolean = false;

  public loginBody = this.formBuilder.group({
    email: [
      '',
      { validators: [Validators.required, Validators.email], updateOn: 'blur' },
    ],
    password: [
      '',
      {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'blur',
      },
    ],
  });

  /**
   * Logs in as a registered user
   */
  async doLogin() {
    if (this.loginBody.valid) {
      console.log('Login-Body is valid: ', this.loginBody.valid);
      console.log('Login-Body: ', this.loginBody.value);
    } else {
      this.loginBody.markAllAsTouched();
      Object.values(this.loginBody.controls).forEach((control) =>
        control.updateValueAndValidity()
      );
      console.log('Login-Body is valid: ', this.loginBody.valid);
    }

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
      email: 'test@example.com',
      password: 'password',

      // 'email': 'guest@guest.com',
      // 'password': 'password'
    };
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
