import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormatAmountPipe } from '@src/shared/pipes/format-amount.pipe';

import { DataStoreServiceService } from '@src/services/data-store-service.service';

@Component({
  selector: 'app-average-recurring',
  imports: [CommonModule, FormatAmountPipe],
  templateUrl: './average-recurring.component.html',
  styleUrl: './average-recurring.component.scss',
})
export class AverageRecurringComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public dataStoreService = inject(DataStoreServiceService);
  private recurrings: TransactionsObject[] = [];

  public selectedTimeWindow: string = 'monthly';
  public selectedTimeWindowName: string = 'per Month';

  public timeFrames: TimeFrame[] = [
    { name: 'per Month', value: 'monthly' },
    { name: 'per Quarter', value: 'quarterly' },
    { name: 'per Year', value: 'yearly' },
  ];

  public avrIncome: number = 0;
  public avrExpense: number = 0;

  private avrRecEffect = effect(() => {
    this.recurrings = this.dataStoreService.transactionsRecurring();
  });
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

  // #region Calculations
  private calculateAverages(): void {
    this.recurrings
      .forEach((recurring) => {
        if (recurring.amount) {
          switch (recurring.recurring) {
            case null:
              recurring.
              this.avrIncome += recurring.amount;
              break;
            case 'weekly':
              this.avrIncome += recurring.amount / 7;
              break;
            case 'twoWeeks':
              this.avrIncome += recurring.amount / 14;
              break;
            case 'monthly':
              this.avrIncome += recurring.amount / 30;
              break;
            case 'quarterly':
              this.avrIncome += recurring.amount / 91;
              break;
            case 'halfYearly':
              this.avrIncome += recurring.amount / 182;
              break;
            case 'yearly':
              this.avrIncome += recurring.amount / 365;
              break;
            default:
              break;
          }
        }
      });
  }

  // #endregion
}
