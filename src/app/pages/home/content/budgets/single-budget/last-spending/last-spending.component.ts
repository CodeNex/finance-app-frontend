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
    id: 1,
    user: 1,
    name: 'Spending Address',
    amount: 100.0,
    recurring: null,
    theme: '',
    budget_id: null,
    deleted_at: null,
    created_at: '2025-02-24T16:14:01.000000Z',
    category: '',
    budget: {
      category: 'entertainment',
    },
  };

  public baseData: BasedataService = inject(BasedataService);

  public amount: string = '';
  public date: string = '';
  public logoBackground: string = '';
  public iconName: string = '';

  ngOnInit() {
    this.amount = this.formatAmount(this.spending.amount);
    this.date = this.formatDate(this.spending.created_at);
    this.iconName = this.getCategoryIcon(this.spending.budget.category);
    console.log(this.iconName);
    
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
