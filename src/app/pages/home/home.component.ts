import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { MainModalComponent } from './main-modal/main-modal.component';
import { BurgerButtonComponent } from '@src/components/burger-button/burger-button.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from '@content/content.component';
import { MobileNavbarComponent } from './mobile-navbar/mobile-navbar.component';

import { AuthenticationService } from '@services/authentication.service';
import { MainModalService } from '@services/main-modal.service';
import { ScreensizeService } from '@services/screensize.service';

/**
 * * HomeComponent
 * This component is responsible for the home page of the application.
 * It contains the navbar and the main content area.
 * It also handles the logic for checking if the user is authenticated and toggles the visibility * of the main modal.
 */
@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    NavbarComponent,
    RouterModule,
    ContentComponent,
    MainModalComponent,
    BurgerButtonComponent,
    MobileNavbarComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  public mainModalService = inject(MainModalService);
  public screensizeService = inject(ScreensizeService);

  private homeSubscriptions$: Subscription = new Subscription();

  public isMobile: boolean = false;
  
  public isMobileNavbarOpen: boolean = false
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.homeSubscriptions$.add(
      this.screensizeService.isTablet$.subscribe((isTablet) => {
        this.isMobile = isTablet;
      })
    )
    this.checkIfAuthTokenExists();
  }

  ngOnDestroy() {
    this.homeSubscriptions$.unsubscribe();
  }
  // #endregion

  // #region Helper Functions
  checkIfAuthTokenExists() {
    if (!this.authService.authToken) {
      this.router.navigate(['']);
    }
  }

  public toggleMobileNavbar(event: boolean): void {
    this.isMobileNavbarOpen = event;
  }
  // #endregion
}
