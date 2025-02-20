import { Component, inject } from '@angular/core';

import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-add-pot-modal',
  imports: [],
  templateUrl: './add-pot-modal.component.html',
  styleUrl: './add-pot-modal.component.scss',
})
export class AddPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
