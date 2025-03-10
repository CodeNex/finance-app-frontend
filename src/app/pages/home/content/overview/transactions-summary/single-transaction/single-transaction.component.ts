import { Component, inject, Input, OnInit } from '@angular/core';
import { IconsComponent } from '../../../../../../components/icons/icons.component';
import { CommonModule } from '@angular/common';
import { BasedataService } from '../../../../../../services/basedata.service';

@Component({
  selector: 'app-single-transaction',
  imports: [IconsComponent, CommonModule],
  templateUrl: './single-transaction.component.html',
  styleUrl: './single-transaction.component.scss'
})
export class SingleTransactionComponent implements OnInit {
  @Input() public transaction: any = {
    id: 0,
    user: 0,
    amount: 40.24,
    budget_id: null,
    created_at: null,
    deleted_at: null,
    recurring: null,
    theme: "",
    name: "Test Transaction 1",
    category: "Entertainment",
    budget: {
      category: ""
    }
  };

  public baseData: BasedataService = inject(BasedataService);

  public name: string = '';
  public amount: string = '';
  public date: string = '';
  public iconBackground: string = '';
  public iconName: string = '';

  ngOnInit() {
    this.name = this.transaction.name;
    this.amount = this.formatAmount(this.transaction.amount);
    this.date = this.formatDate(this.transaction.created_at);
    this.iconName = this.getCategoryIcon(this.transaction.category);
    this.iconBackground = this.transaction.theme;
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
