import { Component, effect, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '@services/data-store-service.service';
import { AuthenticationService } from '@services/authentication.service';
import { MainModalService } from '@services/main-modal.service';
import { CategoryfilterTransactionsComponent } from './categoryfilter-transactions/categoryfilter-transactions.component';
import { SearchTransactionComponent } from '@content/transactions/search-transaction/search-transaction.component';
import { SortbyTransactionsComponent } from '@content/transactions/sortby-transactions/sortby-transactions.component';
import { SingleTransactionComponent } from '@content/transactions/single-transaction/single-transaction.component';
import { PaginationTransactionsComponent } from '@content/transactions/pagination-transactions/pagination-transactions.component';

@Component({
  selector: 'app-transactions',
  imports: [
    CommonModule,
    SearchTransactionComponent,
    SortbyTransactionsComponent,
    CategoryfilterTransactionsComponent,
    SingleTransactionComponent,
    PaginationTransactionsComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  // #region Component Setup (DI, Outputs, Template Refs, Subscription)
  private dataStore = inject(DataStoreServiceService);
  private mainModalService = inject(MainModalService);
  public authService = inject(AuthenticationService);

  public totalSubPagesSignal = signal(0); // signal for paginantion
  public currentPageSignal = signal(1); // signal for paginantion

  public transactionsSignal: Signal<TransactionsObject[]> =
    this.dataStore.transactions;
  public renderReadyArray: any[] = [];

  public transactionsEffect = effect(() => {
    this.formatTransactionsArray(this.transactionsSignal());
  });
  // #endregion

  // ########################################
  // # function takes the transactions array and returns it in a format that is ready to be rendered
  // ########################################

  public formatTransactionsArray(prevArray: TransactionsObject[]): void {
    let arrayByCategories = this.getTransactionsFilteredByCategories(prevArray);
    let searchedArray = this.getSearchedTransactions(arrayByCategories);
    let sortedArray = this.getSortedTransactions(searchedArray);
    let splittedArray = this.splitTransactionsArray(sortedArray);
    this.settotalSubPagesSignal(splittedArray.length);
    this.renderReadyArray = splittedArray;
  }

  // ########################################
  // # functions to filter the array by category
  // ########################################

  public categoryFilterInput: string = 'All Transactions';

  public setCategoryFilterInput(input: string) {
    this.categoryFilterInput = input;
    this.formatTransactionsArray(this.transactionsSignal());
    this.setcurrentPageSignal(1);
  }

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

  // ########################################
  // # functions to filter the array by search field
  // ########################################

  public searchFieldInput: string = '';

  public setSearchFieldInput(input: string) {
    this.searchFieldInput = input;
    this.formatTransactionsArray(this.transactionsSignal());
    this.setcurrentPageSignal(1);
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

  // ########################################
  // # functions to split the array into sub arrays for pagination
  // ########################################

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

  // ########################################
  // # functions to sort the array
  // ########################################

  public sortByInput: string = 'Latest';

  public setSortByInput(input: string) {
    this.sortByInput = input;
    this.formatTransactionsArray(this.transactionsSignal());
  }

  private getSortedTransactions(prevArray: TransactionsObject[]): TransactionsObject[] {
    let array;
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

  private sortByAlphabet(array: any) {
    return array.sort((a: any, b: any) => {
      if (!a.name) return 1;
      if (!b.name) return -1;
      if (this.sortByInput === 'A to Z') return a.name.localeCompare(b.name);
      if (this.sortByInput === 'Z to A') return b.name.localeCompare(a.name);
      return;
    });
  }

  private sortByAmount(array: any) {
    return array.sort((a: any, b: any) => {
      if (a.amount == null) return 1;
      if (b.amount == null) return -1;
      if (this.sortByInput === 'Highest') return b.amount - a.amount;
      if (this.sortByInput === 'Lowest') return a.amount - b.amount;
      return;
    });
  }

  // ########################################
  // # functions to handle pagination
  // ########################################

  public settotalSubPagesSignal(value: number) {
    this.totalSubPagesSignal.set(value);
  }

  public setcurrentPageSignal(value: number) {
    this.currentPageSignal.set(value);
  }

  // ########################################
  // # open add task sub modal
  // ########################################

  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
