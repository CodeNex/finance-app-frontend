import { Component, inject, Input } from '@angular/core';

import { MainModalService } from '@services/main-modal.service';
import { ApiBudgetsService } from '@content/budgets/api-budgets.service';
import { CommonModule } from '@angular/common';

/**
 * * * DeleteBudgetModalComponent
 * This component is responsible for displaying the delete budget modal.
 * It shows the budget name and asks the user to confirm the deletion.
 * It uses the MainModalService to manage the modal state and the ApiBudgetsService to delete the budget.
 * It also handles the logic for closing the modal and deleting the budget.
 */
@Component({
  selector: 'app-delete-budget-modal',
  imports: [CommonModule],
  templateUrl: './delete-budget-modal.component.html',
  styleUrl: './delete-budget-modal.component.scss',
})
export class DeleteBudgetModalComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public mainModalService = inject(MainModalService);
  public apiBudgetsService = inject(ApiBudgetsService);

  @Input() public modalObject: any = {};
  @Input() public budgetIndex: number = 1;
  // #endregion

  deleteCurrentBudget() {
    this.apiBudgetsService.deleteBudget(this.modalObject, this.budgetIndex);
  }

  public closeMainModal() {
    this.mainModalService.hideMainModal();
  }
}
