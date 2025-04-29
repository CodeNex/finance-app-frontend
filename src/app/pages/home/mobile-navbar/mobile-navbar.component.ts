import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '@components/icons/icons.component';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';

@Component({
  selector: 'app-mobile-navbar',
  imports: [RouterModule, IconsComponent, CommonModule],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.scss'
})
export class MobileNavbarComponent {
  public authService = inject(AuthenticationService);
  private baseData = inject(BasedataService);

  public navData = this.baseData.navdata;

}
