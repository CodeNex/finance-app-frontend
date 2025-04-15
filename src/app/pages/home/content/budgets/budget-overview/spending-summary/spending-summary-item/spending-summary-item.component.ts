import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  Signal,
} from '@angular/core';
import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';

import { DataStoreServiceService } from '@services/data-store-service.service';

@Component({
  selector: 'app-spending-summary-item',
  imports: [CommonModule, FormatAmountPipe],
  templateUrl: './spending-summary-item.component.html',
  styleUrl: './spending-summary-item.component.scss',
})
export class SpendingSummaryItemComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);

  public budgetsArraySignal: Signal<BudgetsObject[]> = this.dataStore.budgets;

  @Input() public summaryItem!: BudgetsObject;

  @Input() public inWhichSection: string = '';
  // #endregion
}
