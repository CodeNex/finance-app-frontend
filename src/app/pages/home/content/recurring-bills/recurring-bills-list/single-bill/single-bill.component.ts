import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '@components/icons/icons.component';

import { BasedataService } from '@services/basedata.service';
import { MainModalService } from '@services/main-modal.service';

import { FormatDatePipe } from '@src/shared/pipes/format-date.pipe';
import { FormatAmountPipe } from '@src/shared/pipes/format-amount.pipe';

/**
 * * * SingleBillComponent
 * This component is responsible for displaying a single recurring bill in the list of recurring bills.
 * It shows the bill's name, amount, due date, frequency, and icon.
 * It also provides a button to delete the bill.
 * It uses the BasedataService to get the icon name and frequency, and the MainModalService to open the delete modal.
 */
@Component({
  selector: 'app-single-bill',
  imports: [IconsComponent, CommonModule, FormatDatePipe, FormatAmountPipe],
  templateUrl: './single-bill.component.html',
  styleUrl: './single-bill.component.scss',
})
export class SingleBillComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public baseData = inject(BasedataService);
  public mainModalService = inject(MainModalService);

  @Input() public recurringBill: TransactionsObject = {
    transaction_id: 6,
    user_id: 0,
    amount: 40.0,
    budget_id: null,
    created_at: '2024-03-25T00:00:00Z',
    execute_on: '2025-03-23T00:00:00Z',
    deleted_at: null,
    recurring: 'weekly',
    recurring_id: 0,
    theme: '#cab361',
    sender: '',
    receiver: '',
    name: 'Office Rent',
    category: 'bills',
    type: 'debit',
  };

  @Input() public recurringIndex: number = -1;

  // components basic data
  public name: string = '';
  public amount: number = 0;
  public dueDate: string | null = '';
  public frequency: string = '';
  public iconBackground: string = '';
  public iconName: string = '';
  public type: string = '';
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    this.completeComponentsBasicData();
  }

  public completeComponentsBasicData(): void {
    this.name = this.recurringBill.name;
    this.amount = this.recurringBill.amount;
    this.dueDate = this.recurringBill.execute_on;
    this.type = this.recurringBill.type;
    this.iconBackground = this.recurringBill.theme;
    this.frequency = this.setRecurringFrequency(this.recurringBill.recurring);
    this.iconName = this.setCategoryIconName(this.recurringBill.category);
  }
  // #endregion

  // #region Helper Functions
  private setCategoryIconName(category: string | null): string {
    if (category === null) return 'general';
    return this.baseData.getCategoryIcon(category);
  }

  private setRecurringFrequency(recurring: string | null): string {
    if (recurring === null) return 'Monthly';
    return this.baseData.getRecurringFrequency(recurring) || 'Monthly';
  }

  public openDeleteModal(): void {
    this.mainModalService.chooseSubModal(
      'deleteRecurring',
      this.recurringBill,
      this.recurringIndex
    );
  }
  // #endregion
}
