import { Component, effect, inject, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { MainModalService } from '@services/main-modal.service';
import { SingleBillComponent } from '@content/recurring-bills/recurring-bills-list/single-bill/single-bill.component';
import { SortbyTransactionsComponent } from '@content/transactions/sortby-transactions/sortby-transactions.component';
import { SearchTransactionComponent } from '@content/transactions/search-transaction/search-transaction.component';

/**
 * * * RecurringBillsListComponent
 * This component is responsible for displaying the list of recurring bills.
 * It allows the user to search and sort the Recurring Transactions by different criteria.
 * It uses the SingleBillComponent to display each recurring bill.
 * It uses the DataStoreService to get the recurring transactions and the AuthenticationService to manage user authentication.
 * It also uses the MainModalService to open the delete modal for each recurring bill.
 * It uses the SortbyTransactionsComponent and SearchTransactionComponent to provide sorting and searching functionality.
 */
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
  /**
   * @description - This function formats the transactions array by searching and sorting it.
   * @param prevArray - The previous array of transactions.
   */
  public formatTransactionsArray(prevArray: TransactionsObject[]) {
    let searchedArray = this.getSearchedTransactions(prevArray);
    let sortedArray = this.getSortedTransactions(searchedArray);
    this.renderReadyArray = sortedArray;
  }
  // #endregion

  // #region SearchField
  public searchFieldInput: string = '';

  /**
   * @description - This function sets the input value for the search field.
   * @param input - The input value for the search field.
   */
  public setSearchFieldInput(input: string): void {
    this.searchFieldInput = input;
    this.formatTransactionsArray(this.transactionsRecurringSignal());
  }

  /**
   * @description - This function gets the searched transactions from the previous array.
   * @param prevArray - The previous array of transactions.
   * @returns - The array of searched transactions. 
   */
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

  /**
   * @description - This function checks if the search string is a subsequence of the text string.
   * @param search - The search string.
   * @param text - The text string. 
   * @returns - True if the search string is a subsequence of the text string, false otherwise. 
   */
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

  /**
   * @description - This function sets the input value for the sort by field. 
   * @param input - The input value for the sort by field.
   */
  public setSortByInput(input: string) {
    this.sortByInput = input;
    this.formatTransactionsArray(this.transactionsRecurringSignal());
  }

  /**
   * @description - This function gets the sorted transactions from the previous array. It sorts the transactions by date, alphabet, or amount.
   * @param prevArray - The previous array of transactions.
   * @returns - The array of sorted transactions. 
   */
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

  /**
   * @description - This function sorts the transactions by date. It sorts the transactions by execute_on date in ascending or descending order.
   * @param array - The array of transactions to be sorted.
   * @returns - The sorted array of transactions. 
   */
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

  /**
   * @description - This function sorts the transactions by alphabet. It sorts the transactions by name in ascending or descending order.
   * @param array - The array of transactions to be sorted. 
   * @returns - The sorted array of transactions. 
   */
  private sortByAlphabet(array: TransactionsObject[]) {
    return array.sort((a: TransactionsObject, b: TransactionsObject) => {
      if (!a.name) return 1;
      if (!b.name) return -1;
      if (this.sortByInput === 'A to Z') return a.name.localeCompare(b.name);
      if (this.sortByInput === 'Z to A') return b.name.localeCompare(a.name);
      return 0;
    });
  }

  /**
   * @description - This function sorts the transactions by amount. It sorts the transactions by amount in ascending or descending order.
   * @param array - The array of transactions to be sorted.
   * @returns - The sorted array of transactions. 
   */
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
