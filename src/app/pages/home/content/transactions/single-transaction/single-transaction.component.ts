import { Component, inject, Input } from '@angular/core';

import { BasedataService } from '@services/basedata.service';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '@components/icons/icons.component';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';

@Component({
  selector: 'app-single-transaction',
  imports: [CommonModule, IconsComponent, FormatDatePipe, FormatAmountPipe],
  templateUrl: './single-transaction.component.html',
  styleUrl: './single-transaction.component.scss',
})
export class SingleTransactionComponent {
  public baseData = inject(BasedataService);

  @Input() transaction: TransactionsObject = {
    transaction_id: 4,
    user_id: 0,
    amount: 170.55,
    budget_id: null,
    created_at: '2025-11-04T00:00:00Z',
    execute_on: '2025-07-30T00:00:00Z',
    deleted_at: null,
    recurring: 'monthly',
    recurring_id: null,
    theme: '#af81ba',
    sender: '',
    receiver: '',
    name: 'Taxi Ride',
    category: 'transportation',
    type: 'debit',
  };

  public iconName: string = '';
  public theme: string = '';
  public name: string = '';
  public category: string = '';
  public date: string = '';
  public amount: string = '';
  public type: string = '';

  ngOnInit() {
    this.iconName =
      this.baseData.financeApp.budgets.categories[
        this.transaction.category!
      ].iconName;
    this.theme = this.transaction.theme;
    this.name = this.transaction.name;
    this.category =
      this.baseData.financeApp.budgets.categories[
        this.transaction.category!
      ].name;
    this.amount = this.transaction.amount!.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    this.type = this.transaction.type;
  }
}
