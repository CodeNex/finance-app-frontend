import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { IconsComponent } from '../../../components/icons/icons.component';

import { AuthentificationService } from '../../../services/authentification.service';

@Component({
  selector: 'app-sign-up-form',
  imports: [FormsModule, ReactiveFormsModule, IconsComponent],
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
    name: ['', Validators.required, {updateOn: 'blur'}],
    email: ['', Validators.required, Validators.email, {updateOn: 'blur'}],
    password: ['', Validators.required, {updateOn: 'blur'}],
    confirmPassword: ['', Validators.required, {updateOn: 'blur'}]
  })
  

  doRegistration() {
    this.comparePasswords();
    console.log("SignUp-Body: ", this.signUpBody);
    console.log("Are passwords identical: ", this.arePasswordsIdentical);  
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
