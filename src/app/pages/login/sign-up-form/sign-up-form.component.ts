import {
  Component,
  EventEmitter,
  Output,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IconsComponent } from '@components/icons/icons.component';

import { AuthenticationService } from '@services/authentication.service';

/**
 * * SignUpFormComponent
 * This component is responsible for the sign-up form of the application.
 * It contains the sign-up functionality.
 * It uses the AuthenticationService to manage the authentication state.
 * It also handles the logic for switching between the sign-up and login forms.
 * It uses the BasedataService to get the guest login data.
 */
@Component({
  selector: 'app-sign-up-form',
  imports: [RouterModule, NgClass, ReactiveFormsModule, IconsComponent],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
})
export class SignUpFormComponent {
  // #region Component Setup (DI, Outputs, Template Refs)
  private authService = inject(AuthenticationService);
  private formBuilder = inject(FormBuilder);

  @Output() changeWindow = new EventEmitter<string>();

  @Output() public switchToImprintComponent = new EventEmitter<string>();

  // Note: Set `static: true` if this element is inside an @if and needed in ngOnInit
  @ViewChild('password', { static: false })
  passwordInputRef!: ElementRef<HTMLInputElement>;

  @ViewChild('confirmPassword', { static: false })
  confirmPasswordInputRef!: ElementRef<HTMLInputElement>;
  // #endregion

  // #region Form
  public signUpBody = this.formBuilder.group({
    name: [
      '',
      {
        validators: [Validators.required, this.validateName],
        updateOn: 'blur',
      },
    ],
    email: [
      '',
      { validators: [Validators.required, Validators.email], updateOn: 'blur' },
    ],
    password: [
      '',
      {
        validators: [Validators.required, this.validateStrongPassword],
        updateOn: 'blur',
      },
    ],
    confirmPassword: [
      '',
      {
        validators: [Validators.required, this.validatePasswordMatch],
        updateOn: 'blur',
      },
    ],
  });
  // #endregion

  // #region Registration
  async doRegistration() {
    if (this.signUpBody.valid && this.isPrivacyPolicyAccepted) {
      this.authService.doAuthenticationRequest(
        'register',
        this.signUpBody.value
      );
    } else {
      this.isPrivacyPolicyValidationMessageVisible = true;
      this.signUpBody.markAllAsTouched();
      Object.values(this.signUpBody.controls).forEach((control) =>
        control.updateValueAndValidity()
      );
    }
  }
  // #endregion

  // #region Form Validation
  validateName(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    let words = control.value.split(' ');
    return words.length > 1 ? null : { invalidName: true };
  }

  validateStrongPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!password) return null;
    return regex.test(password) ? null : { weakPassword: true };
  }

  validatePasswordMatch(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return control.value === control.parent?.get('password')?.value
      ? null
      : { passwordDismatch: true };
  }
  // #endregion

  // #region Privacy Policy
  public isPrivacyPolicyAccepted: boolean = false;
  public isPrivacyPolicyValidationMessageVisible: boolean = false;

  toggleAcceptPrivacyPolicy() {
    if (!this.isPrivacyPolicyAccepted) {
      this.isPrivacyPolicyAccepted = true;
      this.isPrivacyPolicyValidationMessageVisible = false;
    } else {
      this.isPrivacyPolicyAccepted = false;
    }
  }
  // #endregion

  // #region Password Visibilities
  // Used in template to toggle input field visibility (e.g. via [ngClass] or [ngStyle])
  public isCreatePasswordVisible: boolean = false;
  public isConfirmPasswordVisible: boolean = false;

  changePasswordVisibility(type: string) {
    type === 'create'
      ? (this.isCreatePasswordVisible = !this.isCreatePasswordVisible)
      : (this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible);

    if (type === 'create') {
      this.passwordInputRef.nativeElement.type =
        this.passwordInputRef.nativeElement.type === 'password'
          ? 'text'
          : 'password';
    } else {
      this.confirmPasswordInputRef.nativeElement.type =
        this.confirmPasswordInputRef.nativeElement.type === 'password'
          ? 'text'
          : 'password';
    }
  }
  // #endregion
}
