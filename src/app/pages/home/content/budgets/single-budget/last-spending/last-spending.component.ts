import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';

import { FormatAmountPipe } from '@shared/pipes/format-amount.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';

import { BasedataService } from '@services/basedata.service';

@Component({
  selector: 'app-last-spending',
  imports: [CommonModule, IconsComponent, FormatAmountPipe, FormatDatePipe],
  templateUrl: './last-spending.component.html',
  styleUrl: './last-spending.component.scss',
})
export class LastSpendingComponent {
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

  public baseData = inject(BasedataService);

  public iconBackground: string = '';
  public iconName: string = '';

  ngOnInit() {
    if (this.spending.transaction_id > -1) {
      if (this.spending.category) this.iconName = this.getCategoryIcon(this.spending.category);
      this.iconBackground = this.spending.theme;
    }
  }

  private getCategoryIcon(category: string): string {
    return this.baseData.financeApp.budgets.categories[category].iconName;
  }
}
