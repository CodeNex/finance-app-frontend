import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-last-spending',
  imports: [CommonModule],
  templateUrl: './last-spending.component.html',
  styleUrl: './last-spending.component.scss',
})
export class LastSpendingComponent {
  @Input() public spending: any = {
    id: 1,
    user: 1,
    name: 'Initial Deposit',
    amount: 100.0,
    recurring: null,
    budget_id: null,
    deleted_at: null,
    created_at: '2025-02-24T16:14:01.000000Z',
    category: '',
    budget: {
      name: 'Entertainment',
    },
  };
}
