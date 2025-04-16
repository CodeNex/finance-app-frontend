import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  Signal,
  signal,
  effect,
  OnDestroy
} from '@angular/core';
import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { BudgetCalculationsService } from '@services/budget-calculations.service';

/**
 * * SpendingSummaryItemComponent
 * This component is responsible for displaying a single budget in the spending summary.
 * It uses the DataStoreService to manage the budget data.
 * It uses the BudgetCalculationsService to calculate the budget data.
 * It uses the FormatAmountPipe to format the budget amount.
 */
@Component({
  selector: 'app-spending-summary-item',
  imports: [CommonModule, FormatAmountPipe],
  templateUrl: './spending-summary-item.component.html',
  styleUrl: './spending-summary-item.component.scss',
})
export class SpendingSummaryItemComponent implements OnDestroy {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);
  private budgetCalculationsService = inject(BudgetCalculationsService);

  public budgetsArraySignal: Signal<BudgetsObject[]> = this.dataStore.budgets;
  public transactionsSignal: Signal<TransactionsObject[]> =
    this.dataStore.transactions;

  @Input() public inWhichSection: string = '';

  @Input() set summaryItem(value: BudgetsObject) {
    this._summaryItem.set(value);
  }
  public readonly _summaryItem = signal<BudgetsObject | null>(null);

  public budgetCalculations: BudgetCalculations = {
    budgetName: '',
    maximum: 0,
    calculatedSpent: 0,
    remaining: 0,
    isTooMuchSpent: false,
  };
   // #endregion

  // #region Lifecycle Hooks
  private budgetEffect = effect(() => {
    const budget = this._summaryItem();
    if (!budget) return;
    this.budgetsArraySignal();
    this.budgetCalculations = this.budgetCalculationsService.calculateBudget(
      budget,
      'year',
      this.transactionsSignal()
    );
  });

  ngOnDestroy(): void {
    if (!this.budgetEffect) return;
    this.budgetEffect.destroy();
  }
  // #endregion
 
}
