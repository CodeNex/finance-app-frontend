import { Component, ElementRef, inject, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '@components/icons/icons.component';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, IconsComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public authService = inject(AuthenticationService);
  public baseData = inject(BasedataService);

  @ViewChild('navBar', { static: false }) navBarRef!: ElementRef<HTMLElement>;
  @ViewChild('slideButton', { static: false })
  slideButtonRef!: ElementRef<HTMLElement>;
  @ViewChildren('navLinkName') navLinkNames!: QueryList<ElementRef<HTMLElement>>;
  // #endregion

  // This data is used to render the navbar links and icons.
  public navData = this.baseData.navdata;

  // #region Navbar View
  isNavbarThin: boolean = false;

  toggleMovingNavbar() {
    const navLinkNames = this.navLinkNames.toArray();
    const navBarRef = this.navBarRef.nativeElement;
    const slideButtonRef = this.slideButtonRef.nativeElement;

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
    navLinkNames.forEach((link) =>
      link.nativeElement.classList.add('opacity_zero')
    );
    if (navBarRef) {
      navBarRef.classList.add('navbar-thin');
      navBarRef.style.paddingRight = '8px';
    }
    setTimeout(() => {
      navLinkNames.forEach((link) => link.nativeElement.classList.add('d_none'));
    }, 300);
  }

  makeNavbarWide(
    navLinkNames: Array<any>,
    navBarRef: HTMLElement | null,
    slideButtonRef: HTMLElement | null
  ) {
    navLinkNames.forEach((link) => link.nativeElement.classList.remove('d_none'));
    setTimeout(() => {
      this.makeLogoWide();
      if (slideButtonRef) slideButtonRef.classList.remove('slideButtonReturn');
      navLinkNames.forEach((link) => link.nativeElement.classList.remove('opacity_zero'));
      if (navBarRef) {
        navBarRef?.classList.remove('navbar-thin');
        navBarRef.style.paddingRight = '24px';
      }
    }, 10);
  }
  // #endregion

  // #region Logo Animation
  public visibleLogoPaths: string[] = [
    'logoPath2',
    'logoPath3',
    'logoPath4',
    'logoPath5',
    'logoPath6',
    'logoPath7',
  ];
  public isLogoWide: boolean = true;

  makeLogoThin() {
    this.isLogoWide = false;
    const paths = [
      'logoPath2',
      'logoPath3',
      'logoPath4',
      'logoPath5',
      'logoPath6',
      'logoPath7',
    ];
    this.visibleLogoPaths = [...paths];
    paths.reverse().forEach((path, index) => {
      setTimeout(() => {
        this.visibleLogoPaths = this.visibleLogoPaths.filter((p) => p !== path);
      }, index * 50);
    });
  }

  makeLogoWide() {
    const paths = [
      'logoPath2',
      'logoPath3',
      'logoPath4',
      'logoPath5',
      'logoPath6',
      'logoPath7',
    ];
    paths.forEach((path, index) => {
      setTimeout(() => {
        this.visibleLogoPaths = [...this.visibleLogoPaths, path];
      }, index * 50);
    });
    this.isLogoWide = true;
  }
  // #endregion
}
