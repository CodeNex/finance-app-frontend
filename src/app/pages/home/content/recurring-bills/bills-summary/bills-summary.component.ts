import { Component, effect, inject } from '@angular/core';
import { IconsComponent } from '@components/icons/icons.component';
import { CommonModule } from '@angular/common';
import { DataStoreServiceService } from '@services/data-store-service.service';

@Component({
  selector: 'app-bills-summary',
  imports: [IconsComponent, CommonModule],
  templateUrl: './bills-summary.component.html',
  styleUrl: './bills-summary.component.scss',
})
export class BillsSummaryComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);

  public recurringBillsSignal$ = this.dataStore.transactionsRecurring;
  public transactionsSignal$ = this.dataStore.transactions;

  public recurringBillsArray$: TransactionsObject[] = [];
  public transactionsArray$: TransactionsObject[] = [];

  public unformattedTotalBillsAmount: number = 0;
  public totalBillsAmount: string = '';
  public unformattedTotalPaid: number = 0;
  public totalPaid: string = '';
  public unformattedTotalUpcoming: number = 0;
  public totalUpcoming: string = '';
  public selectedTimeWindow: string = 'monthly';
  public selectedTimeWindowName: string = 'This Month';

  public currentDate = new Date();
  public currentMonth = this.currentDate.getMonth();
  public currentYear = this.currentDate.getFullYear();

  public timeFrames: TimeFrame[] = [
    { name: 'This Month', value: 'monthly' },
    { name: 'This Quarter', value: 'quarterly' },
    { name: 'This Year', value: 'yearly' },
    { name: 'Next Month', value: 'nextMonth' },
    { name: 'Next 3 Months', value: 'nextThreeMonths' },
    { name: 'Next 6 Months', value: 'nextSixMonths' },
  ];

  public billsSummaryEffect = effect(() => {
    this.recurringBillsArray$ = this.recurringBillsSignal$();
    this.transactionsArray$ = this.transactionsSignal$();
    this.updateCalculations();
  });
  // #endregion

  // #region Helper Functions
  private getformattedValue(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  public updateTimeWindow(timeFrame: TimeFrame) {
    this.selectedTimeWindow = timeFrame.value;
    this.selectedTimeWindowName = timeFrame.name;
    this.updateCalculations();
    this.closeHideDropdown();
  }

  // boolean to control the dropdown
  public isDropDownOpen: boolean = false;

  public closeHideDropdown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }
  // #endregion

  // #region Calculations
  /**
   * * @description - This function is responsible for updating the calculations of the total paid and upcoming amounts.
   * * It checks the selected time window and calculates the total paid and upcoming amounts accordingly.
   */
  private updateCalculations(): void {
    const isCurrentPeriod = ['monthly', 'quarterly', 'yearly'].includes(
      this.selectedTimeWindow
    );
    const isFuturePeriod = [
      'nextMonth',
      'nextThreeMonths',
      'nextSixMonths',
    ].includes(this.selectedTimeWindow);

    if (isCurrentPeriod) {
      this.unformattedTotalPaid = this.getTotalPaidAmount(
        this.transactionsArray$
      );
      this.unformattedTotalUpcoming = this.getTotalUpcomingAmount(
        this.recurringBillsArray$
      );
    } else if (isFuturePeriod) {
      this.unformattedTotalPaid = 0;
      this.unformattedTotalUpcoming = this.getFutureUpcoming(
        this.recurringBillsArray$
      );
    }
    this.totalPaid = this.getformattedValue(this.unformattedTotalPaid);
    this.totalUpcoming = this.getformattedValue(this.unformattedTotalUpcoming);
    this.totalBillsAmount = this.getformattedValue(
      this.unformattedTotalPaid + this.unformattedTotalUpcoming
    );
  }

  /**
   * @description - This function is responsible for calculating the amount of total upcoming bills.
   * * It filters the recurring bills array to get only the debit transactions that are not deleted.
   * * It then calculates the total amount of upcoming bills based on the selected time window.
   * @param recurringBillsArray$ - Array of recurring bills
   * @returns - Total amount of upcoming bills
   */
  private getTotalUpcomingAmount(
    recurringBillsArray$: TransactionsObject[]
  ): number {
    const { periodStartMonth, periodEndMonth } = this.definePeriodRange();
    return recurringBillsArray$
      .filter((bill) => bill.type === 'debit' && !bill.deleted_at)
      .reduce((total, bill) => {
        const { billDate, billMonth } = this.getBillsDates(bill);
        const remainingOccurrences = this.getRemainingOccurrences(
          bill,
          billDate,
          billMonth,
          periodStartMonth,
          periodEndMonth
        );
        return total + bill.amount! * remainingOccurrences;
      }, 0);
  }

  /**
   * @description - This function is responsible for calculating the amount of future upcoming bills.
   * * It filters the recurring bills array to get only the debit transactions that are not deleted.
   * @param recurringBillsArray$ - Array of recurring bills
   * @returns - Total amount of future upcoming bills
   */
  private getFutureUpcoming(
    recurringBillsArray$: TransactionsObject[]
  ): number {
    const { periodStartMonth, periodEndMonth } = this.definePeriodRange();

    return recurringBillsArray$
      .filter(
        (bill) =>
          bill.type === 'debit' &&
          !bill.deleted_at &&
          this.getBillsDates(bill).billYear === this.currentYear &&
          this.getBillsDates(bill).billMonth <= periodEndMonth
      )
      .reduce((total, bill) => {
        const { billDate, billMonth } = this.getBillsDates(bill);
        const occurrences = this.getFutureOccurrences(
          bill,
          billDate,
          billMonth,
          this.selectedTimeWindow,
          periodEndMonth
        );
        return total + bill.amount! * occurrences;
      }, 0);
  }

  /**
   * @description - This function is responsible for calculating the total paid amount.
   * * It filters the transactions array to get only the debit transactions that are not deleted.
   * * It then calculates the total amount of paid transactions based on the selected time window.
   * @returns - Total amount of paid transactions
   */
  private getTotalPaidAmount(transactionsArray$: TransactionsObject[]): number {
    return transactionsArray$
      .filter(
        (transaction) =>
          transaction.type === 'debit' &&
          !transaction.deleted_at &&
          transaction.amount &&
          transaction.execute_on &&
          transaction.recurring_id &&
          this.isInSelectedTimeWindow(new Date(transaction.execute_on))
      )
      .reduce((total, transaction) => total + transaction.amount!, 0);
  }
  // #endregion

  // #region Time Window
  /**
   * @description - This function is responsible for defining the period range based on the selected time window.
   * @returns - An object containing the start and end month of the period based on the selected time window.
   */
  private definePeriodRange(): {
    periodStartMonth: number;
    periodEndMonth: number;
  } {
    const currentMonth = this.currentMonth;
    let periodStartMonth = currentMonth + 1;
    let periodEndMonth = currentMonth;

    switch (this.selectedTimeWindow) {
      case 'nextMonth':
        periodEndMonth = currentMonth + 1;
        break;
      case 'nextThreeMonths':
        periodEndMonth = currentMonth + 3;
        break;
      case 'nextSixMonths':
        periodEndMonth = currentMonth + 6;
        break;
      case 'quarterly':
        periodStartMonth = Math.floor(currentMonth / 3) * 3;
        periodEndMonth = periodStartMonth + 2;
        break;
      default:
        periodStartMonth = currentMonth;
        periodEndMonth = currentMonth;
    }

    return { periodStartMonth, periodEndMonth };
  }

  /**
   * @description - This function is responsible for getting the date of the bill.
   * * It extracts the date, month, and year from the bill object.
   * @param bill - The bill object to extract the date from
   * @returns - An object containing the bill date, month, and year
   */
  getBillsDates(bill: TransactionsObject): {
    billDate: Date;
    billMonth: number;
    billYear: number;
  } {
    const billDate: Date = new Date(bill.execute_on!);
    const billMonth = billDate.getMonth();
    const billYear = billDate.getFullYear();

    return { billDate, billMonth, billYear };
  }

  /**
   * @description - This function is responsible for checking if the transaction date is within the selected time window.
   * @param date - The date to check
   * @returns - A boolean indicating whether the date is in the selected time window
   */
  private isInSelectedTimeWindow(date: Date): boolean {
    switch (this.selectedTimeWindow) {
      case 'monthly':
        return this.inCurrentMonth(date);
      case 'quarterly':
        return this.inCurrentQuarter(date);
      case 'yearly':
        return this.inCurrentYear(date);
      default:
        return false;
    }
  }

  private inCurrentMonth(transactionDate: Date): boolean {
    return (
      transactionDate.getMonth() === this.currentMonth &&
      transactionDate.getFullYear() === this.currentYear
    );
  }

  private inCurrentQuarter(transactionDate: Date): boolean {
    const { periodStartMonth, periodEndMonth } = this.definePeriodRange();
    return (
      transactionDate.getMonth() >= periodStartMonth &&
      transactionDate.getMonth() <= periodEndMonth &&
      transactionDate.getFullYear() === this.currentYear
    );
  }

  private inCurrentYear(transactionDate: Date): boolean {
    return transactionDate.getFullYear() === this.currentYear;
  }

  private getLastDayOfMonth(year: number, month: number): number {
    const monthDaysMapping: Record<number, number> = {
      0: 31,
      1: 28,
      2: 31,
      3: 30,
      4: 31,
      5: 30,
      6: 31,
      7: 31,
      8: 30,
      9: 31,
      10: 30,
      11: 31,
    };
    if (month === 1) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    }
    return monthDaysMapping[month];
  }
  // #endregion

  // #region Occurrences
  /**
   * @description - This function is responsible for calculating the remaining occurrences of a bill.
   * * It checks the selected time window and calculates the remaining occurrences based on the bill's recurring type.
   * @returns - The number of remaining occurrences of the bill
   * * based on the selected time window and the bill's recurring type.
   */
  private getRemainingOccurrences(
    bill: TransactionsObject,
    billDate: Date,
    billMonth: number,
    periodStartMonth: number,
    periodEndMonth: number
  ): number {
    if (
      (this.selectedTimeWindow === 'monthly' &&
        this.inCurrentMonth(billDate) &&
        this.inCurrentYear(billDate)) ||
      (this.selectedTimeWindow === 'quarterly' &&
        this.inCurrentQuarter(billDate) &&
        this.inCurrentYear(billDate)) ||
      (this.selectedTimeWindow === 'yearly' &&
        billDate.getFullYear() === this.currentYear)
    ) {
      switch (bill.recurring) {
        case 'weekly':
          return this.getRemainingWeeklyOccurrences(billDate);
        case 'monthly':
          if (this.selectedTimeWindow === 'quarterly') {
            return periodEndMonth - billMonth + 1;
          }
          if (this.selectedTimeWindow === 'yearly') {
            return 12 - billDate.getMonth();
          }
          return 1;
        case 'quarterly':
          if (this.selectedTimeWindow === 'yearly') {
            return 4 - Math.floor(billDate.getMonth() / 3);
          }
          return 1;
        default:
          return 1;
      }
    }
    return 0;
  }

  /**
   * @description - This function is responsible for calculating the future occurrences of a bill.
   * * It checks the selected time window and calculates the future occurrences based on the bill's recurring type.
   * @returns - The number of future occurrences of the bill
   * * based on the selected time window and the bill's recurring type.
   */
  private getFutureOccurrences(
    bill: TransactionsObject,
    billDate: Date,
    billMonth: number,
    selectedTimeWindow: string,
    periodEndMonth: number
  ): number {
    switch (bill.recurring) {
      case 'weekly':
        return Math.max(this.getRemainingWeeklyOccurrences(billDate) - 1, 0);
      case 'monthly':
        const adjustedStartMonth = Math.max(billMonth, this.currentMonth);
        return Math.max(periodEndMonth - adjustedStartMonth + 1, 0);
      case 'quarterly':
        return Math.max(Math.floor((periodEndMonth - billMonth) / 3) + 1, 0);
      default:
        return 0;
    }
  }

  /**
   * @description - This function is responsible for calculating the remaining weekly occurrences of a bill.
   * * It checks the selected time window and calculates the remaining occurrences based on the bill's date.
   * @param billDate - The date of the bill
   * @returns - The number of remaining weekly occurrences of the bill
   * * based on the selected time window and the bill's recurring type.
   */
  private getRemainingWeeklyOccurrences(billDate: Date): number {
    const currentYear = billDate.getFullYear();
    const currentMonth = billDate.getMonth();
    let startOfPeriod = new Date(currentYear, currentMonth, billDate.getDate());
    let endOfPeriod: Date;

    switch (this.selectedTimeWindow) {
      case 'monthly':
        endOfPeriod = new Date(
          currentYear,
          currentMonth,
          this.getLastDayOfMonth(currentYear, currentMonth)
        );
        break;

      case 'quarterly': {
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        const quarterEndMonth = quarterStartMonth + 2;
        endOfPeriod = new Date(
          currentYear,
          quarterEndMonth,
          this.getLastDayOfMonth(currentYear, quarterEndMonth)
        );
        break;
      }

      case 'yearly':
        endOfPeriod = new Date(currentYear, 11, 31);
        break;

      case 'nextMonth':
        startOfPeriod = new Date(currentYear, currentMonth + 1, 1);
        endOfPeriod = new Date(
          currentYear,
          currentMonth + 1,
          this.getLastDayOfMonth(currentYear, currentMonth + 1)
        );
        break;

      case 'nextThreeMonths':
        startOfPeriod = new Date(currentYear, currentMonth + 1, 1);
        endOfPeriod = new Date(
          currentYear,
          currentMonth + 3,
          this.getLastDayOfMonth(currentYear, currentMonth + 3)
        );
        break;

      case 'nextSixMonths':
        startOfPeriod = new Date(currentYear, currentMonth + 1, 1);
        endOfPeriod = new Date(
          currentYear,
          currentMonth + 6,
          this.getLastDayOfMonth(currentYear, currentMonth + 6)
        );
        break;

      default:
        throw new Error('Unsupported time window');
    }

    const remainingDays = Math.ceil(
      (endOfPeriod.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24)
    );
    const remainingWeeks = Math.floor(remainingDays / 7) + 1;

    return remainingWeeks;
  }
  // #endregion
}
