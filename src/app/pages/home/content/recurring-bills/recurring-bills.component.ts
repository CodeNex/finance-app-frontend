import { Component, effect, inject } from '@angular/core';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@services/authentication.service';
import { BillsSummaryComponent } from './bills-summary/bills-summary.component';
import { RecurringBillsListComponent } from './recurring-bills-list/recurring-bills-list.component';

@Component({
  selector: 'app-recurring-bills',
  imports: [ CommonModule, BillsSummaryComponent, RecurringBillsListComponent],
  templateUrl: './recurring-bills.component.html',
  styleUrl: './recurring-bills.component.scss'
})
export class RecurringBillsComponent {

  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);

  public recurringBillsArray = this.dataStore.transactionsRecurring();
  public transactionsArray$ = this.dataStore.transactions();
  
  constructor() {
    effect(() => {
      this.recurringBillsArray = this.dataStore.transactionsRecurring();
      this.transactionsArray$ = this.dataStore.transactions();
    });
  }
}
