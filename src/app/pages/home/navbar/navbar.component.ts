import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  ViewChildren,
  QueryList,
  Renderer2,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '@components/icons/icons.component';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';

/**
 * * * NavbarComponent
 * This component is responsible for rendering the navigation bar of the application.
 * It contains the links and icons for navigating to different sections of the app.
 * It also handles the logic for collapsing and expanding the navbar, as well as animating the logo.
 */
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
  private renderer = inject(Renderer2);

  @ViewChild('navBar', { static: false }) navBarRef!: ElementRef<HTMLElement>;
  @ViewChild('slideButton', { static: false })
  slideButtonRef!: ElementRef<HTMLElement>;
  @ViewChildren('navLinkName') navLinkNames!: QueryList<
    ElementRef<HTMLElement>
  >;
  // #endregion

  // This data is used to render the navbar links and icons.
  public navData = this.baseData.navdata;

  // #region Navbar View and Animation
  isNavbarThin: boolean = false;

  public toggleMovingNavbar(): void {
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

  private makeNavbarThin(
    navLinkNames: Array<any>,
    navBarRef: HTMLElement | null,
    slideButtonRef: any
  ): void {
    this.makeLogoThin();
    if (slideButtonRef) {
      this.renderer.addClass(slideButtonRef, 'slideButtonReturn'); 
    }
    navLinkNames.forEach((link) =>
      this.renderer.addClass(link.nativeElement, 'opacity_zero')
    );
    if (navBarRef) {
      this.renderer.addClass(navBarRef, 'navbar-thin');
      this.renderer.setStyle(navBarRef, 'paddingRight', '8px');
    }
    setTimeout(() => {
      navLinkNames.forEach((link) =>
        this.renderer.addClass(link.nativeElement, 'd_none')
      );
    }, 300);
  }

  private makeNavbarWide(
    navLinkNames: Array<any>,
    navBarRef: HTMLElement | null,
    slideButtonRef: any
  ): void {
    navLinkNames.forEach((link) =>
      this.renderer.removeClass(link.nativeElement, 'd_none')
    );
    setTimeout(() => {
      this.makeLogoWide();
      if (slideButtonRef)
        this.renderer.removeClass(slideButtonRef, 'slideButtonReturn');
      navLinkNames.forEach((link) =>
        this.renderer.removeClass(link.nativeElement, 'opacity_zero')
      );

      if (navBarRef) {
        this.renderer.removeClass(navBarRef, 'navbar-thin');
        this.renderer.setStyle(navBarRef, 'paddingRight', '24px');
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
