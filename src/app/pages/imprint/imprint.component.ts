import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { IconsComponent } from '@components/icons/icons.component';

@Component({
  selector: 'app-imprint',
  imports: [RouterModule, IconsComponent],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

  public route: ActivatedRoute = inject(ActivatedRoute);

  public location: string = 'loggedOut';

  @Input() public lastShownLoginWindow: string = 'loginForm';

  @Output() public switchToLogInComponent: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this.getImprintLocation();
  }

  getImprintLocation() {
    this.route.data.subscribe(data => {
      this.location = data['location'];
    })
  }

  switchToLoginComponent() {
    this.switchToLogInComponent.emit(this.lastShownLoginWindow);
  }

}
