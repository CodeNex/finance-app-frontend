import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  effect,
  Signal,
  OnInit,
} from '@angular/core';
// import { __classPrivateFieldGet } from 'tslib';

import { DataStoreServiceService } from '@services/data-store-service.service';

@Component({
  selector: 'app-spending-summary-item',
  imports: [CommonModule],
  templateUrl: './spending-summary-item.component.html',
  styleUrl: './spending-summary-item.component.scss',
})
export class SpendingSummaryItemComponent implements OnInit {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);

  public budgetsArraySignal: Signal<BudgetsObject[]> = this.dataStore.budgets;

  @Input() public summaryItem!: BudgetsObjectLike;

  @Input() public inWhichSection: string = '';

  public spendedAmount: string | undefined = '';
  public maximumAmount: string | undefined = '';

  constructor() {
    effect(() => {
      let signal = this.budgetsArraySignal();
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.spendedAmount = this.getSpendedAmount();
    this.maximumAmount = this.getMaximumAmount();
  }

  private getSpendedAmount() {
    return this.summaryItem.amount?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private getMaximumAmount() {
    return this.summaryItem.maximum?.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
