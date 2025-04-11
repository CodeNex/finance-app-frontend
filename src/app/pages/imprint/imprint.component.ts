import {
  Component,
  inject,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { IconsComponent } from '@components/icons/icons.component';

/**
 * * * ImprintComponent
 * This component is responsible for displaying the imprint page of the application.
 * It contains the imprint information and handles the logic for switching between the login and sign-up forms.
 * It uses the ActivatedRoute to get the location data and the RouterModule for navigation.
 */
@Component({
  selector: 'app-imprint',
  imports: [RouterModule, IconsComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent implements OnInit, OnDestroy {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public route = inject(ActivatedRoute);

  @Input() public lastShownLoginWindow: string = 'loginForm';

  @Output() readonly switchToLogInComponent: EventEmitter<string> =
    new EventEmitter<string>();

  private subscription = new Subscription();
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit() {
    this.subscription.add(
      this.route.data.subscribe((data) => {
        this.location = data?.['location'] ?? 'loggedOut';
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  // #endregion

  public location: string = 'loggedOut';

  public get windowLabel(): string {
    return this.lastShownLoginWindow === 'loginForm' ? 'Log-In' : 'Sign-Up';
  }
}
