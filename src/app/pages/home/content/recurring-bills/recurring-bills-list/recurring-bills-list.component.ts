import { Component, effect, inject, Input, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../../../services/api.service';
import { DataStoreServiceService } from '../../../../../services/data-store-service.service';
import { AuthenticationService } from '../../../../../services/authentication.service';
import { MainModalService } from '../../../../../services/main-modal.service';
import { SingleBillComponent } from './single-bill/single-bill.component';
import { SortbyTransactionsComponent } from '../../transactions/sortby-transactions/sortby-transactions.component';
import { SearchTransactionComponent } from '../../transactions/search-transaction/search-transaction.component';

@Component({
  selector: 'app-recurring-bills-list',
  imports: [SingleBillComponent, CommonModule, SearchTransactionComponent,SortbyTransactionsComponent],
  templateUrl: './recurring-bills-list.component.html',
  styleUrl: './recurring-bills-list.component.scss'
})
export class RecurringBillsListComponent {
  private apiService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public authService: AuthenticationService = inject(AuthenticationService);
  public mainModalService: MainModalService = inject(MainModalService);

  @Input() public recurringBillsArray$!: TransactionsObject[];

  public transactionsRecurringSignal$: Signal<any[]>  = this.dataStore.transactionsRecurring;
  public renderReadyArray: any[] = [];

  constructor() {
    effect(() => {
      let signal$ = this.transactionsRecurringSignal$();
      // this.formatTransactionsArray(signal$);
    });
  }

  // ########################################
  // # function takes the transactions array and returns it in a format that is ready to be rendered
  // ########################################
 
  public formatTransactionsArray(prevArray: any) {
    let searchedArray = this.getSearchedTransactions(prevArray);
    let sortedArray = this.getSortedTransactions(searchedArray);
    this.renderReadyArray = sortedArray;
  }

   // ########################################
  // # functions to filter the array by search field
  // ########################################

  public searchFieldInput: string = '';

  public setSearchFieldInput(input: string) {
    this.searchFieldInput = input;
    this.formatTransactionsArray(this.transactionsRecurringSignal$());
  }

  private getSearchedTransactions(prevArray: any) {
    console.log(prevArray);
    
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

  // ########################################
  // # functions to sort the array
  // ########################################

  public sortByInput: string = 'Latest';

  public setSortByInput(input: string) {
    this.sortByInput = input;
    this.formatTransactionsArray(this.transactionsRecurringSignal$());
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
}
