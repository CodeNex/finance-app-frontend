import { Component, inject, Signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '@components/icons/icons.component';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { FormatAmountPipe } from '@src/shared/pipes/format-amount.pipe';

/**
 * * * BalanceComponent
 * * This component is responsible for displaying the balance overview of the user.
 * * It shows the total balance, income, and expenses for a selected time frame.
 * * It uses the DataStoreService to get the balance and transactions data.
 * * It also provides a dropdown to select the time frame for the income and expenses calculations.
 */
@Component({
  selector: 'app-balance',
  imports: [CommonModule, IconsComponent, FormatAmountPipe],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
})
export class BalanceComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public dataStore = inject(DataStoreServiceService);

  public balanceSignal: Signal<BalanceObject> = this.dataStore.balance;
  public transactionsSignal: Signal<TransactionsObject[]> =
    this.dataStore.transactions;

  public balance: number = this.balanceSignal().balance;
  public income: number = 0;
  public expenses: number = 0;

  public balanceEffect = effect(() => {
    this.balance = this.balanceSignal().balance;
    this.getTimeBasedIncomeAndExpenses(this.selectedTimeFrame.value);
  });

  // #endregion

  // #region Helper Functions
  private getCurrentDate(): string {
    return new Date().toISOString();
  }

  private getSubstractedDate(currentDate: string, days: number | null): string {
    if (days === null) return currentDate;
    const date = new Date(currentDate);
    const msPerDay = 24 * 60 * 60 * 1000;
    date.setTime(date.getTime() - days * msPerDay);
    return date.toISOString();
  }
  // #endregion

  // #region Timeframe Dropdown
  public isDropDownOpen: boolean = false;

  public openCloseDropdown(): void {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  public timeFrames: { [key: string]: { name: string; value: number | null } } =
    {
      week: { name: 'Week', value: 7 },
      '2weeks': { name: '2 Weeks', value: 14 },
      '30days': { name: 'Month', value: 30 },
      '60days': { name: '2 Months', value: 60 },
      '90days': { name: '3 Months', value: 90 },
      halfYear: { name: '6 Months', value: 182 },
      all: { name: 'All time', value: null },
    };

  public renderableTimesFrames = Object.values(this.timeFrames);

  public selectedTimeFrame: { name: string; value: number | null } =
    this.timeFrames['30days'];

  public selectTimeFrame(type: { name: string; value: number | null }): void {
    this.selectedTimeFrame = type;
    this.getTimeBasedIncomeAndExpenses(type.value);
    this.openCloseDropdown();
  }
  // #endregion

  // #region Calculations
  public getTimeBasedIncomeAndExpenses(timeFrame: number | null = null): void {
    let currentDate = this.getCurrentDate();
    let oldestDate = this.getSubstractedDate(currentDate, timeFrame);
    let income = 0;
    let expenses = 0;

    if (timeFrame === null) {
      this.transactionsSignal().forEach((transaction: TransactionsObject) => {
        if (transaction.type === 'debit') {
          expenses += transaction.amount;
        } else {
          income += transaction.amount;
        }
      });
    } else {
      this.transactionsSignal().forEach((transaction: TransactionsObject) => {
        if (
          transaction.execute_on &&
          transaction.execute_on <= currentDate &&
          transaction.execute_on >= oldestDate
        ) {
          if (transaction.type === 'debit') {
            expenses += transaction.amount;
          } else {
            income += transaction.amount;
          }
        }
      });
    }
    this.income = income;
    this.expenses = expenses;
  }
  // #endregion
}
