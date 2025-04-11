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

  @Output() readonly changeWindow = new EventEmitter<string>();

  @Output() readonly switchToImprintComponent = new EventEmitter<string>();

  @ViewChild('loginPasswordInput', { static: false })
  loginPasswordInputRef!: ElementRef<HTMLInputElement>;

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
    this.loginPasswordInputRef.nativeElement.type =
      this.loginPasswordInputRef.nativeElement.type === 'password'
        ? 'text'
        : 'password';
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
