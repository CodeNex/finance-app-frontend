import {
  Component,
  inject,
  Input,
  Signal,
  computed,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '@services/data-store-service.service';

import { SpendingSummaryItemComponent } from '@content/budgets/budget-overview/spending-summary/spending-summary-item/spending-summary-item.component';

/**
 * * * SpendingSummaryComponent
 * This component is responsible for displaying the spending summary of all budgets.
 * It uses the DataStoreService to manage the budget data.
 * It uses the SpendingSummaryItemComponent to display each budget in the summary.
 */
@Component({
  selector: 'app-spending-summary',
  imports: [CommonModule, SpendingSummaryItemComponent],
  templateUrl: './spending-summary.component.html',
  styleUrl: './spending-summary.component.scss',
})
export class SpendingSummaryComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public dataStore = inject(DataStoreServiceService);

  public budgetsArraySignal: Signal<BudgetsObject[]> = this.dataStore.budgets;

  public budgetsEffect = effect(() => {
    let array = this.budgetsArraySignal();
    this.budgetsArray = array.filter(b => !b.deleted_at);
  })

  public budgetsArray: BudgetsObject[] = [];

  @Input() public inWhichSection: string = '';
  // #endregion
}
