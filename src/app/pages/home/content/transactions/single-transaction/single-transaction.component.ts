import { Component, inject, Input } from '@angular/core';

import { BasedataService } from '@services/basedata.service';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '@components/icons/icons.component';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';

/**
 * * * * SingleTransactionComponent
 * This component is responsible for displaying a single transaction in the application.
 * It shows the transaction details such as amount, date, category, and type.
 * * It uses the BasedataService to get the base data for the application and the IconsComponent to display icons.
 * * It uses the FormatDatePipe and FormatAmountPipe to format the date and amount respectively.
 */
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
    this.iconName = this.getIconName();
    this.category = this.getCategoryName();
  }

  private getIconName(): string {
    const categories = this.baseData.categories;
    return categories[this.transaction.category!].iconName;
  }

  private getCategoryName(): string {
    const categories = this.baseData.categories;
    return categories[this.transaction.category!].name;
  }
  // #endregion
}
