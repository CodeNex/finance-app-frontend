import { CommonModule } from '@angular/common';
import { Component, inject, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '@components/icons/icons.component';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';
import { BurgerButtonService } from '@src/components/burger-button/burger-button.service';

@Component({
  selector: 'app-mobile-navbar',
  imports: [RouterModule, IconsComponent, CommonModule],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent {
  public authService = inject(AuthenticationService);
  private baseData = inject(BasedataService);
  private burgerButtonService = inject(BurgerButtonService);

  public navData = this.baseData.navdata;

  @Output() public IsMobileNavbarOpen = new EventEmitter<boolean>();

  public closeMobileNavbar(): void {
    this.burgerButtonService.toggle();
    this.IsMobileNavbarOpen.emit(this.burgerButtonService.isOpen());
  }
}
