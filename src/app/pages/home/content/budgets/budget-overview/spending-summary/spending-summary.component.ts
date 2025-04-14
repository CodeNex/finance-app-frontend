import {
  Component,
  inject,
  Input,
  Signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '@services/data-store-service.service';

import { SpendingSummaryItemComponent } from '@content/budgets/budget-overview/spending-summary/spending-summary-item/spending-summary-item.component';

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

  @Input() public inWhichSection: string = '';
  // #endregion

  public budgetsArray = computed(() => this.budgetsArraySignal().filter(b => !b.deleted_at));
}
