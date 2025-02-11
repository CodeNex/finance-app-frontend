import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { LoadingScreenComponent } from '../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../components/warning-screen/warning-screen.component';
import { AuthentificationService } from '../../services/authentification.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    LoginFormComponent,
    SignUpFormComponent,
    LoadingScreenComponent,
    WarningScreenComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public authService: AuthentificationService = inject(AuthentificationService);

  currentShownLoginWindow: string = 'loginForm';
  // loginForm, signUpForm

  public isLoadingScreenVisible: boolean = false;

  public isWarningScreenVisible: boolean = false;

  ngOnInit() {
    this.authService.isloadingScreenVisible$.subscribe((value) => {
      this.isLoadingScreenVisible = value;
    });
    this.authService.isWarningScreenVisible$.subscribe((value) => {
      this.isWarningScreenVisible = value;
    });
  }

  /**
   *
   * @param windowName function to switch between login and sign up forms
   */
  chooseLoginWindow(windowName: string) {
    this.currentShownLoginWindow = windowName;
  }
}
