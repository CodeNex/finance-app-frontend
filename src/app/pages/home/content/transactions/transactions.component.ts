import { Component, effect, inject, computed, Signal } from '@angular/core';
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
  public categoryFilterInput: string[] = ['All Transactions'];
  public sortByInput: string = '';
  public searchFieldInput: string = '';
  public totalSubPages: number = 0;
  public currentPage: number = 0;

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
    return splittedArray;
  }

  // These functions are used in the formatTransactionsArray function to filter and sort the transactions array
  private getTransactionsFilteredByCategories(prevArray: any) {
    if (
      this.categoryFilterInput[0] === 'All Transactions' &&
      this.categoryFilterInput.length === 1
    ) {
      return prevArray;
    }
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
    let array = prevArray;
    return array;
  }

  private splitTransactionsArray(prevArray: any) {
    let transactionsPerPage = 10;
    let splittedArray: any[][] = [];
    for (let i = 0; i < prevArray.length; i += transactionsPerPage) {
      splittedArray.push(prevArray.slice(i, i + transactionsPerPage));
    }
    this.setTotalSubPages(splittedArray.length);
    return splittedArray;
  }

  // functions to set inputs to filter and sort transactions
  public setCategoryFilterInput(input: string[]) {
    this.categoryFilterInput = input;
  }

  public setSortByInput(input: string) {
    this.sortByInput = input;
  }

  public setSearchFieldInput(input: string) {
    this.searchFieldInput = input;
  }

  // functions to handle pagination
  public setTotalSubPages(value: number) {
    this.totalSubPages = value;
  }

  public setCurrentPage(value: number) {
    this.currentPage = value;
  }

  // open add task sub modal
  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
