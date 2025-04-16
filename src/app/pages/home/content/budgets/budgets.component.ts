import { Component, inject, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { MainModalService } from '@services/main-modal.service';

import { SingleBudgetComponent } from '@content/budgets/single-budget/single-budget.component';
import { BudgetOverviewComponent } from '@content/budgets/budget-overview/budget-overview.component';

/**
 * * BudgetsComponent
 * This component is responsible for displaying the budgets in the application.
 * It uses the DataStoreService to manage the budget data
 * It uses the MainModalService to open modals for creating budgets.
 */
@Component({
  selector: 'app-budgets',
  imports: [CommonModule, SingleBudgetComponent, BudgetOverviewComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);
  public mainModalService = inject(MainModalService);

  readonly filteredBudgets: Signal<BudgetsObject[]> = computed(() =>
    this.dataStore.budgets().filter((budget: BudgetsObject) => !budget.deleted_at)
  );
  // #endregion

  /**
   * @description - This function is used to open the main modal for creating a new budget.
   * @param subModal - The name of the submodal to be opened.
   * @param subModalObject - Its needed by the submodel. In this case we retreive an empty object.
   */
  public openSubModal(subModal: string, subModalObject: {}): void {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
