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
  private dataStore = inject(DataStoreServiceService);

  public recurringBillsSignal$ = this.dataStore.transactionsRecurring;
  public transactionsSignal$ = this.dataStore.transactions;

  public recurringBillsArray$: any[] = [];
  public transactionsArray$: any[] = [];

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

  constructor() {
    effect(() => {
      let signalRecurrings = this.recurringBillsSignal$();
      let signalTransactions = this.transactionsSignal$();
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.recurringBillsArray$ = this.recurringBillsSignal$();
    this.transactionsArray$ = this.transactionsSignal$();
    this.updateCalculations();
  }

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
   * @description - This function is responsible for defining the period range based on the selected time window.
   * @returns - An object containing the start and end month of the period based on the selected time window.
   */
  private definePeriodRange(): { periodStartMonth: number, periodEndMonth: number } {
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

  getFutureUpcoming(recurringBillsArray$: TransactionsObject[]): number {
    const { periodStartMonth, periodEndMonth } = this.definePeriodRange();
    let upcoming = 0;

    recurringBillsArray$.forEach((bill) => {
      if (bill.type === 'debit' && !bill.deleted_at) {
        const { billDate, billMonth, billYear } = this.getBillsDates(bill);

        if (billYear === this.currentYear && billMonth <= periodEndMonth) {
          let occurrences = this.getFutureOccurences(
            bill,
            billDate,
            billMonth,
            this.selectedTimeWindow,
            periodEndMonth
          );

          upcoming += bill.amount! * occurrences;
        }
      }
    });

    return upcoming;
  }

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

  getRemainingOccurrences(
    bill: TransactionsObject,
    billDate: Date,
    billMonth: number,
    periodStartMonth: number,
    periodEndMonth: number
  ): number {
    let remainingOccurrences = 0;
    if (
      this.selectedTimeWindow === 'monthly' &&
      this.inCurrentMonth(billDate) &&
      this.inCurrentYear(billDate)
    ) {
      remainingOccurrences = 1;

      if (bill.recurring === 'weekly') {
        remainingOccurrences = this.getRemainingWeeklyOccurrences(billDate);
      }
    } else if (
      this.selectedTimeWindow === 'quarterly' &&
      this.inCurrentQuarter(billDate) &&
      this.inCurrentYear(billDate)
    ) {
      remainingOccurrences = 1;

      if (bill.recurring === 'monthly') {
        remainingOccurrences = periodEndMonth - billMonth + 1;
      } else if (bill.recurring === 'weekly') {
        remainingOccurrences = this.getRemainingWeeklyOccurrences(billDate);
      }
    } else if (
      this.selectedTimeWindow === 'yearly' &&
      billDate.getFullYear() === this.currentYear
    ) {
      remainingOccurrences = 1;

      if (bill.recurring === 'monthly') {
        remainingOccurrences = 12 - billDate.getMonth();
      } else if (bill.recurring === 'quarterly') {
        remainingOccurrences = 4 - Math.floor(billDate.getMonth() / 3);
      } else if (bill.recurring === 'weekly') {
        remainingOccurrences = this.getRemainingWeeklyOccurrences(billDate);
      }
    }
    return remainingOccurrences;
  }

  getFutureOccurences(
    bill: TransactionsObject,
    billDate: Date,
    billMonth: number,
    selectedTimeWindow: string,
    periodEndMonth: number
  ): number {
    let occurrences = 0;
    if (bill.recurring === 'weekly') {
      occurrences = this.getRemainingWeeklyOccurrences(billDate) - 1;
    } else if (bill.recurring === 'monthly') {
      if (billMonth === this.currentMonth) {
        occurrences = periodEndMonth - this.currentMonth;
      } else {
        occurrences =
          periodEndMonth - Math.max(billMonth, this.currentMonth) + 1;
      }
    } else if (bill.recurring === 'quarterly') {
      occurrences = Math.floor((periodEndMonth - billMonth) / 3) + 1;
    }

    return occurrences;
  }

  getTotalPaidAmount(transactionsArray$: TransactionsObject[]): number {
    let paid = 0;

    transactionsArray$.forEach((transaction) => {
      if (transaction.type === 'debit' && !transaction.deleted_at) {
        if (
          transaction.amount &&
          transaction.execute_on &&
          transaction.recurring_id
        ) {
          const transactionDate = new Date(transaction.execute_on);

          if (
            this.selectedTimeWindow === 'monthly' &&
            this.inCurrentMonth(transactionDate)
          ) {
            paid += transaction.amount;
          } else if (
            this.selectedTimeWindow === 'quarterly' &&
            this.inCurrentQuarter(transactionDate)
          ) {
            paid += transaction.amount;
          } else if (
            this.selectedTimeWindow === 'yearly' &&
            this.inCurrentYear(transactionDate)
          ) {
            paid += transaction.amount;
          }
        }
      }
    });

    return paid;
  }

  inCurrentMonth(transactionDate: Date): boolean {
    return (
      transactionDate.getMonth() === this.currentMonth &&
      transactionDate.getFullYear() === this.currentYear
    );
  }

  inCurrentQuarter(transactionDate: Date): boolean {
    const { periodStartMonth, periodEndMonth } = this.definePeriodRange();
    return (
      transactionDate.getMonth() >= periodStartMonth &&
      transactionDate.getMonth() <= periodEndMonth &&
      transactionDate.getFullYear() === this.currentYear
    );
  }

  inCurrentYear(transactionDate: Date): boolean {
    return transactionDate.getFullYear() === this.currentYear;
  }

  // ✅ Funzione per ottenere l'ultimo giorno del mese
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
      // Febbraio
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
    }
    return monthDaysMapping[month];
  }

  // ✅ Funzione aggiornata per calcolare le ricorrenze settimanali
  private getRemainingWeeklyOccurrences(billDate: Date): number {
    let startOfPeriod: Date;
    let endOfPeriod: Date;
    const currentYear = billDate.getFullYear();
    const currentMonth = billDate.getMonth();

    if (this.selectedTimeWindow === 'monthly') {
      startOfPeriod = new Date(currentYear, currentMonth, billDate.getDate());
      const lastDayOfMonth = this.getLastDayOfMonth(currentYear, currentMonth);
      endOfPeriod = new Date(currentYear, currentMonth, lastDayOfMonth);
    } else if (this.selectedTimeWindow === 'quarterly') {
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      const quarterEndMonth = quarterStartMonth + 2;
      const lastDayOfQuarter = this.getLastDayOfMonth(
        currentYear,
        quarterEndMonth
      );
      startOfPeriod = new Date(currentYear, currentMonth, billDate.getDate());
      endOfPeriod = new Date(currentYear, quarterEndMonth, lastDayOfQuarter);
    } else if (this.selectedTimeWindow === 'yearly') {
      startOfPeriod = new Date(currentYear, currentMonth, billDate.getDate());
      endOfPeriod = new Date(currentYear, 11, 31); // Ultimo giorno dell'anno
    } else if (this.selectedTimeWindow === 'nextMonth') {
      startOfPeriod = new Date(currentYear, currentMonth + 1, 1); // Inizio del mese successivo
      const lastDayNextMonth = this.getLastDayOfMonth(
        currentYear,
        currentMonth + 1
      );
      endOfPeriod = new Date(currentYear, currentMonth + 1, lastDayNextMonth);
    } else if (this.selectedTimeWindow === 'nextThreeMonths') {
      startOfPeriod = new Date(currentYear, currentMonth + 1, 1); // Inizio del mese successivo
      const lastDayNextThreeMonths = this.getLastDayOfMonth(
        currentYear,
        currentMonth + 3
      );
      endOfPeriod = new Date(
        currentYear,
        currentMonth + 3,
        lastDayNextThreeMonths
      );
    } else if (this.selectedTimeWindow === 'nextSixMonths') {
      startOfPeriod = new Date(currentYear, currentMonth + 1, 1); // Inizio del mese successivo
      const lastDayNextSixMonths = this.getLastDayOfMonth(
        currentYear,
        currentMonth + 6
      );
      endOfPeriod = new Date(
        currentYear,
        currentMonth + 6,
        lastDayNextSixMonths
      );
    } else {
      throw new Error('Time window not supported');
    }

    // 🔹 Calcoliamo il numero di giorni rimanenti fino alla fine del periodo
    const remainingDays = Math.ceil(
      (endOfPeriod.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 🔹 Convertiamo i giorni rimanenti in settimane
    const remainingWeeks = Math.floor(remainingDays / 7) + 1;

    return remainingWeeks;
  }

  getformattedValue(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  updateTimeWindow(timeFrame: any) {
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
}
