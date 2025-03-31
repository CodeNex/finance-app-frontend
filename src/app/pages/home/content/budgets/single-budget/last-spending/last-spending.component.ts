import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { IconsComponent } from '../../../../../../components/icons/icons.component';

import { BasedataService } from '../../../../../../services/basedata.service';

@Component({
  selector: 'app-last-spending',
  imports: [CommonModule, IconsComponent],
  templateUrl: './last-spending.component.html',
  styleUrl: './last-spending.component.scss',
})
export class LastSpendingComponent {
  @Input() public spending: any = {
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
  };

  public baseData: BasedataService = inject(BasedataService);

  public amount: string = '';
  public date: string = '';
  public iconBackground: string = '';
  public iconName: string = '';

  ngOnInit() {
    if (this.spending.transaction_id > -1) {
      this.amount = this.formatAmount(this.spending.amount);
      this.date = this.formatDate(this.spending.execute_on);
      // this.iconName = this.getCategoryIcon(this.spending.budget.category);
      this.iconName = this.getCategoryIcon(this.spending.category);
      this.iconBackground = this.spending.theme;
    }
  }

  // private function to format amount
  private formatAmount(amount: number): string {
    return `-$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // private function to format date
  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // public function to get category icon
  private getCategoryIcon(category: string): string {
    return this.baseData.financeApp.budgets.categories[category].iconName;
  }
}
