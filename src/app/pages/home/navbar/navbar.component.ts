import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import jsonData from '../../../shared/data/financeapp.basedata.json';
import { IconsComponent } from '../../../components/icons/icons.component';

import { AuthenticationService } from '../../../services/authentication.service';
import { BasedataService } from '../../../services/basedata.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, IconsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {

  public authService: AuthenticationService = inject(AuthenticationService);
  public baseData: BasedataService = inject(BasedataService);

  public navData: any;

  ngOnInit() {
    this.navData = this.baseData.financeApp.navbar.links;
  }

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
  }

  makeNavbarThin(
    navLinkNames: Array<any>,
    navBarRef: HTMLElement | null,
    slideButtonRef: HTMLElement | null
  ) {
    this.makeLogoThin();
    if (slideButtonRef) slideButtonRef.classList.add('slideButtonReturn');
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

  makeNavbarWide(
    navLinkNames: Array<any>,
    navBarRef: HTMLElement | null,
    slideButtonRef: HTMLElement | null
  ) {
    navLinkNames.forEach((link) => link.classList.remove('d_none'));
    setTimeout(() => {
      this.makeLogoWide();
      if (slideButtonRef) slideButtonRef.classList.remove('slideButtonReturn');
      navLinkNames.forEach((link) => link.classList.remove('opacity_zero'));
      if (navBarRef) {
        navBarRef?.classList.remove('navbar-thin');
        navBarRef.style.paddingRight = '24px';
      }
    }, 10);
  }

  makeLogoThin() {
    document.getElementById('financeLogo')!.style.transform = 'translateX(8px)';
    document.getElementById('logoPath7')!.style.display = 'none';
    setTimeout(
      () => (document.getElementById('logoPath6')!.style.display = 'none'),
      50
    );
    setTimeout(
      () => (document.getElementById('logoPath5')!.style.display = 'none'),
      100
    );
    setTimeout(
      () => (document.getElementById('logoPath4')!.style.display = 'none'),
      150
    );
    setTimeout(
      () => (document.getElementById('logoPath3')!.style.display = 'none'),
      200
    );
    setTimeout(
      () => (document.getElementById('logoPath2')!.style.display = 'none'),
      250
    );
  }

  makeLogoWide() {
    document.getElementById('financeLogo')!.style.transform = 'translateX(2px)';
    document.getElementById('logoPath2')!.style.display = 'block';
    setTimeout(
      () => (document.getElementById('logoPath3')!.style.display = 'block'),
      50
    );
    setTimeout(
      () => (document.getElementById('logoPath4')!.style.display = 'block'),
      100
    );
    setTimeout(
      () => (document.getElementById('logoPath5')!.style.display = 'block'),
      150
    );
    setTimeout(
      () => (document.getElementById('logoPath6')!.style.display = 'block'),
      200
    );
    setTimeout(
      () => (document.getElementById('logoPath7')!.style.display = 'block'),
      250
    );
  }
}
