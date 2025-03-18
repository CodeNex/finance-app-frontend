import { Component, effect, inject, computed, Signal, signal } from '@angular/core';
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
    PaginationTransactionsComponent
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
      if (array.length > 0) this.setTotalSubPages$(array.length);;
    })
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
    let array = prevArray;
    return array;
  }

  private getSortedTransactions(prevArray: any) {
    let array;
    if (this.sortByInput === 'latest') array = this.sortByLatest(prevArray);
    if (this.sortByInput === 'oldest') array = this.sortByOldest(prevArray);
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
  private sortByLatest(array: any) {
    return array.sort((a: any, b: any) => {
      if (!a.execute_on) return 1; 
      if (!b.execute_on) return -1;
      return new Date(b.execute_on).getTime() - new Date(a.execute_on).getTime();
    });
  }

  private sortByOldest(array: any) {
    return array.sort((a: any, b: any) => {
      if (!a.execute_on) return 1; 
      if (!b.execute_on) return -1;
      return new Date(a.execute_on).getTime() - new Date(b.execute_on).getTime();
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
