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

@Component({
  selector: 'app-imprint',
  imports: [RouterModule, IconsComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss',
})
export class ImprintComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  public readonly route = inject(ActivatedRoute);

  public location: string = 'loggedOut';

  @Input() public lastShownLoginWindow: string = 'loginForm';

  @Output() public switchToLogInComponent: EventEmitter<string> =
    new EventEmitter<string>();

  public switchToLoginComponent() {
    this.switchToLogInComponent.emit(this.lastShownLoginWindow);
  }

  public get windowLabel(): string {
    return this.lastShownLoginWindow === 'loginForm' ? 'Log-In' : 'Sign-Up';
  }

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
}
