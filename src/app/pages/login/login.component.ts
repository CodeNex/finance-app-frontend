import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoginFormComponent } from '@login/login-form/login-form.component';
import { SignUpFormComponent } from '@login/sign-up-form/sign-up-form.component';
import { LoadingScreenComponent } from '@components/loading-screen/loading-screen.component';
import { WarningScreenComponent } from '@components/warning-screen/warning-screen.component';
import { ImprintComponent } from '@imprint/imprint.component';

import { AuthenticationService } from '@services/authentication.service';

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
  public authService = inject(AuthenticationService);

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.addSubscriptions();
  }

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

  switchToImprintComponent($event: string) {
    this.isImprintComponentVisible = true;
    this.activeForm = $event;
  }
  // #endregion

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
