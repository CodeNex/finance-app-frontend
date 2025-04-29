import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconsComponent } from '@components/icons/icons.component';
import { BasedataService } from '@services/basedata.service';
import { FormatAmountPipe } from '@src/shared/pipes/format-amount.pipe';
import { FormatDatePipe } from '@src/shared/pipes/format-date.pipe';

@Component({
  selector: 'app-single-transaction',
  imports: [IconsComponent, CommonModule, FormatAmountPipe, FormatDatePipe],
  templateUrl: './single-transaction.component.html',
  styleUrl: './single-transaction.component.scss',
})
export class SingleTransactionComponent implements OnInit {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public baseData = inject(BasedataService);

  @Input() public transaction: TransactionsObject = {
    transaction_id: 0,
    user_id: 0,
    amount: 345.0,
    budget_id: null,
    created_at: '2024-09-12T00:00:00Z',
    execute_on: '2025-03-26T00:00:00Z',
    deleted_at: null,
    recurring: 'monthly',
    recurring_id: 0,
    theme: '#597C7C',
    sender: '',
    receiver: '',
    name: 'Apartment Rent',
    category: 'bills',
    type: 'debit',
  };

  public iconBackground: string = '';
  public iconName: string = '';
  // #endregion

  ngOnInit(): void {
    this.iconBackground = this.transaction.theme;
    if (this.transaction.category)
      this.iconName = this.getCategoryIcon(this.transaction.category);
  }

  private getCategoryIcon(category: string): string {
    return this.baseData.getCategoryIcon(category);
  }
}
