import { Component, effect, inject, Signal, signal } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { MainModalService } from '@services/main-modal.service';
import { ScreensizeService } from '@src/services/screensize.service';
import { AddTransactionButtonComponent } from '@src/components/add-transaction-button/add-transaction-button.component';
import { CategoryfilterTransactionsComponent } from './categoryfilter-transactions/categoryfilter-transactions.component';
import { SearchTransactionComponent } from '@content/transactions/search-transaction/search-transaction.component';
import { SortbyTransactionsComponent } from '@content/transactions/sortby-transactions/sortby-transactions.component';
import { SingleTransactionComponent } from '@content/transactions/single-transaction/single-transaction.component';
import { PaginationTransactionsComponent } from '@content/transactions/pagination-transactions/pagination-transactions.component';

/**
 * * * * TransactionsComponent
 * This component is responsible for displaying the transactions page.
 * It allows the user to view, filter, and sort transactions.
 * It uses the DataStoreServiceService to manage the state of the transactions and the MainModalService to manage modals.
 * It also uses the AuthenticationService to manage user authentication.
 */
@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    SearchTransactionComponent,
    SortbyTransactionsComponent,
    CategoryfilterTransactionsComponent,
    SingleTransactionComponent,
    PaginationTransactionsComponent,
    AddTransactionButtonComponent,
    AsyncPipe
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);
  private mainModalService = inject(MainModalService);
  public authService = inject(AuthenticationService);

  private screensizeService = inject(ScreensizeService);
  public isHandset: Observable<boolean> = this.screensizeService.isHandset$; 

  public totalSubPagesSignal = signal(0); // signal for paginantion
  public currentPageSignal = signal(1); // signal for paginantion

  public transactionsSignal: Signal<TransactionsObject[]> =
    this.dataStore.transactions;
  public renderReadyArray: any[] = [];

  public transactionsEffect = effect(() => {
    this.formatTransactionsArray(this.transactionsSignal());
  });
  // #endregion

  // #region Helper Functions
  /**
   * @description - This function is responsible for setting the total sub pages signal.
   * @param value - The value to be set for the total sub pages signal.
   */
  private setTotalSubPagesSignal(value: number): void {
    this.totalSubPagesSignal.set(value);
  }

  /**
   * @description - This function is responsible for setting the current page signal.
   * @param value - The value to be set for the current page signal.
   */
  public setCurrentPageSignal(value: number): void {
    this.currentPageSignal.set(value);
  }

  /**
   * @description - This function is responsible for opening the sub modal.
   * It uses the MainModalService to open the sub modal and pass the object to it.
   * @param subModal - The name of the sub modal to be opened.
   * @param subModalObject - The object to be passed to the sub modal.
   */
  public openSubModal(subModal: string, subModalObject: Object = {}): void {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
  // #endregion

  // #region Format & Sorting Transactions Array
  /**
   * @description - This function is responsible for formatting the transactions array.
   * It filters the transactions by category, searches for transactions by name,
   * sorts the transactions by date, and splits the transactions into sub arrays for pagination.
   * @param prevArray - The array of transactions to be formatted.
   */
  public formatTransactionsArray(prevArray: TransactionsObject[]): void {
    let arrayByCategories = this.getTransactionsFilteredByCategories(prevArray);
    let searchedArray = this.getSearchedTransactions(arrayByCategories);
    let sortedArray = this.getSortedTransactions(searchedArray);
    let splittedArray = this.splitTransactionsArray(sortedArray);
    this.setTotalSubPagesSignal(splittedArray.length);
    this.renderReadyArray = splittedArray;
  }

  // functions to filter the array by category
  public categoryFilterInput: string = 'All Transactions';

  /**
   * @description - This function is responsible for setting the category filter input.
   * It sets the category filter input to the given value and formats the transactions array.
   * @param input - The input value to be set for the category filter.
   */
  public setCategoryFilterInput(input: string): void {
    this.categoryFilterInput = input;
    this.formatTransactionsArray(this.transactionsSignal());
    this.setCurrentPageSignal(1);
  }

  /**
   * @description - This function is responsible for getting the transactions filtered by categories.
   * @param prevArray - The array of transactions to be filtered by category.
   * @returns - The filtered array of transactions.
   */
  private getTransactionsFilteredByCategories(
    prevArray: TransactionsObject[]
  ): TransactionsObject[] {
    if (this.categoryFilterInput === 'All Transactions') return prevArray;
    let array = prevArray.filter(
      (transactions: TransactionsObject) =>
        transactions.category === this.categoryFilterInput
    );
    return array;
  }

  // functions to filter the array by search field
  public searchFieldInput: string = '';

  /**
   * @description - This function is responsible for setting the search field input.
   * It sets the search field input to the given value and formats the transactions array.
   * @param input - The input value to be set for the search field.
   */
  public setSearchFieldInput(input: string) {
    this.searchFieldInput = input;
    this.formatTransactionsArray(this.transactionsSignal());
    this.setCurrentPageSignal(1);
  }

  /**
   * @description - This function is responsible for getting the transactions filtered by search field.
   * @param prevArray - The array of transactions to be filtered by search field.
   * @returns - The filtered array of transactions.
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
   * @description - This function is responsible for checking if the search string is a subsequence of the text string.
   * @param search - The search string to be checked.
   * @param text - The text string to be checked against.
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

  /**
   * @description - This function is responsible for splitting the transactions array into sub arrays for pagination.
   * @param prevArray - The array of transactions to be split into sub arrays.
   * @returns - The splitted array of transactions.
   */
  private splitTransactionsArray(
    prevArray: TransactionsObject[]
  ): TransactionsObject[][] {
    let transactionsPerPage = 7;
    let splittedArray: TransactionsObject[][] = [];
    for (let i = 0; i < prevArray.length; i += transactionsPerPage) {
      splittedArray.push(prevArray.slice(i, i + transactionsPerPage));
    }
    return splittedArray;
  }

  // functions to sort the array
  public sortByInput: string = 'Latest';

  /**
   * @description - This function is responsible for setting the sort by input.
   * It sets the sort by input to the given value and formats the transactions array.
   * @param input - The input value to be set for the sort by input.
   */
  public setSortByInput(input: string) {
    this.sortByInput = input;
    this.formatTransactionsArray(this.transactionsSignal());
  }

  /**
   * @description - This function is responsible for getting the transactions sorted by the given input.
   * @param prevArray - The array of transactions to be sorted.
   * @returns - The sorted array of transactions.
   */
  private getSortedTransactions(
    prevArray: TransactionsObject[]
  ): TransactionsObject[] {
    let array: TransactionsObject[] = prevArray;
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
   * @description - This function is responsible for sorting the transactions array by date.
   * @param array - The array of transactions to be sorted by date.
   * @returns - The sorted array of transactions.
   */
  private sortByDate(array: TransactionsObject[]): TransactionsObject[] {
    return array.sort((a, b) => {
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
   * @description - This function is responsible for sorting the transactions array by name.
   * @param array - The array of transactions to be sorted by name.
   * @returns - The sorted array of transactions.
   */
  private sortByAlphabet(array: TransactionsObject[]): TransactionsObject[] {
    return array.sort((a, b) => {
      if (!a.name) return 1;
      if (!b.name) return -1;
      if (this.sortByInput === 'A to Z') return a.name.localeCompare(b.name);
      if (this.sortByInput === 'Z to A') return b.name.localeCompare(a.name);
      return 0;
    });
  }

  /**
   * @description - This function is responsible for sorting the transactions array by amount.
   * @param array - The array of transactions to be sorted by amount.
   * @returns - The sorted array of transactions.
   */
  private sortByAmount(array: TransactionsObject[]): TransactionsObject[] {
    return array.sort((a, b) => {
      if (a.amount == null) return 1;
      if (b.amount == null) return -1;
      if (this.sortByInput === 'Highest') return b.amount - a.amount;
      if (this.sortByInput === 'Lowest') return a.amount - b.amount;
      return 0;
    });
  }
  // #endregion
}
