import { Component, effect, inject, Signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsComponent } from '@components/icons/icons.component';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { CommonModule } from '@angular/common';
import { SingleTransactionComponent } from '@content/overview/transactions-summary/single-transaction/single-transaction.component';

@Component({
  selector: 'app-transactions-summary',
  imports: [
    RouterModule,
    IconsComponent,
    CommonModule,
    SingleTransactionComponent,
  ],
  templateUrl: './transactions-summary.component.html',
  styleUrl: './transactions-summary.component.scss',
})
export class TransactionsSummaryComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  public transactionsArraySignal: Signal<TransactionsObject[]> = this.dataStore.transactions;

  public readyToRenderArray: TransactionsObject[] = [];

  public transactionsSummaryEffect = effect(() => {
    this.readyToRenderArray = this.sortByDate(this.transactionsArraySignal());
  })
  // #endregion

  // #region Helper Functions
  private sortByDate(array: TransactionsObject[]): TransactionsObject[] {
    return array.sort((a: TransactionsObject, b: TransactionsObject) => {
      if (!a.execute_on) return 1;
      if (!b.execute_on) return -1;
      return (
        new Date(b.execute_on).getTime() - new Date(a.execute_on).getTime()
      );
    }).slice(0, 4);
  }
  // #endregion
}
