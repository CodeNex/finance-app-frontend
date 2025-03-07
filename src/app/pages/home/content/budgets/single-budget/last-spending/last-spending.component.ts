import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconsComponent } from '../../../../../../components/icons/icons.component';

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
    budget_id: null,
    deleted_at: null,
    created_at: '2025-02-24T16:14:01.000000Z',
    category: '',
    budget: {
      category: 'entertainment',
    },
  };

  public amount: string = '';
  public date: string = '';
  public logoBackground: string = '#d46c5e';

  ngOnInit() {
    this.amount = this.formatAmount(this.spending.amount);
    this.date = this.formatDate(this.spending.created_at);
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
}
