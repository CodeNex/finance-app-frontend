import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * * * ScreensizeService
 * This service is responsible for observing the screen size and providing  
 * observables for different screen size breakpoints.
 * It uses Angular's BreakpointObserver to monitor changes in screen size.
 */
@Injectable({
  providedIn: 'root',
})
export class ScreensizeService {
  private customBreakpoints = {
    handset: '(max-width: 768px)',
    smallTablet: '(max-width: 1024px)',
    tablet: '(max-width: 1280px)',
    desktop: '(min-width: 1281px)',
  };

  private breakpointObserver = inject(BreakpointObserver);

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(this.customBreakpoints.handset)
    .pipe(map((result) => result.matches));

  public isSmallTablet$: Observable<boolean> = this.breakpointObserver
    .observe(this.customBreakpoints.smallTablet)
    .pipe(map((result) => result.matches));

  public isTablet$: Observable<boolean> = this.breakpointObserver
    .observe(this.customBreakpoints.tablet)
    .pipe(map((result) => result.matches));

  public isDesktop$: Observable<boolean> = this.breakpointObserver
    .observe(this.customBreakpoints.desktop)
    .pipe(map((result) => result.matches));
}
