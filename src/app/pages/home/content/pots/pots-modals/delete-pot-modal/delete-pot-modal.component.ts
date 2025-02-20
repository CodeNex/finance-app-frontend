import { Component, inject } from '@angular/core';

import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-delete-pot-modal',
  imports: [],
  templateUrl: './delete-pot-modal.component.html',
  styleUrl: './delete-pot-modal.component.scss',
})
export class DeletePotModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);

  // closes main modal and its children
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
