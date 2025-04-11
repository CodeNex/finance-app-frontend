import {
  Component,
  EventEmitter,
  Output,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
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

/**
 * LoginFormComponent
 * This component is responsible for the login form of the application.
 * It contains the login and guest login functionality.
 * It uses the AuthenticationService to manage the authentication state.
 * It also handles the logic for switching between the login and guest login.
 * It uses the BasedataService to get the guest login data.
 */
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
  // #region Component Setup (DI, Outputs, Template Refs)
  private authService = inject(AuthenticationService);
  private formBuilder = inject(FormBuilder);
  private baseData = inject(BasedataService);

  @Output() readonly changeWindow = new EventEmitter<string>();

  @Output() readonly switchToImprintComponent = new EventEmitter<string>();

  @ViewChild('loginPasswordInput', { static: false })
  loginPasswordInputRef!: ElementRef<HTMLInputElement>;
  // #endregion

  // #region Form
  public loginBody = this.formBuilder.group({
    email: [
      '',
      { validators: [Validators.required, Validators.email], updateOn: 'blur' },
    ],
    password: ['', { validators: [Validators.required], updateOn: 'blur' }],
  });
  // #endregion

  // #region Login
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
    let body = this.baseData.guestLoginData;
    this.authService.doAuthenticationRequest('guest', body);
  }
  // #endregion

  // #region Password Visibility
  public isPasswordVisible: boolean = false;

  changePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.loginPasswordInputRef.nativeElement.type =
      this.loginPasswordInputRef.nativeElement.type === 'password'
        ? 'text'
        : 'password';
  }
  // #endregion

  // #region Keep Logged In
  public isKeepLoggedIn: boolean = false;

  toggleKeepLoggedIn() {
    this.isKeepLoggedIn = !this.isKeepLoggedIn;
  }

  checkIfKeepLoggedIn() {
    if (this.isKeepLoggedIn) this.authService.tokenToLocalStorage = true;
  }
  // #endregion
}
