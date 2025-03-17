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

  public totalBillsAmount: string = "";
  public totalPaid: string = "";
  public totalUpcoming: string = "";
  public selectedTimeWindow: string = "monthly";

  ngOnInit() {
    this.updateCalculations();
    
  }

  updateCalculations() {
    this.totalBillsAmount = this.getformattedValue(this.getTotalBillsAmount(this.recurringBillsArray$, this.selectedTimeWindow));
    // this.totalPaid = this.getformattedValue(this.getTotalPaidAmount(this.recurringBillsArray$));
    // this.totalUpcoming = this.getformattedValue(this.getTotalUpcomingAmount(this.recurringBillsArray$));
  }

  getTotalBillsAmount(recurringBillsArray$: TransactionsObject[], selectedTimeWindow: string): number {
    let sum = 0;
    recurringBillsArray$.forEach(bill => {
      if (bill.amount) {
        sum += bill.amount;
      }
    });
    return sum;
  }

  getTotalUpcomingAmount(recurringBillsArray: TransactionsObject[]): number {
    let sum = 0;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    recurringBillsArray.forEach(bill => {
      if (bill.execute_on) {
        const recurringDate = new Date(bill.execute_on);
        if (
          recurringDate.getMonth() === currentMonth &&
          recurringDate.getFullYear() === currentYear &&
          recurringDate > currentDate &&
          bill.amount
        ) {
          sum += bill.amount;
        }
      }
    });

    return sum;
  }

  getTotalPaidAmount(recurringBillsArray: TransactionsObject[]): number {
    let sum = 0;
    const currentDate = new Date();

    recurringBillsArray.forEach(bill => {
      if (bill.execute_on) {
        const recurringDate = new Date(bill.execute_on);
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        if (
          recurringDate.getMonth() === nextMonth.getMonth() &&
          recurringDate.getFullYear() === nextMonth.getFullYear() &&
          bill.amount
        ) {
          sum += bill.amount;
        }
      }
    });

    return sum;
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
  
    // Aggiorna i calcoli in base al valore selezionato
    // if (selectedValue === 'monthly') {
    //   this.totalBillsAmount = this.getformattedValue(this.getTotalBillsAmount(this.recurringBillsArray$));
    //   // this.totalPaid = this.getformattedValue(this.getTotalPaidAmount(this.recurringBillsArray$));
    //   // this.totalUpcoming = this.getformattedValue(this.getTotalUpcomingAmount(this.recurringBillsArray$));
    // } else if (selectedValue === 'quarterly') {
    //   this.totalBillsAmount = this.getformattedValue(this.getTotalBillsAmount(this.recurringBillsArray$) * 3);
    //   // this.totalPaid = this.getformattedValue(this.getTotalPaidAmount(this.recurringBillsArray$) * 3);
    //   // this.totalUpcoming = this.getformattedValue(this.getTotalUpcomingAmount(this.recurringBillsArray$) * 3);
    // } else if (selectedValue === 'yearly') {
    //   // Implementa la logica per il calcolo annuale
    // }
  }
}