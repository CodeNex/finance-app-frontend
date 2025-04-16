import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';
import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { BasedataService } from '@services/basedata.service';

/**
 * * LastSpendingComponent
 * * This component is responsible for displaying the last spending of a budget.
 * * It shows the name, amount, date, and icon of the last spending.	
 */
@Component({
  selector: 'app-last-spending',
  imports: [CommonModule, IconsComponent, FormatAmountPipe, FormatDatePipe],
  templateUrl: './last-spending.component.html',
  styleUrl: './last-spending.component.scss',
})
export class LastSpendingComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public baseData = inject(BasedataService);

  @Input() public spending: TransactionsObject = {
    transaction_id: -1,
    user_id: -1,
    name: '',
    amount: 0,
    recurring: null,
    theme: '',
    budget_id: null,
    deleted_at: null,
    created_at: null,
    execute_on: null,
    type: '',
    category: '',
    recurring_id: null,
    sender: null,
    receiver: null,
  };
  // #endregion
}
