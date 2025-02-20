import { Component, inject } from '@angular/core';

import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-withdrawmoney-pot-modal',
  imports: [],
  templateUrl: './withdrawmoney-pot-modal.component.html',
  styleUrl: './withdrawmoney-pot-modal.component.scss',
})
export class WithdrawmoneyPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
