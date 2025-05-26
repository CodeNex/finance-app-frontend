import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormatAmountPipe } from '@src/shared/pipes/format-amount.pipe';

import { DataStoreServiceService } from '@src/services/data-store-service.service';

@Component({
  selector: 'app-average-recurring',
  imports: [CommonModule, FormatAmountPipe],
  templateUrl: './average-recurring.component.html',
  styleUrl: './average-recurring.component.scss'
})
export class AverageRecurringComponent {
// #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public dataStoreService = inject(DataStoreServiceService);
  private recurrings: TransactionsObject[] = this.dataStoreService.transactionsRecurring();

  public selectedTimeWindow: string = 'monthly';
  public selectedTimeWindowName: string = 'per Month';

  public timeFrames: TimeFrame[] = [
    { name: 'per Month', value: 'monthly' },
    { name: 'per Quarter', value: 'quarterly' },
    { name: 'per Year', value: 'yearly' },
  ];

  public avrIncome: number = 0;
  public avrExpense: number = 0;

  private avrRecEffect = effect(() => {})
// #endregion

// #region Helper Functions
  public isDropDownOpen: boolean = false;

  public toggleDropDown(): void {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  public updateTimeWindow(timeFrame: TimeFrame) {
    this.selectedTimeWindow = timeFrame.value;
    this.selectedTimeWindowName = timeFrame.name;
    this.toggleDropDown();
  }
// #endregion

}
