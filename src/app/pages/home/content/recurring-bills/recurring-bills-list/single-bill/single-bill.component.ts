import { Component, inject, Input, OnInit } from '@angular/core';
import { IconsComponent } from '../../../../../../components/icons/icons.component';
import { CommonModule } from '@angular/common';
import { BasedataService } from '../../../../../../services/basedata.service';
import { MainModalService } from '../../../../../../services/main-modal.service';

@Component({
  selector: 'app-single-bill',
  imports: [IconsComponent, CommonModule],
  templateUrl: './single-bill.component.html',
  styleUrl: './single-bill.component.scss'
})
export class SingleBillComponent {
  @Input() public recurringBill: any = {
    transaction_id: 6,
    user_id: 0,
    amount: 40.00,
    budget_id: null,
    created_at: '2024-03-25T00:00:00Z',
    execute_on: '2025-03-23T00:00:00Z',
    deleted_at: null,
    recurring: 'weekly',
    recurring_id: "6",
    theme: '#cab361',
    sender: '',
    receiver: '',
    name: 'Office Rent',
    category: 'bills',
    type: 'debit',
  };

  @Input() public recurringIndex: number = -1;

  public baseData: BasedataService = inject(BasedataService);
  public mainModalService: MainModalService = inject(MainModalService);

  // components basic data
  public name: string = '';
  public amount: string = '';
  public dueDate: string = '';
  public occurrency: string = '';
  public iconBackground: string = '';
  public iconName: string = '';
  public type: string = '';

  ngOnInit() {
    this.completeComponentsBasicData();
  }

  // ########################################
  // # complete components basic data
  // ########################################

  public completeComponentsBasicData() {
    this.name = this.recurringBill.name;
    this.amount = this.formatAmount(this.recurringBill.amount);
    this.dueDate = this.formatDate(this.recurringBill.execute_on);
    this.occurrency = this.recurringBill.recurring;
    this.iconName = this.getCategoryIcon(this.recurringBill.category);
    this.iconBackground = this.recurringBill.theme;
    this.type = this.recurringBill.type;
  }

  // ########################################
  // # format amount and date
  // ########################################

  private formatAmount(amount: number): string {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // ########################################
  // # get specific category icon
  // ########################################

  private getCategoryIcon(category: string): string {
    return this.baseData.financeApp.budgets.categories[category].iconName;
  }

  // ########################################
  // # delete recurring bill
  // ########################################

  public openDeleteModal() {
    this.mainModalService.chooseSubModal('deleteRecurring', this.recurringBill, this.recurringIndex);
  }
}
