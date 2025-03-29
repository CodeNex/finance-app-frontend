// new transactions - possible intervals: "weekly", "twoWeeks", "monthly", "quarterly", "halfYearly", "yearly"


import {
  Component,
  effect,
  inject,
  computed,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MainModalService } from '../../../../services/main-modal.service';
import { APIService } from '../../../../services/api.service';
import { CategoryfilterTransactionsComponent } from './categoryfilter-transactions/categoryfilter-transactions.component';
import { SearchTransactionComponent } from './search-transaction/search-transaction.component';
import { SortbyTransactionsComponent } from './sortby-transactions/sortby-transactions.component';
import { SingleTransactionComponent } from './single-transaction/single-transaction.component';
import { PaginationTransactionsComponent } from './pagination-transactions/pagination-transactions.component';
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
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  private mainModalService: MainModalService = inject(MainModalService);
  public authService: AuthenticationService = inject(AuthenticationService);

  public transactionsSignal$: Signal<any[]> = this.dataStore.transactions;
  public categoryFilterInput: string = 'All Transactions';
  public sortByInput: string = 'Latest';
  public searchFieldInput: string = '';
  public totalSubPages$ = signal(0);
  public currentPage$ = signal(1);

  public renderReadyArray: any[] = [];

  constructor() {
    effect(() => {
      let signal$ = this.transactionsSignal$();
      this.formatTransactionsArray(signal$);
    });
  }

  ngOnInit() {
  }

  // This function takes the transactions array and returns it in a format that is ready to be rendered
  public formatTransactionsArray(prevArray: any) {
    let arrayByCategories = this.getTransactionsFilteredByCategories(prevArray);
    let searchedArray = this.getSearchedTransactions(arrayByCategories);
    let sortedArray = this.getSortedTransactions(searchedArray);
    let splittedArray = this.splitTransactionsArray(sortedArray);
    this.setTotalSubPages$(splittedArray.length);
    this.renderReadyArray = splittedArray;
  }

  // These functions are used in the formatTransactionsArray function to filter and sort the transactions array
  private getTransactionsFilteredByCategories(prevArray: any) {
    if (this.categoryFilterInput === 'All Transactions') return prevArray;
    let array = prevArray.filter(
      (transactions: any) => transactions.category === this.categoryFilterInput
    );
    return array;
  }

  private getSearchedTransactions(prevArray: any) {
    if (!this.searchFieldInput || this.searchFieldInput === '') return prevArray;
    let array = prevArray.filter((transaction: any) => {
      return this.isSubsequence(this.searchFieldInput.toLowerCase().replace(/\s+/g, ''), transaction.name.toLowerCase().replace(/\s+/g, ''));
    });
    return array;
  }

  private isSubsequence(search: string, text: string): boolean {
    let searchIncludingCount: number = 0;
    let lastMatchIndex: number = -1;
    for (let i = 0; i < search.length; i++) {
      if (text.includes(search[i]) && text.indexOf(search[i], lastMatchIndex + 1) > lastMatchIndex) {
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

  private getSortedTransactions(prevArray: any) {
    let array;
    if (this.sortByInput === 'Latest' || this.sortByInput === 'Oldest' || this.sortByInput === null || this.sortByInput === '')
      array = this.sortByDate(prevArray);
    if (this.sortByInput === 'A to Z' || this.sortByInput === 'Z to A')
      array = this.sortByAlphabet(prevArray);
    if (this.sortByInput === 'Highest' || this.sortByInput === 'Lowest')
      array = this.sortByAmount(prevArray);
    return array;
  }

  private splitTransactionsArray(prevArray: any) {
    let transactionsPerPage = 7;
    let splittedArray: any[][] = [];
    for (let i = 0; i < prevArray.length; i += transactionsPerPage) {
      splittedArray.push(prevArray.slice(i, i + transactionsPerPage));
    }
    return splittedArray;
  }

  // functions to sort the array
  private sortByDate(array: any) {
    return array.sort((a: any, b: any) => {
      if (!a.execute_on) return 1;
      if (!b.execute_on) return -1;
      if (this.sortByInput === 'Latest' || this.sortByInput === null || this.sortByInput === '')
        return (
          new Date(b.execute_on).getTime() - new Date(a.execute_on).getTime()
        );
      if (this.sortByInput === 'Oldest')
        return (
          new Date(a.execute_on).getTime() - new Date(b.execute_on).getTime()
        );
      return;
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

  // functions to set inputs to filter and sort transactions
  public setCategoryFilterInput(input: string) {
    this.categoryFilterInput = input;
    this.formatTransactionsArray(this.transactionsSignal$());
    this.setCurrentPage$(1);
  }

  public setSortByInput(input: string) {
    this.sortByInput = input;
    this.formatTransactionsArray(this.transactionsSignal$());
  }

  public setSearchFieldInput(input: string) {
    this.searchFieldInput = input;
    this.formatTransactionsArray(this.transactionsSignal$());
    this.setCurrentPage$(1);
  }

  // functions to handle pagination
  public setTotalSubPages$(value: number) {
    this.totalSubPages$.set(value);
  }

  public setCurrentPage$(value: number) {
    this.currentPage$.set(value);
  }

  // open add task sub modal
  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
