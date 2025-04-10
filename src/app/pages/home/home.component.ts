import { Component, Inject, inject } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from '@content/content.component';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MainModalComponent } from './main-modal/main-modal.component';

import { AuthenticationService } from '../../services/authentication.service';
import { MainModalService } from '../../services/main-modal.service';

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
  private authService: AuthenticationService = inject(AuthenticationService);
  private router: Router = inject(Router);
  public mainModalService: MainModalService = inject(MainModalService);

  public isMainModalVisible: boolean =
    this.mainModalService.isMainModalVisible$.value;
  public mainModalSubscription!: Subscription;

  // NG ON INIT
  ngOnInit() {
    this.checkIfAuthTokenExists();
    this.subscribeMainModalVisibility();
  }

  // checks if the authToken exists, if not, redirects to the login page
  checkIfAuthTokenExists() {
    if (!this.authService.authToken) {
      this.router.navigate(['']);
    }
  }

  // gets the value of isMainModalVisible from the mainModalService
  subscribeMainModalVisibility() {
    this.mainModalSubscription =
      this.mainModalService.isMainModalVisible$.subscribe(
        (value) => (this.isMainModalVisible = value)
      );
  }

  // NG ON DESTROY
  ngOnDestroy() {
    this.unsubscribeMainModalVisibility();
  }

  // unsubscribes from the mainModalService
  unsubscribeMainModalVisibility() {
    this.mainModalSubscription.unsubscribe();
  }
}
