import { Component, effect, inject, Input } from '@angular/core';
import { IconsComponent } from '../../../../../components/icons/icons.component';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../../../services/api.service';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { MainModalService } from '../../../../../services/main-modal.service';

@Component({
  selector: 'app-bills-summary',
  imports: [IconsComponent, CommonModule],
  templateUrl: './bills-summary.component.html',
  styleUrl: './bills-summary.component.scss'
})
export class BillsSummaryComponent {

  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public mainModalService: MainModalService = inject(MainModalService);

  @Input() public recurringBillsArray$!: TransactionsObject[];
  @Input() public transactionsArray$!: TransactionsObject[];

  public unformattedTotalBillsAmount: number = 0;
  public totalBillsAmount: string = "";
  public unformattedTotalPaid: number = 0;
  public totalPaid: string = "";
  public unformattedTotalUpcoming: number = 0;
  public totalUpcoming: string = "";
  public selectedTimeWindow: string = "monthly";

  public currentDate = new Date();
  public currentMonth = this.currentDate.getMonth();
  public currentYear = this.currentDate.getFullYear();



  ngOnInit() {
    this.updateCalculations();
  }

  updateCalculations() {
    if (this.selectedTimeWindow === "monthly" || this.selectedTimeWindow === "quarterly" || this.selectedTimeWindow === "yearly") {

      this.unformattedTotalPaid = this.getTotalPaidAmount(this.transactionsArray$);
      this.unformattedTotalUpcoming = this.getTotalUpcomingAmount(this.recurringBillsArray$);

    } else if (this.selectedTimeWindow === "nextMonth" || this.selectedTimeWindow === "nextThreeMonths" || this.selectedTimeWindow === "nextSixMonths") {

      this.unformattedTotalPaid = 0;
      this.unformattedTotalUpcoming = this.getFutureUpcoming(this.recurringBillsArray$);

    }
    this.totalPaid = this.getformattedValue(this.unformattedTotalPaid);
    this.totalUpcoming = this.getformattedValue(this.unformattedTotalUpcoming);
    this.totalBillsAmount = this.getformattedValue(this.unformattedTotalPaid + this.unformattedTotalUpcoming);
  }

  getTotalUpcomingAmount(recurringBillsArray$: TransactionsObject[]): number {
    let upcoming = 0;

    const { periodStartMonth, periodEndMonth } = this.definePeriodRange();
    

    recurringBillsArray$.forEach(bill => {
      const { billDate, billMonth, billYear } = this.getBillsDates(bill);

      let remainingOccurrences = this.getRemainingOccurrences(bill, billDate, billMonth, this.selectedTimeWindow, periodStartMonth, periodEndMonth);

      
      upcoming += bill.amount! * remainingOccurrences;
    });

    return upcoming;
  }

  private definePeriodRange() {
    const currentMonth = new Date().getMonth();
    let periodStartMonth = currentMonth;
    let periodEndMonth = currentMonth;
    

    if (this.selectedTimeWindow === "nextMonth") {
      periodStartMonth = currentMonth + 1;
      periodEndMonth = currentMonth + 1;
    } else if (this.selectedTimeWindow === "nextThreeMonths") {
      periodStartMonth = currentMonth + 1;
      periodEndMonth = currentMonth + 3;
    } else if (this.selectedTimeWindow === "nextSixMonths") {
      periodStartMonth = currentMonth + 1;
      periodEndMonth = currentMonth + 6;
    } else if (this.selectedTimeWindow === "quarterly") {
      periodStartMonth = Math.floor(this.currentMonth / 3) * 3;
      periodEndMonth = periodStartMonth + 2;
    }

    return { periodStartMonth, periodEndMonth };
  }

  getFutureUpcoming(recurringBillsArray$: TransactionsObject[]): number {
    const { periodStartMonth, periodEndMonth } = this.definePeriodRange();
    let upcoming = 0;

    recurringBillsArray$.forEach(bill => {
      console.log(bill);

      const { billDate, billMonth, billYear } = this.getBillsDates(bill);

      if (billYear === this.currentYear && billMonth <= periodEndMonth) {

        let occurrences = this.getFutureOccurences(bill, billDate, billMonth, this.selectedTimeWindow, periodEndMonth);

        upcoming += bill.amount! * occurrences;
      }

    });

    return upcoming;
  }

  getBillsDates(bill: TransactionsObject): { billDate: Date, billMonth: number, billYear: number } {
    const billDate: Date = new Date(bill.execute_on!);
    const billMonth = billDate.getMonth();
    const billYear = billDate.getFullYear();

    return { billDate, billMonth, billYear };
  }

  getRemainingOccurrences(bill: TransactionsObject, billDate: Date, billMonth: number, selectedTimeWindow: string, periodStartMonth: number, periodEndMonth: number): number {
    let remainingOccurrences = 0;
    if (selectedTimeWindow === "monthly" && billDate.getMonth() === this.currentMonth && billDate.getFullYear() === this.currentYear) {
      remainingOccurrences = 1;

      if (bill.recurring === "weekly") {
        remainingOccurrences = this.getRemainingWeeklyOccurrences(billDate, "monthly");
      }

     
    }
    else if (selectedTimeWindow === "quarterly" && billDate.getMonth() >= periodStartMonth && billDate.getMonth() <= periodEndMonth && billDate.getFullYear() === this.currentYear) {
      remainingOccurrences = 1;

      if (bill.recurring === "monthly") {
        // const billMonth = billDate.getMonth();
        remainingOccurrences = periodEndMonth - billMonth + 1;
      }
      else if (bill.recurring === "weekly") {
        remainingOccurrences = this.getRemainingWeeklyOccurrences(billDate, "quarterly");
      }

      
    }
    else if (selectedTimeWindow === "yearly" && billDate.getFullYear() === this.currentYear) {
      remainingOccurrences = 1;

      if (bill.recurring === "monthly") {
        remainingOccurrences = 12 - billDate.getMonth();
      }
      else if (bill.recurring === "quarterly") {
        remainingOccurrences = 4 - Math.floor(billDate.getMonth() / 3);
      }
      else if (bill.recurring === "weekly") {
        remainingOccurrences = this.getRemainingWeeklyOccurrences(billDate, "yearly");
      }


    }
    return remainingOccurrences;
  }


