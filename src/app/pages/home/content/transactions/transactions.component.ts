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
  public sortByInput: string = 'latest';
  public searchFieldInput: string = '';
  public totalSubPages$ = signal(0);
  public currentPage$ = signal(1);

  public renderReadyArray: any[] = [];

  constructor() {
    effect(() => {
      let array = this.readyToRenderTransactionsArray();
      if (array.length > 0) this.setTotalSubPages$(array.length);
    });
  }

  ngOnInit() {
    console.log(this.readyToRenderTransactionsArray());
  }

  // This is a computed property that will be recalculated whenever the transactionsSignal$ changes
  // it returns the transactions array in a format that is ready to be rendered
  public readyToRenderTransactionsArray: any = computed(() => {
    return this.formatTransactionsArray(this.transactionsSignal$());
  });

  // This function takes the transactions array and returns it in a format that is ready to be rendered
  public formatTransactionsArray(prevArray: any) {
    let arrayByCategories = this.getTransactionsFilteredByCategories(prevArray);
    let searchedArray = this.getSearchedTransactions(arrayByCategories);
    let sortedArray = this.getSortedTransactions(searchedArray);
    let splittedArray = this.splitTransactionsArray(sortedArray);
    this.renderReadyArray = splittedArray;
    return splittedArray;
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
      return this.isSubsequence(this.searchFieldInput.toLowerCase(), transaction.name.toLowerCase());
    });
    return array;
  }

  private getSortedTransactions(prevArray: any) {
    let array;
    if (this.sortByInput === 'latest' || this.sortByInput === 'oldest' || this.sortByInput === null || this.sortByInput === '')
      array = this.sortByDate(prevArray);
    if (this.sortByInput === 'aToZ' || this.sortByInput === 'zToA')
      array = this.sortByAlphabet(prevArray);
    if (this.sortByInput === 'highest' || this.sortByInput === 'lowest')
      array = this.sortByAmount(prevArray);
    return array;
  }

  private splitTransactionsArray(prevArray: any) {
    console.log(prevArray);

    let transactionsPerPage = 9;
    let splittedArray: any[][] = [];
    for (let i = 0; i < prevArray.length; i += transactionsPerPage) {
      splittedArray.push(prevArray.slice(i, i + transactionsPerPage));
    }
    return splittedArray;
  }

  private isSubsequence(search: string, text: string): boolean {
    let searchIndex = 0;
    for (let char of search) {
      if (text.includes(char)) {
        searchIndex++;
      }
    }
    if (searchIndex === search.length) {
      return true;
    } else {
      return false;
    }
  }

  // functions to sort the array
  private sortByDate(array: any) {
    return array.sort((a: any, b: any) => {
      if (!a.execute_on) return 1;
      if (!b.execute_on) return -1;
      if (this.sortByInput === 'latest' || this.sortByInput === null || this.sortByInput === '')
        return (
          new Date(b.execute_on).getTime() - new Date(a.execute_on).getTime()
        );
      if (this.sortByInput === 'oldest')
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
      if (this.sortByInput === 'aToZ') return a.name.localeCompare(b.name);
      if (this.sortByInput === 'zToA') return b.name.localeCompare(a.name);
      return;
    });
  }

  private sortByAmount(array: any) {
    return array.sort((a: any, b: any) => {
      if (a.amount == null) return 1;
      if (b.amount == null) return -1;
      if (this.sortByInput === 'highest') return b.amount - a.amount;
      if (this.sortByInput === 'lowest') return a.amount - b.amount;
      return;
    });
  }

  // functions to set inputs to filter and sort transactions
  public setCategoryFilterInput(input: string) {
    this.categoryFilterInput = input;
    this.formatTransactionsArray(this.transactionsSignal$());
  }

  public setSortByInput(input: string) {
    this.sortByInput = input;
    this.formatTransactionsArray(this.transactionsSignal$());
  }

  public setSearchFieldInput(input: string) {
    this.searchFieldInput = input;
    this.formatTransactionsArray(this.transactionsSignal$());
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
