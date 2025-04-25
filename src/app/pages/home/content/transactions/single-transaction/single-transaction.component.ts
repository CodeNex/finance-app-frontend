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
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
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


  public category: string = '';


  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    this.iconName =
      this.baseData.financeApp.budgets.categories[
        this.transaction.category!
      ].iconName;


    this.category =
      this.baseData.financeApp.budgets.categories[
        this.transaction.category!
      ].name;
  }

  private getIconName(): string {
    return this.baseData.getCategoryIcon(this.transaction.category!);
  }
  // #endregion
}
