import { Component, inject } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';

import { AuthenticationService } from '../../services/authentication.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, RouterModule, ContentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private authService: AuthenticationService = inject(AuthenticationService);

  private router: Router = inject(Router);

  ngOnInit() {
    this.checkIfAuthTokenExists();
  }

  checkIfAuthTokenExists() {
    if (!this.authService.authToken) {
      this.router.navigate(['']);
    }
  }
}
