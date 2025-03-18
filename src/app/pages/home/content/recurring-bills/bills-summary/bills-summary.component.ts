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

  public monthDaysMapping: Record<number, number> = {
    0: 31,  // Gennaio
    1: 28,  // Febbraio (gestito separatamente per anni bisestili)
    2: 31,  // Marzo
    3: 30,  // Aprile
    4: 31,  // Maggio
    5: 30,  // Giugno
    6: 31,  // Luglio
    7: 31,  // Agosto
    8: 30,  // Settembre
    9: 31,  // Ottobre
    10: 30, // Novembre
    11: 31  // Dicembre
  };


  ngOnInit() {
    this.updateCalculations();

  }

  updateCalculations() {
    this.unformattedTotalPaid = this.getTotalPaidAmount(this.transactionsArray$, this.selectedTimeWindow);
    this.totalPaid = this.getformattedValue(this.unformattedTotalPaid);
    this.unformattedTotalUpcoming = this.getTotalUpcomingAmount(this.recurringBillsArray$, this.selectedTimeWindow);
    this.totalUpcoming = this.getformattedValue(this.unformattedTotalUpcoming);
    this.totalBillsAmount = this.getformattedValue(this.unformattedTotalPaid + this.unformattedTotalUpcoming);
  }

  getTotalUpcomingAmount(recurringBillsArray$: TransactionsObject[], selectedTimeWindow: string): number {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let upcoming = 0;

    // 🔹 Identificare il trimestre corrente
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
    const quarterEndMonth = quarterStartMonth + 2;

    recurringBillsArray$.forEach(bill => {
      if (bill.amount && bill.execute_on) {
        const billDate = new Date(bill.execute_on);

        if (selectedTimeWindow === "monthly" && billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear) {
          let occurrences = 1;

          if (bill.recurring === "weekly") {
            occurrences = this.getRemainingWeeklyOccurrences(billDate, "monthly");
          }

          upcoming += bill.amount * occurrences;
        }
        else if (selectedTimeWindow === "quarterly" && billDate.getMonth() >= quarterStartMonth && billDate.getMonth() <= quarterEndMonth && billDate.getFullYear() === currentYear) {
          let remainingOccurrences = 1;

          if (bill.recurring === "monthly") {
            const billMonth = billDate.getMonth();
            remainingOccurrences = quarterEndMonth - billMonth + 1;
          }
          else if (bill.recurring === "weekly") {
            remainingOccurrences = this.getRemainingWeeklyOccurrences(billDate, "quarterly");
          }

          upcoming += bill.amount * remainingOccurrences;
        }
        else if (selectedTimeWindow === "yearly" && billDate.getFullYear() === currentYear) {
          let occurrences = 1;

          if (bill.recurring === "monthly") {
            occurrences = 12 - billDate.getMonth();
          }
          else if (bill.recurring === "quarterly") {
            occurrences = 4 - Math.floor(billDate.getMonth() / 3);
          }
          else if (bill.recurring === "weekly") {
            occurrences = this.getRemainingWeeklyOccurrences(billDate, "yearly");
          }

          upcoming += bill.amount * occurrences;
        }
      }
    });

    return upcoming;
  }



  getTotalPaidAmount(transactionsArray$: TransactionsObject[], selectedTimeWindow: string): number {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let paid = 0;

    // 🔹 Identificare il trimestre corrente
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
    const quarterEndMonth = quarterStartMonth + 2;

    transactionsArray$.forEach(transaction => {
      if (transaction.amount && transaction.execute_on && transaction.recurring_id) {
        const transactionDate = new Date(transaction.execute_on);

        if (selectedTimeWindow === "monthly" && transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
          paid += transaction.amount;
        }
        else if (selectedTimeWindow === "quarterly" && transactionDate.getMonth() >= quarterStartMonth && transactionDate.getMonth() <= quarterEndMonth && transactionDate.getFullYear() === currentYear) {
          paid += transaction.amount;
        }
        else if (selectedTimeWindow === "yearly" && transactionDate.getFullYear() === currentYear) {
          paid += transaction.amount;
        }
      }
    });

    return paid;
  }

  // ✅ Funzione per ottenere l'ultimo giorno del mese
  private getLastDayOfMonth(year: number, month: number): number {
    if (month === 1) { // Febbraio
      return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
    }
    return this.monthDaysMapping[month];
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
    else {
      return 1; // Caso non previsto
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