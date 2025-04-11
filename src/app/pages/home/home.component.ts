import { Component, inject } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from '@content/content.component';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MainModalComponent } from './main-modal/main-modal.component';

import { AuthenticationService } from '@services/authentication.service';
import { MainModalService } from '@services/main-modal.service';

/**
 * * HomeComponent
 * This component is responsible for the home page of the application.
 * It contains the navbar and the main content area.
 * It also handles the logic for checking if the user is authenticated and managing the visibility * of the main modal.
 */
@Component({
  selector: 'app-home',
  imports: [
    NavbarComponent,
    RouterModule,
    ContentComponent,
    MainModalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  public mainModalService = inject(MainModalService);

  public subscription = new Subscription();
  // #endregion

  // #region Lifecyle Hooks'
  ngOnInit() {
    this.checkIfAuthTokenExists();
    this.subscribeMainModalVisibility();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  // #endregion

  // #region subscription & modal visibility
  public isMainModalVisible: boolean =
    this.mainModalService.isMainModalVisible$.value;

  subscribeMainModalVisibility() {
    this.subscription.add(this.mainModalService.isMainModalVisible$.subscribe(
      (value) => (this.isMainModalVisible = value)
    ))    
  }
  // #endregion

  /**
   * checks if the authToken exists, if not, redirects to the login page
   */
  checkIfAuthTokenExists() {
    if (!this.authService.authToken) {
      this.router.navigate(['']);
    }
  }
}
