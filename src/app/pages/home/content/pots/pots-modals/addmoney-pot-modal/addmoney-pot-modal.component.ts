import { Component, inject } from '@angular/core';

import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-addmoney-pot-modal',
  imports: [],
  templateUrl: './addmoney-pot-modal.component.html',
  styleUrl: './addmoney-pot-modal.component.scss',
})
export class AddmoneyPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  public currentPot: string = 'currentPot';
}
