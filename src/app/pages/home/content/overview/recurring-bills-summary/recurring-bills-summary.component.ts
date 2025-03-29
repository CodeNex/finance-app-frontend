import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APIService } from '../../../../../services/api.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { BillsSummaryComponent } from '../../recurring-bills/bills-summary/bills-summary.component';

@Component({
  selector: 'app-recurring-bills-summary',
  imports: [ RouterModule, BillsSummaryComponent],
  templateUrl: './recurring-bills-summary.component.html',
  styleUrl: './recurring-bills-summary.component.scss'
})
export class RecurringBillsSummaryComponent implements OnInit {
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public apiService: APIService = inject(APIService);

  public recurringBillsArray : any = this.dataStore.transactionsRecurring;

  public totalPaid: string = "";
  public totalUpcoming: string = "";
  public dueSoon: string = "";

  @Input() inWhichSection: string = "";

  constructor() {
    effect(() => {
      let recurringBillsSignal = this.recurringBillsArray();
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.totalPaid = this.getformattedValue(this.getTotalPaidAmount(this.recurringBillsArray())) ;
    this.totalUpcoming = this.getformattedValue(this.getTotalUpcomingAmount(this.recurringBillsArray()));
    this.dueSoon = this.getformattedValue(this.getDueSoonAmount(this.recurringBillsArray()));
  }

  getDueSoonAmount(recurringBillsArray: testRecurringTransactionsObject[]): number {
    let sum = 0;
    const currentDate = new Date();
    const nextWeekDate = new Date();
    nextWeekDate.setDate(currentDate.getDate() + 7);

    recurringBillsArray.forEach(bill => {
      if (bill.execute_on) {
        const recurringDate = new Date(bill.execute_on);
        if (recurringDate > currentDate && recurringDate <= nextWeekDate && bill.amount) {
          sum += bill.amount;
        }
      }
    });

    return sum;
  }

  getTotalUpcomingAmount(recurringBillsArray: testRecurringTransactionsObject[]): number {
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

  getTotalPaidAmount(recurringBillsArray: testRecurringTransactionsObject[]): number {
    let sum = 0;
    const currentDate = new Date();

    recurringBillsArray.forEach(bill => {
      if (bill.execute_on) {
        const recurringDate = new Date(bill.execute_on);
        if (recurringDate < currentDate && bill.amount) {
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
}
