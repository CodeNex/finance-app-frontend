import { Component, effect, inject, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../services/authentication.service';
import { MainModalService } from '../../../../services/main-modal.service';
import { APIService } from '../../../../services/api.service';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  private mainModalService: MainModalService = inject(MainModalService);
  public authService: AuthenticationService = inject(AuthenticationService);

  public transactionsSignal$: Signal<any[]> = this.dataStore.transactions;

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
    let categoriesArray = this.getTransactionsFilteredByCategories(prevArray);
    let searchedArray = this.getSearchedTransactions(categoriesArray);
    let sortedArray = this.getSortedTransactions(searchedArray);
    let splittedArray = this.splitTransactionsArray(sortedArray);
    return splittedArray;
  }

  // These functions are used in the formatTransactionsArray function to filter and sort the transactions array
  private getTransactionsFilteredByCategories(prevArray: any) {
    if (this.categoryFilterInput === 'All Transactions') {
      return prevArray;
    }
    let array = prevArray.filter((transactions: any) => transactions.category === this.categoryFilterInput);
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
    return splittedArray;
  }

  // inputs to filter and sort transactions
  public categoryFilterInput: string = 'All Transactions';

  public sortByInput: string = '';

  public searchFieldInput: string = '';

  public setCategoryFilterInput(input: string) {
    this.categoryFilterInput = input;
  }

  public setSortByInput(input: string) {
    this.sortByInput = input;
  }

  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
