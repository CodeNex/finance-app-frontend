import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MainModalService } from '@services/main-modal.service';
import { ApiTransactionService } from '@content/transactions/api-transaction.service';

@Component({
  selector: 'app-recurring-delete-modal',
  imports: [CommonModule],
  templateUrl: './recurring-delete-modal.component.html',
  styleUrl: './recurring-delete-modal.component.scss',
})
export class RecurringDeleteModalComponent {
  public mainModalService: MainModalService = inject(MainModalService);
  public apiTransactionService: ApiTransactionService = inject(
    ApiTransactionService
  );

  @Input() public modalObject: any = {};
  @Input() public recurringIndex: number = -1;

  // ########################################
  // # Close Main Modal and its Children
  // ########################################
  
  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }

  // ########################################
  // # Soft-Delete Current Recurring Transaction
  // ########################################

  public deleteCurrentRecurring() {
    this.apiTransactionService.deleteRecurring(
      this.modalObject,
      this.recurringIndex
    );
  }
}
