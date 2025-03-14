import { Component, inject } from '@angular/core';
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

  public transactionsSignal$: any = this.dataStore.transactions;
  
  ngOnInit() {
    console.log(this.transactionsSignal$());
    
  }

  // previous unfiltered transactions from data store service
  public prevTransactionsArray: any = this.transactionsSignal$();

  public categoryFilterInput: string = '';

  public sortByInput: string = '';

  public searchFieldInput: string = '';

  public setCategoryFilterInput(input: string) {
    this.categoryFilterInput = input;
  }

  public setSortByInput(input: string) {
    this.sortByInput = input;
  }



  private getTransactionsFilteredByCategories() {}

  private getSortedTransactions() {}




  public openSubModal(subModal: string, subModalObject: Object) {
    this.mainModalService.chooseSubModal(subModal, subModalObject, null);
  }
}
