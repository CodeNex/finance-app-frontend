import { Component, effect, inject, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { MainModalService } from '@services/main-modal.service';
import { SingleBillComponent } from '@content/recurring-bills/recurring-bills-list/single-bill/single-bill.component';
import { SortbyTransactionsComponent } from '@content/transactions/sortby-transactions/sortby-transactions.component';
import { SearchTransactionComponent } from '@content/transactions/search-transaction/search-transaction.component';

@Component({
  selector: 'app-recurring-bills-list',
  imports: [
    SingleBillComponent,
    CommonModule,
    SearchTransactionComponent,
    SortbyTransactionsComponent,
  ],
  templateUrl: './recurring-bills-list.component.html',
  styleUrl: './recurring-bills-list.component.scss',
})
export class RecurringBillsListComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  public dataStore = inject(DataStoreServiceService);
  public authService = inject(AuthenticationService);
  public mainModalService = inject(MainModalService);

  @Input() public recurringBillsArray: TransactionsObject[] = [];

  public transactionsRecurringSignal: Signal<TransactionsObject[]> =
    this.dataStore.transactionsRecurring;
  public renderReadyArray: TransactionsObject[] = [];

  public recurringBillsListEffect = effect(() =>
    this.formatTransactionsArray(this.transactionsRecurringSignal())
  );
  // #endregion

  // #region Format Transactions Array
  public formatTransactionsArray(prevArray: TransactionsObject[]) {
    let searchedArray = this.getSearchedTransactions(prevArray);
    let sortedArray = this.getSortedTransactions(searchedArray);
    this.renderReadyArray = sortedArray;
  }
  // #endregion

  // #region SearchField
  public searchFieldInput: string = '';

  public setSearchFieldInput(input: string): void {
    this.searchFieldInput = input;
    this.formatTransactionsArray(this.transactionsRecurringSignal());
  }

  private getSearchedTransactions(
    prevArray: TransactionsObject[]
  ): TransactionsObject[] {
    if (!this.searchFieldInput || this.searchFieldInput === '')
      return prevArray;
    let array = prevArray.filter((transaction: TransactionsObject) => {
      return this.isSubsequence(
        this.searchFieldInput.toLowerCase().replace(/\s+/g, ''),
        transaction.name.toLowerCase().replace(/\s+/g, '')
      );
    });
    return array;
  }

  private isSubsequence(search: string, text: string): boolean {
    let searchIncludingCount: number = 0;
    let lastMatchIndex: number = -1;
    for (let i = 0; i < search.length; i++) {
      if (
        text.includes(search[i]) &&
        text.indexOf(search[i], lastMatchIndex + 1) > lastMatchIndex
      ) {
        lastMatchIndex = text.indexOf(search[i]);
        searchIncludingCount++;
      }
    }
    if (searchIncludingCount === search.length) {
      return true;
    } else {
      return false;
    }
  }
  // #endregion

  // #region SortBy
  public sortByInput: string = 'Latest';

  public setSortByInput(input: string) {
    this.sortByInput = input;
    this.formatTransactionsArray(this.transactionsRecurringSignal());
  }

  private getSortedTransactions(
    prevArray: TransactionsObject[]
  ): TransactionsObject[] {
    let array: TransactionsObject[] = [];
    if (
      this.sortByInput === 'Latest' ||
      this.sortByInput === 'Oldest' ||
      this.sortByInput === null ||
      this.sortByInput === ''
    )
      array = this.sortByDate(prevArray);
    if (this.sortByInput === 'A to Z' || this.sortByInput === 'Z to A')
      array = this.sortByAlphabet(prevArray);
    if (this.sortByInput === 'Highest' || this.sortByInput === 'Lowest')
      array = this.sortByAmount(prevArray);
    return array;
  }

  private sortByDate(array: TransactionsObject[]): TransactionsObject[] {
    return array.sort((a: TransactionsObject, b: TransactionsObject) => {
      if (!a.execute_on) return 1;
      if (!b.execute_on) return -1;
      if (
        this.sortByInput === 'Latest' ||
        this.sortByInput === null ||
        this.sortByInput === ''
      )
        return (
          new Date(b.execute_on).getTime() - new Date(a.execute_on).getTime()
        );
      if (this.sortByInput === 'Oldest')
        return (
          new Date(a.execute_on).getTime() - new Date(b.execute_on).getTime()
        );
      return 0;
    });
  }

  private sortByAlphabet(array: TransactionsObject[]) {
    return array.sort((a: TransactionsObject, b: TransactionsObject) => {
      if (!a.name) return 1;
      if (!b.name) return -1;
      if (this.sortByInput === 'A to Z') return a.name.localeCompare(b.name);
      if (this.sortByInput === 'Z to A') return b.name.localeCompare(a.name);
      return 0;
    });
  }

  private sortByAmount(array: TransactionsObject[]) {
    return array.sort((a: TransactionsObject, b: TransactionsObject) => {
      if (a.amount == null) return 1;
      if (b.amount == null) return -1;
      if (this.sortByInput === 'Highest') return b.amount - a.amount;
      if (this.sortByInput === 'Lowest') return a.amount - b.amount;
      return 0;
    });
  }
  // #endregion
}
