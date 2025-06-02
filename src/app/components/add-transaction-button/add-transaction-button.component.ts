import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { MainModalService } from '@src/services/main-modal.service';

@Component({
  selector: 'app-add-transaction-button',
  imports: [CommonModule],
  templateUrl: './add-transaction-button.component.html',
  styleUrl: './add-transaction-button.component.scss',
})
export class AddTransactionButtonComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private mainModalService = inject(MainModalService);
  // #endregion

  /**
   * @description - This function is responsible for opening the sub modal.
   * It uses the MainModalService to open the sub modal and pass the object to it.
   * @param subModal - The name of the sub modal to be opened.
   * @param subModalObject - The object to be passed to the sub modal. 
   */
  public openSubModal(subModal: string, subModalObject: Object = {}): void {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
