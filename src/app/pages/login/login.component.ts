import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { WarningScreenComponent } from './warning-screen/warning-screen.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LoginFormComponent, SignUpFormComponent, LoadingScreenComponent, WarningScreenComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  currentShownLoginWindow: string = "loginForm"
  // loginForm, signUpForm

  chooseLoginWindow(windowName: string) {
    this.currentShownLoginWindow = windowName;
    console.log(windowName);
    
  }
}
