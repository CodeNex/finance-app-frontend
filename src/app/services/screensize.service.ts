import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomBreakpoints } from '@shared/breakpoints';

@Injectable({
  providedIn: 'root',
})
export class ScreensizeService {
  private breakpointObserver = inject(BreakpointObserver);

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(CustomBreakpoints.handset)
    .pipe(map((result) => result.matches));

  public isTablet$: Observable<boolean> = this.breakpointObserver
    .observe(CustomBreakpoints.tablet)
    .pipe(map((result) => result.matches));

  public isDesktop$: Observable<boolean> = this.breakpointObserver
    .observe(CustomBreakpoints.desktop)
    .pipe(map((result) => result.matches));
}
