import { Component, inject } from '@angular/core';

import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-edit-pot-modal',
  imports: [],
  templateUrl: './edit-pot-modal.component.html',
  styleUrl: './edit-pot-modal.component.scss',
})
export class EditPotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
