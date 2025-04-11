import { CommonModule } from '@angular/common';
import { Component, inject, Input, effect, Signal } from '@angular/core';
import { __classPrivateFieldGet } from 'tslib';

import { DataStoreServiceService } from '@services/data-store-service.service';

@Component({
  selector: 'app-spending-summary-item',
  imports: [CommonModule],
  templateUrl: './spending-summary-item.component.html',
  styleUrl: './spending-summary-item.component.scss',
})
export class SpendingSummaryItemComponent {

  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  public budgetsArraySignal$: Signal<any> = this.dataStore.budgets;

  @Input() public summaryItem: any = {
    amount: 0,
    created_at: null,
    deleted_at: null,
    id: -1,
    last_spendings: [],
    maximum: -1,
    name: 'Example',
    theme: '#93674F',
  };

  @Input() public inWhichSection: string = '';

  public spendedAmount: string = '';
  public maximumAmount: string = '';

  constructor() {
      effect(() => {
        let signal = this.budgetsArraySignal$();
        this.ngOnInit();
      })
    }

  ngOnInit() {
    this.spendedAmount = this.getSpendedAmount();
    this.maximumAmount = this.getMaximumAmount();
  }

  private getSpendedAmount() {
    return this.summaryItem.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      macimumFractionDigits: 2,
    });
  }

  private getMaximumAmount() {
    return this.summaryItem.maximum.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      macimumFractionDigits: 2,
    });
  }
}
