import { Component, effect, inject } from '@angular/core';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { CommonModule } from '@angular/common';
import { BillsSummaryComponent } from '@content/recurring-bills/bills-summary/bills-summary.component';
import { RecurringBillsListComponent } from '@content/recurring-bills/recurring-bills-list/recurring-bills-list.component';
import { AverageRecurringComponent } from '@content/recurring-bills/average-recurring/average-recurring.component';
import { AddTransactionButtonComponent } from '@src/components/add-transaction-button/add-transaction-button.component';

/**
 * * * RecurringBillsComponent
 * * This component is responsible for displaying the recurring bills section of the application.
 * * It uses the DataStoreService to get the recurring bills data and the transactions data.
 */
@Component({
  selector: 'app-recurring-bills',
  imports: [ CommonModule, BillsSummaryComponent, RecurringBillsListComponent, AverageRecurringComponent, AddTransactionButtonComponent],
  templateUrl: './recurring-bills.component.html',
  styleUrl: './recurring-bills.component.scss'
})
export class RecurringBillsComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);

  public recurringBillsArray: TransactionsObject[] = this.dataStore.transactionsRecurring();
  public transactionsArray: TransactionsObject[] = this.dataStore.transactions();
  
  public recurringBillsEffect = effect(() => {
    this.recurringBillsArray = this.dataStore.transactionsRecurring();
    this.transactionsArray = this.dataStore.transactions();
  })
  // #endregion
}
