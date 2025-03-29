import { Component, inject, Input } from '@angular/core';

import { BasedataService } from '../../../../../services/basedata.service';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '../../../../../components/icons/icons.component';

@Component({
  selector: 'app-single-transaction',
  imports: [CommonModule, IconsComponent],
  templateUrl: './single-transaction.component.html',
  styleUrl: './single-transaction.component.scss',
})
export class SingleTransactionComponent {
  public baseData: BasedataService = inject(BasedataService);

  @Input() transaction: any = {
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
        this.transaction.category
      ].iconName;
    this.theme = this.transaction.theme;
    this.name = this.transaction.name;
    this.category =
      this.baseData.financeApp.budgets.categories[
        this.transaction.category
      ].name;
    this.date = new Date(this.transaction.execute_on)
      .toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
      .replace(',', '');
    this.amount = this.transaction.amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    this.type = this.transaction.type;

  }
}
