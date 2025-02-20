import { Component, Inject, inject } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';
import { RouterModule, Router } from '@angular/router';

import { MainModalComponent } from './main-modal/main-modal.component';

import { AuthenticationService } from '../../services/authentication.service';
import { MainModalService } from '../../services/main-modal.service';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, RouterModule, ContentComponent, MainModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private authService: AuthenticationService = inject(AuthenticationService);
  private router: Router = inject(Router);
  private mainModalService: MainModalService = inject(MainModalService);

  public isMainModalVisible: boolean = this.mainModalService.isMainModalVisible;

  ngOnInit() {
    this.checkIfAuthTokenExists();
  }

  checkIfAuthTokenExists() {
    if (!this.authService.authToken) {
      this.router.navigate(['']);
    }
  }
}
