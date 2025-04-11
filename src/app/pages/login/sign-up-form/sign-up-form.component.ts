import {
  Component,
  EventEmitter,
  Output,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
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

@Component({
  selector: 'app-sign-up-form',
  imports: [
    FormsModule,
    RouterModule,
    NgClass,
    ReactiveFormsModule,
    IconsComponent,
  ],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
})
export class SignUpFormComponent {
  @Output() changeWindow = new EventEmitter();

  @Output() public switchToImprintComponent = new EventEmitter<string>();

  private AuthenticationService = inject(AuthenticationService);

  private formBuilder = inject(FormBuilder);

  public isPrivacyPolicyAccepted: boolean = false;

  public isPrivacyPolicyValidationMessageVisible: boolean = false;

  

  isFormValid: boolean = false;

  /**
   * Signup Form
   */
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

  async doRegistration() {
    if (this.signUpBody.valid && this.isPrivacyPolicyAccepted) {
      this.AuthenticationService.doAuthenticationRequest(
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

  /**
   * Form Validation Functions
   */
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

  toggleAcceptPrivacyPolicy() {
    if (!this.isPrivacyPolicyAccepted) {
      this.isPrivacyPolicyAccepted = true;
      this.isPrivacyPolicyValidationMessageVisible = false;
    } else {
      this.isPrivacyPolicyAccepted = false;
    }
  }

  /**
   * Emits an event to change the window between login and register components
   */
  emitChangeWindow(windowName: string) {
    this.changeWindow.emit(windowName);
  }

  /**
   * toggle password visibility
   */
  // Used in template to toggle input field visibility (e.g. via [ngClass] or [ngStyle])
  public isCreatePasswordVisible: boolean = false;
  public isConfirmPasswordVisible: boolean = false;

  changePasswordVisibility(type: string) {
    type === 'create'
      ? (this.isCreatePasswordVisible = !this.isCreatePasswordVisible)
      : (this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible);
    let passwordInputRef = document.getElementById(
      type === 'create'
        ? 'singupCreatePasswordInput'
        : 'singupConfirmPasswordInput'
    ) as HTMLInputElement;
    passwordInputRef.type =
      passwordInputRef.type === 'password' ? 'text' : 'password';
  }
}