  getFutureOccurences(bill: TransactionsObject, billDate: Date, billMonth: number, selectedTimeWindow: string, periodEndMonth: number): number {
    let occurrences = 0;
    if (bill.recurring === "weekly") {
      occurrences = this.getRemainingWeeklyOccurrences(billDate, selectedTimeWindow) - 1;
      console.log("ID nr", bill.recurring_id, bill.recurring, "X", occurrences);
    }

    else if (bill.recurring === "monthly") {
      if (billMonth === this.currentMonth) {
        occurrences = periodEndMonth - this.currentMonth;
      } else {
        occurrences = periodEndMonth - Math.max(billMonth, this.currentMonth) + 1;
      }
      console.log("ID nr", bill.recurring_id, bill.recurring, "X", occurrences);
    }

    else if (bill.recurring === "quarterly") {
      occurrences = Math.floor((periodEndMonth - billMonth) / 3) + 1;
      console.log("ID nr", bill.recurring_id, bill.recurring, "X", occurrences);
    }

    return occurrences;
  }


  getTotalPaidAmount(transactionsArray$: TransactionsObject[]): number {
    let paid = 0;

    transactionsArray$.forEach(transaction => {
      if (transaction.amount && transaction.execute_on && transaction.recurring_id) {
        const transactionDate = new Date(transaction.execute_on);
        
        if (this.selectedTimeWindow === "monthly" && this.inCurrentMonth(transactionDate)) {
          paid += transaction.amount;
        }
        else if (this.selectedTimeWindow === "quarterly" && this.inCurrentQuarter(transactionDate)) {
          paid += transaction.amount;
        }
        else if (this.selectedTimeWindow === "yearly" && this.inCurrentYear(transactionDate)) {
          paid += transaction.amount;
        }
      }
    });

    return paid;
  }

  inCurrentMonth(transactionDate: Date): boolean {
    return transactionDate.getMonth() === this.currentMonth && transactionDate.getFullYear() === this.currentYear; 
  }
  
  inCurrentQuarter(transactionDate: Date): boolean {
    const { periodStartMonth, periodEndMonth } = this.definePeriodRange();
    return transactionDate.getMonth() >= periodStartMonth && transactionDate.getMonth() <= periodEndMonth && transactionDate.getFullYear() === this.currentYear; 
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
      11: 31
    };
    if (month === 1) { // Febbraio
      return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }
    return monthDaysMapping[month];
  }

  // ✅ Funzione aggiornata per calcolare le ricorrenze settimanali
  private getRemainingWeeklyOccurrences(billDate: Date, timeWindow: string): number {
    let startOfPeriod: Date;
    let endOfPeriod: Date;
    const currentYear = billDate.getFullYear();
    const currentMonth = billDate.getMonth();

    if (timeWindow === "monthly") {
      startOfPeriod = new Date(currentYear, currentMonth, billDate.getDate());
      const lastDayOfMonth = this.getLastDayOfMonth(currentYear, currentMonth);
      endOfPeriod = new Date(currentYear, currentMonth, lastDayOfMonth);
    }
    else if (timeWindow === "quarterly") {
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      const quarterEndMonth = quarterStartMonth + 2;
      const lastDayOfQuarter = this.getLastDayOfMonth(currentYear, quarterEndMonth);
      startOfPeriod = new Date(currentYear, currentMonth, billDate.getDate());
      endOfPeriod = new Date(currentYear, quarterEndMonth, lastDayOfQuarter);
    }
    else if (timeWindow === "yearly") {
      startOfPeriod = new Date(currentYear, currentMonth, billDate.getDate());
      endOfPeriod = new Date(currentYear, 11, 31); // Ultimo giorno dell'anno
    }
    else if (timeWindow === "nextMonth") {
      startOfPeriod = new Date(currentYear, currentMonth + 1, 1); // Inizio del mese successivo
      const lastDayNextMonth = this.getLastDayOfMonth(currentYear, currentMonth + 1);
      endOfPeriod = new Date(currentYear, currentMonth + 1, lastDayNextMonth);
    }
    else if (timeWindow === "nextThreeMonths") {
      startOfPeriod = new Date(currentYear, currentMonth + 1, 1); // Inizio del mese successivo
      const lastDayNextThreeMonths = this.getLastDayOfMonth(currentYear, currentMonth + 3);
      endOfPeriod = new Date(currentYear, currentMonth + 3, lastDayNextThreeMonths);
    }
    else if (timeWindow === "nextSixMonths") {
      startOfPeriod = new Date(currentYear, currentMonth + 1, 1); // Inizio del mese successivo
      const lastDayNextSixMonths = this.getLastDayOfMonth(currentYear, currentMonth + 6);
      endOfPeriod = new Date(currentYear, currentMonth + 6, lastDayNextSixMonths);
    }
    else {
      throw new Error("Time window not supported");
    }

    // 🔹 Calcoliamo il numero di giorni rimanenti fino alla fine del periodo
    const remainingDays = Math.ceil((endOfPeriod.getTime() - startOfPeriod.getTime()) / (1000 * 60 * 60 * 24));

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

  updateTimeWindow(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedTimeWindow = target.value;
    this.updateCalculations();
  }
}