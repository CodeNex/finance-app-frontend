import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { IconsComponent } from '../../../components/icons/icons.component';

import { AuthentificationService } from '../../../services/authentification.service';

@Component({
  selector: 'app-sign-up-form',
  imports: [FormsModule, NgClass, ReactiveFormsModule, IconsComponent],
  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.scss',
})
export class SignUpFormComponent {

  @Output() changeWindow = new EventEmitter();

 private authentificationService: AuthentificationService = inject(AuthentificationService);

 private formBuilder: FormBuilder = inject(FormBuilder);

 isCreatePasswordVisible: boolean = false;

 isConfirmPasswordVisible: boolean = false;

 isFormValid: boolean = false;

 arePasswordsIdentical: boolean = false;

  public signUpBody = this.formBuilder.group({
    name: ['', {validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur'}],
    email: ['', {validators: [Validators.required, Validators.email], updateOn: 'blur'}],
    password: ['', {validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur'}],
    confirmPassword: ['', {validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur'}]
  })
  
  doRegistration() {
    this.comparePasswords();
    if (this.signUpBody.valid && this.arePasswordsIdentical) {
      console.log("SignUpBody is valid:", this.signUpBody.valid);
      console.log("Are passwords identical: ", this.arePasswordsIdentical); 
      console.log("SignUp-Body: ", this.signUpBody.value);
    }
    else {
      console.log("SignUpBody is valid:", this.signUpBody.valid);
      console.log("Are passwords identical: ", this.arePasswordsIdentical); 
      console.log("SignUp-Body: ", this.signUpBody.value);
    }
  }

  comparePasswords() {
    this.arePasswordsIdentical = this.signUpBody.value.password === this.signUpBody.value.confirmPassword;
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
    type === 'create' ? this.isCreatePasswordVisible = !this.isCreatePasswordVisible : this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
    let passwordInputRef = document.getElementById(
      type === 'create' ? 'singupCreatePasswordInput' : 'singupConfirmPasswordInput'
    ) as HTMLInputElement;
    passwordInputRef.type =
        passwordInputRef.type === 'password' ? 'text' : 'password';
  }

}
