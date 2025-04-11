import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoginFormComponent } from '@login/login-form/login-form.component';
import { SignUpFormComponent } from '@login/sign-up-form/sign-up-form.component';
import { LoadingScreenComponent } from '@components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '@components/warning-screen/warning-screen.component';
import { ImprintComponent } from '@imprint/imprint.component';

import { AuthenticationService } from '@services/authentication.service';

/**
 * * Login Component
 * This component is responsible for the login page of the application.
 * It contains the login and sign-up forms, as well as the loading and warning screens.
 * It also handles the logic for switching between the different forms and screens.
 * It uses the AuthenticationService to manage the authentication state and loading/warning screens.
 */
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
export class LoginComponent implements OnInit, OnDestroy {
  // #region Dependency Injection & Subscriptions
  public authService = inject(AuthenticationService);

  private subscriptions = new Subscription();
  // #endregion

  // #region Lifecycle
  ngOnInit(): void {
    this.addSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  // #endregion

  // #region Subscribe & warning screens
  public isLoadingScreenVisible: boolean = false;
  public isWarningScreenVisible: boolean = false;

  private addSubscriptions() {
    this.subscriptions.add(
      this.authService.isloadingScreenVisible$.subscribe((value) => {
        this.isLoadingScreenVisible = value;
      })
    );
    this.subscriptions.add(
      this.authService.isWarningScreenVisible$.subscribe((value) => {
        this.isWarningScreenVisible = value;
      })
    );
  }
  // #endregion

  // #region Choose Forms
  public isImprintComponentVisible: boolean = false;
  public activeForm: string = 'loginForm'; // possible values: loginForm, signUpForm

  chooseLoginWindow(windowName: string) {
    this.activeForm = windowName;
  }

  switchToLogInComponent(activeForm: string) {
    this.isImprintComponentVisible = false;
    this.activeForm = activeForm;
  }

  switchToImprintComponent(windowName: string) {
    this.isImprintComponentVisible = true;
    this.activeForm = windowName;
  }
  // #endregion
}
