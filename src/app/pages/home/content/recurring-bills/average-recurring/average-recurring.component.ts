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
    this.getAverages();
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
    this.getAverages();
    this.toggleDropDown();
  }
  // #endregion

  // #region Calculations
  private avrDailyIncome: number = 0;
  private avrDailyExpense: number = 0;

  private calculateDailyAverages(): void {
    this.avrDailyIncome = 0;
    this.avrDailyExpense = 0;

    this.recurrings.forEach((recurring) => {
      if (recurring.amount) {
        switch (recurring.recurring) {
          case null:
            recurring.type === 'credit'
              ? (this.avrDailyIncome += recurring.amount)
              : (this.avrDailyExpense += recurring.amount);
            break;
          case 'weekly':
            recurring.type === 'credit'
              ? (this.avrDailyIncome += recurring.amount / 7)
              : (this.avrDailyExpense += recurring.amount / 7);
            break;
          case 'twoWeeks':
            recurring.type === 'credit'
              ? (this.avrDailyIncome += recurring.amount / 14)
              : (this.avrDailyExpense += recurring.amount / 14);
            break;
          case 'monthly':
            recurring.type === 'credit'
              ? (this.avrDailyIncome += recurring.amount / 30)
              : (this.avrDailyExpense += recurring.amount / 30);
            break;
          case 'quarterly':
            recurring.type === 'credit'
              ? (this.avrDailyIncome += recurring.amount / 91)
              : (this.avrDailyExpense += recurring.amount / 91);
            break;
          case 'halfYearly':
            recurring.type === 'credit'
              ? (this.avrDailyIncome += recurring.amount / 182)
              : (this.avrDailyExpense += recurring.amount / 182);
            break;
          case 'yearly':
            recurring.type === 'credit'
              ? (this.avrDailyIncome += recurring.amount / 365)
              : (this.avrDailyExpense += recurring.amount / 365);
            break;
          default:
            break;
        }
      }
    });
  }

  private getAverages(): void {

    this.calculateDailyAverages();

    switch (this.selectedTimeWindow) {
      case 'monthly':
        this.avrIncome = this.avrDailyIncome * 30;
        this.avrExpense = this.avrDailyExpense * 30;
        break;
      case 'quarterly':
        this.avrIncome = this.avrDailyIncome * 91;
        this.avrExpense = this.avrDailyExpense * 91;
        break;
      case 'yearly':
        this.avrIncome = this.avrDailyIncome * 365;
        this.avrExpense = this.avrDailyExpense * 365;
        break;
      default:
        break;
    }
  }
  // #endregion
}
