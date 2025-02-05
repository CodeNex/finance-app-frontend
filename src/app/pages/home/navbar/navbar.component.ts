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
    let navBarRef = document.getElementById('navBar');
    let slideButtonRef = document.getElementById('slideButton');
    if (!this.isNavbarThin) {
      this.makeNavbarThin(navLinkNames, navBarRef, slideButtonRef);
    } else {
      this.makeNavbarWide(navLinkNames, navBarRef, slideButtonRef);
    }
    this.isNavbarThin = !this.isNavbarThin;
    console.log('isNavbarThin', this.isNavbarThin);
  }

  makeNavbarThin(navLinkNames: Array<any>, navBarRef: HTMLElement | null, slideButtonRef: HTMLElement | null) {
    if (slideButtonRef) slideButtonRef.classList.add("slideButtonReturn");
    navLinkNames.forEach((navLinkName) =>
      navLinkName.classList.add('opacity_zero')
    );
    if (navBarRef) {
      navBarRef.classList.add('navbar-thin');
      navBarRef.style.paddingRight = '8px';
    }
    setTimeout(() => {
      navLinkNames.forEach((link) => link.classList.add('d_none'));
    }, 300);
  }

  makeNavbarWide(navLinkNames: Array<any>, navBarRef: HTMLElement | null, slideButtonRef: HTMLElement | null) {
    navLinkNames.forEach((link) => link.classList.remove('d_none'));
    setTimeout(() => {
      if (slideButtonRef) slideButtonRef.classList.remove("slideButtonReturn");
      navLinkNames.forEach((link) => link.classList.remove('opacity_zero'));
      if (navBarRef) {
        navBarRef?.classList.remove('navbar-thin');
        navBarRef.style.paddingRight = '24px';
      }
    }, 10);
  }
}
