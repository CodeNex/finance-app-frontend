import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import jsonData from '../../../shared/data/financeapp.basedata.json';
import { IconsComponent } from '../../../components/icons/icons.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, IconsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public readonly navData = jsonData.financeapp.navbar.links;

  isNavbarThin: boolean = false;

  toggleMovingNavbar() {
    let navLinkNames = Array.from(
      document.querySelectorAll('[data-group="navLinkName"]')
    );
    if (!this.isNavbarThin) {
      this.makeNavbarThin(navLinkNames);
    } else {
      this.makeNavbarWide(navLinkNames);
    }
    this.isNavbarThin = !this.isNavbarThin;
    console.log('isNavbarThin', this.isNavbarThin);
  }

  makeNavbarThin(navLinkNames: Array<any>) {
    navLinkNames.forEach((navLinkName) =>
      navLinkName.classList.add('opacity_zero')
    );
  }

  makeNavbarWide(navLinkNames: Array<any>) {
    navLinkNames.forEach((navLinkName) =>
      navLinkName.classList.remove('opacity_zero')
    );
  }
}
