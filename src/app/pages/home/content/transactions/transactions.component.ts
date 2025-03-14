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
  public readyToRenderTransactionsArray: any = computed(() => {
    return this.formatTransactionsArray(this.transactionsSignal$());
  });

  public formatTransactionsArray(prevArray: any) {
    let categoriesArray = this.getTransactionsFilteredByCategories(prevArray);
    let searchedArray = this.getSearchedTransactions(categoriesArray);
    let sortedArray = this.getSortedTransactions(searchedArray);
    let splittedArray = this.splitTransactionsArray(sortedArray);

    return splittedArray;
  }

  private getTransactionsFilteredByCategories(prevArray: any) {
    let array = prevArray;
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
    let array = prevArray;
    return array;
  }

 
  // inputs to filter and sort transactions
  public categoryFilterInput: string = '';

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
