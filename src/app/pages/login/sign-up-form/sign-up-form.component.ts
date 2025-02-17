import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormsModule,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IconsComponent } from '../../../components/icons/icons.component';

import { AuthentificationService } from '../../../services/authentification.service';

@Component({
  selector: 'app-sign-up-form',
  imports: [FormsModule, RouterModule, NgClass, ReactiveFormsModule, IconsComponent],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
})
export class SignUpFormComponent {
  @Output() changeWindow = new EventEmitter();

  @Output() public switchToImprintComponent: EventEmitter<string> = new EventEmitter<string>();

  private authentificationService: AuthentificationService = inject(
    AuthentificationService
  );

  private formBuilder: FormBuilder = inject(FormBuilder);

  public isPrivacyPolicyAccepted: boolean = false;

  public isPrivacyPolicyValidationMessageVisible: boolean = false;

  isCreatePasswordVisible: boolean = false;

  isConfirmPasswordVisible: boolean = false;

  isFormValid: boolean = false;

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

  doRegistration() {
    if (this.signUpBody.valid && this.isPrivacyPolicyAccepted) {
      console.log('SignUpBody is valid:', this.signUpBody.valid);
      console.log('SignUp-Body: ', this.signUpBody.value);
    } else {
      this.isPrivacyPolicyValidationMessageVisible = true;
      this.signUpBody.markAllAsTouched();
      Object.values(this.signUpBody.controls).forEach((control) =>
        control.updateValueAndValidity()
      );
      console.log('SignUpBody is valid:', this.signUpBody.valid);
    }
  }

  goToImprintComponent() {
    this.switchToImprintComponent.emit('loginForm');
  }

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
    }
    else {
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
   * Toggles the visibility of the password input field
   */
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
