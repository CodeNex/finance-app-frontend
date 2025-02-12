import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
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

 isCreatePasswordVisible: boolean = false;

 isConfirmPasswordVisible: boolean = false;

 isFormValid: boolean = false;

  public signUpBody = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  })
  

  doRegistration() {
    console.log("SignUp-Body: ", this.signUpBody.value);
    
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
