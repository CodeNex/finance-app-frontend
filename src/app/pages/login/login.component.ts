import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginFormComponent } from './login-form/login-form.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { LoadingScreenComponent } from '../../components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '../../components/warning-screen/warning-screen.component';
import { ImprintComponent } from '../imprint/imprint.component';

import { AuthenticationService } from '../../services/Authentication.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    LoginFormComponent,
    SignUpFormComponent,
    LoadingScreenComponent,
    WarningScreenComponent,
    ImprintComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public authService: AuthenticationService = inject(AuthenticationService);

  public currentShownLoginWindow: string = 'loginForm';
  // loginForm, signUpForm

  public isLoadingScreenVisible: boolean = false;

  public isWarningScreenVisible: boolean = false;

  public isImprintComponentVisible: boolean = false;

  /**
   * Subscribes to observables from the AuthService to update the visibility of loading and warning screens.
   * @memberof LoginComponent
   */
  ngOnInit() {
    this.authService.isloadingScreenVisible$.subscribe((value) => {
      this.isLoadingScreenVisible = value;
    });
    this.authService.isWarningScreenVisible$.subscribe((value) => {
      this.isWarningScreenVisible = value;
    });
  }

  /**
   * @param windowName function to switch between login and sign up forms
   */
  chooseLoginWindow(windowName: string) {
    this.currentShownLoginWindow = windowName;
  }

  switchToLogInComponent(currentShownLoginWindow: string) {
    this.currentShownLoginWindow = currentShownLoginWindow;
    this.isImprintComponentVisible = false;
  }

  switchToImprintComponent($event: string) {
    this.isImprintComponentVisible = true;
    this.currentShownLoginWindow = $event;
  }
}
