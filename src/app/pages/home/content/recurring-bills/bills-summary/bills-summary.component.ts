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
    const currentMonth = currentDate.getMonth(); // Mese corrente (0-11)
    const currentYear = currentDate.getFullYear(); // Anno corrente

    let upcoming = 0;
    
    // 🔹 Identificare il trimestre corrente
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3; // Trova il primo mese del trimestre (0,3,6,9)
    const quarterEndMonth = quarterStartMonth + 2; // Trova l'ultimo mese del trimestre

    // 1️⃣ Somma gli amount dei recurring bills nel mese corrente
    recurringBillsArray$.forEach(bill => {
      if (bill.amount && bill.execute_on) {
        const billDate = new Date(bill.execute_on);
        if (
          selectedTimeWindow === "monthly" &&
          billDate.getMonth() === currentMonth &&
          billDate.getFullYear() === currentYear
        ) {
          upcoming += bill.amount;
        } else if (
          selectedTimeWindow === "quarterly" &&
          billDate.getMonth() >= quarterStartMonth &&
          billDate.getMonth() <= quarterEndMonth &&
          billDate.getFullYear() === currentYear
        ) {
          let remainingOccurrences = 1;

          // Se il bill è mensile, calcoliamo quante volte ancora accadrà nel trimestre
          if (bill.recurring === "monthly") {
            const billMonth = billDate.getMonth();
            remainingOccurrences = quarterEndMonth - billMonth + 1; // Conta quante volte accadrà ancora
          }

          upcoming += bill.amount * remainingOccurrences;
        }
      }
    });

    return upcoming;
  }

  getTotalPaidAmount(transactionsArray$: TransactionsObject[], selectedTimeWindow: string): number {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Mese corrente (0-11)
    const currentYear = currentDate.getFullYear(); // Anno corrente

    let paid = 0;
    
    // 🔹 Identificare il trimestre corrente
    const quarterStartMonth = Math.floor(currentMonth / 3) * 3; // Trova il primo mese del trimestre (0,3,6,9)
    const quarterEndMonth = quarterStartMonth + 2; // Trova l'ultimo mese del trimestre

    // 2️⃣ Somma gli amount delle transazioni che hanno un recurring_id e sono nel mese corrente
    transactionsArray$.forEach(transaction => {
      if (transaction.amount && transaction.execute_on && transaction.recurring_id) {
        const transactionDate = new Date(transaction.execute_on);
        if (
          selectedTimeWindow === "monthly" &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          paid += transaction.amount;
        } else if (
          selectedTimeWindow === "quarterly" &&
          transactionDate.getMonth() >= quarterStartMonth &&
          transactionDate.getMonth() <= quarterEndMonth &&
          transactionDate.getFullYear() === currentYear
        ) {
          paid += transaction.amount;
        }
      }
    });

    return paid;
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

    console.log('Selected value:', this.selectedTimeWindow);
    this.updateCalculations();
  }
}