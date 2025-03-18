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
          upcoming += bill.amount;
        }
        else if (selectedTimeWindow === "quarterly" && billDate.getMonth() >= quarterStartMonth && billDate.getMonth() <= quarterEndMonth && billDate.getFullYear() === currentYear) {
          let remainingOccurrences = 1;
          if (bill.recurring === "monthly") {
            const billMonth = billDate.getMonth();
            remainingOccurrences = quarterEndMonth - billMonth + 1;
          }
          upcoming += bill.amount * remainingOccurrences;
        }
        else if (selectedTimeWindow === "yearly" && billDate.getFullYear() === currentYear) {
          let occurrences = 1;
          if (bill.recurring === "monthly") {
            occurrences = 12 - billDate.getMonth();
          } else if (bill.recurring === "quarterly") {
            occurrences = 4 - Math.floor(billDate.getMonth() / 3);
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