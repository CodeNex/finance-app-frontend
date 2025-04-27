import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainModalService } from '@services/main-modal.service';
import { ApiPotsService } from '@content/pots/api-pots.service';

/**
 * * * DeletePotModalComponent
 * This component is responsible for displaying the delete pot modal.
 * It shows the pot name and asks the user to confirm the deletion.
 * It uses the MainModalService to manage the modal state and the ApiPotsService to delete the pot.
 * It also handles the logic for closing the modal and deleting the pot.
 */
@Component({
  selector: 'app-delete-pot-modal',
  imports: [CommonModule],
  templateUrl: './delete-pot-modal.component.html',
  styleUrl: './delete-pot-modal.component.scss',
})
export class DeletePotModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public apiPotService = inject(ApiPotsService);
  
  @Input() public modalObject!: PotsObject;
  @Input() public potIndex: number = -1;
  // #endregion

  deleteCurrentPot() {
    this.apiPotService.deletePot(this.modalObject, this.potIndex);
  }

  /**
   * * Closes the main and current modal by calling the hideMainModal method from the MainModalService.
   */
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
