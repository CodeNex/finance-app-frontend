import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { __classPrivateFieldGet } from 'tslib';

@Component({
  selector: 'app-spending-summary-item',
  imports: [CommonModule],
  templateUrl: './spending-summary-item.component.html',
  styleUrl: './spending-summary-item.component.scss',
})
export class SpendingSummaryItemComponent {
  @Input() public summaryItem: any = {
    amount: 0,
    created_at: null,
    deleted_at: null,
    id: -11,
    last_spendings: [],
    maximum: -1,
    name: 'Example',
    theme: '#93674F',
  };

  public spendedAmount: string = '';
  public maximumAmount: string = '';

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
