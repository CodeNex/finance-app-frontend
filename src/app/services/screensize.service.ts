import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreensizeService {
  private customBreakpoints = {
    handset: '(max-width: 768px)',
    tablet: '(max-width: 1024px)',
    desktop: '(min-width: 1025px)',
  }

  private breakpointObserver = inject(BreakpointObserver);

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(this.customBreakpoints.handset)
    .pipe(map((result) => result.matches));

  public isTablet$: Observable<boolean> = this.breakpointObserver
    .observe(this.customBreakpoints.tablet)
    .pipe(map((result) => result.matches));

  public isDesktop$: Observable<boolean> = this.breakpointObserver
    .observe(this.customBreakpoints.desktop)
    .pipe(map((result) => result.matches));
}
