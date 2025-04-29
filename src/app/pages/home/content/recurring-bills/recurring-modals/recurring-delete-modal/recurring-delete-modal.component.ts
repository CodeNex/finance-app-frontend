import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MainModalService } from '@services/main-modal.service';
import { ApiTransactionService } from '@content/transactions/api-transaction.service';

/**
 * * * RecurringDeleteModalComponent
 * This component is responsible for displaying the delete recurring transaction modal.
 * It allows the user to delete a recurring transaction.
 * It uses the MainModalService to manage the modal state and the ApiTransactionService to interact with the backend.
 */
@Component({
  selector: 'app-recurring-delete-modal',
  imports: [CommonModule],
  templateUrl: './recurring-delete-modal.component.html',
  styleUrl: './recurring-delete-modal.component.scss',
})
export class RecurringDeleteModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public apiTransactionService = inject(ApiTransactionService);

  @Input() public modalObject!: TransactionsObject;
  @Input() public recurringIndex: number = -1;
  // #endregion

  
  // #region Helper Function
  public closeMainModal(): void {
    this.mainModalService.hideMainModal();
  }
  // #endregion

  /**
   * @description - This function is called when the user clicks on the delete button in the modal.
   * It calls the deleteRecurring function from the ApiTransactionService to delete the current recurring transaction.
   */
  public deleteCurrentRecurring(): void {
    this.apiTransactionService.deleteRecurring(
      this.modalObject,
      this.recurringIndex
    );
  }
}
