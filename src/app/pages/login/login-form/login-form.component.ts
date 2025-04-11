import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IconsComponent } from '@components/icons/icons.component';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';

@Component({
  selector: 'app-login-form',
  imports: [
    FormsModule,
    RouterModule,
    NgClass,
    ReactiveFormsModule,
    IconsComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  private authService = inject(AuthenticationService);
  private formBuilder = inject(FormBuilder);
  private baseData = inject(BasedataService);

  @Output() public changeWindow = new EventEmitter<string>();

  emitChangeWindow(windowName: string) {
    this.changeWindow.emit(windowName);
  }

  @Output() public switchToImprintComponent = new EventEmitter<string>();

  showImprint() {
    this.switchToImprintComponent.emit('loginForm');
  }

  /**
   * Login Form
   */
  public loginBody = this.formBuilder.group({
    email: [
      '',
      { validators: [Validators.required, Validators.email], updateOn: 'blur' },
    ],
    password: ['', { validators: [Validators.required], updateOn: 'blur' }],
  });

  /**
   * Login Functions
   */
  async doLogin() {
    if (this.loginBody.valid) {
      this.checkIfKeepLoggedIn();
      this.authService.doAuthenticationRequest('login', this.loginBody.value);
    } else {
      this.loginBody.markAllAsTouched();
      Object.values(this.loginBody.controls).forEach((control) =>
        control.updateValueAndValidity()
      );
    }
  }

  async doGuestLogin() {
    let body = this.baseData.financeApp.basics.apiData.guestLogin;
    this.authService.doAuthenticationRequest('guest', body);
  }

  /**
   * toggle password visibility
   */
  public isPasswordVisible: boolean = false;

  changePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    let passwordInputRef = document.getElementById(
      'loginPasswordInput'
    ) as HTMLInputElement;
    passwordInputRef.type =
      passwordInputRef.type === 'password' ? 'text' : 'password';
  }

  /**
   * check keep logged in state
   */
  public isKeepLoggedIn: boolean = false;

  toggleKeepLoggedIn() {
    this.isKeepLoggedIn = !this.isKeepLoggedIn;
  }

  checkIfKeepLoggedIn() {
    if (this.isKeepLoggedIn) this.authService.tokenToLocalStorage = true;
  }
}
