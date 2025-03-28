import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '../../../../services/authentication.service';
import { APIService } from '../../../../services/api.service';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTransactionService {

  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private APIService: APIService = inject(APIService);
  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  private currentDate: string = '';

  public getCurrentDate() {
    return new Date().toISOString().split('T')[0];
  }

  constructor() {}

  // what kind of transaction do we have? And what has every transaction to do? 
  
  // Add New Transaction (Single Transaction) -> Transaction object is received  || Type: 'single'

  // Add New Transaction (Recurring Transaction) -> Transaction object is received  || Type: 'recurring'

  // Pots Add Money -> have to create a transaction object  || Type: 'potAdd'

  // Pots Withdraw Money -> have to create a transaction object  || Type: 'potWithdraw'

  //

  // after weh have a every transaction object, we have to do three things:

  // 1. POST the transaction object to the server ---> if Respones is ok, the next two steps will be exceuted
  // 2. add the transaction object to the dataStore (update transactions)
  // 3. update the balance signal object in the dataStore

  // blueprint for transaction object
  public currentTransaction: any = {
    transaction_id: 0,
    user_id: 0,
    amount: 0,
    budget_id: null,
    created_at: null,
    execute_on: null,
    deleted_at: null,
    recurring: null,
    recurring_id: null,
    theme: '',
    sender: '',
    receiver: '',
    name: '',
    category: 'general',
    type: 'debit',
  };

  // ########################################
  // # start transaction from transactions.component
  // ########################################

  public startTransactionFromTransactions(transactionObject: any, type: string) {
    this.currentTransaction = transactionObject;
    if (type === 'single') {
      this.startSingleTransaction();
    };
    if (type === 'recurring') {
      this.startRecurringTransaction();
    };
  }

  private startSingleTransaction() {
    // 1. POST the transaction object to the server
    // 2. add the transaction object to the dataStore (update transactions)
  }

  private startRecurringTransaction() {}

  // ########################################
  // # start transaction from pots.component
  // ########################################

  public startTransactionFromPots(transactionObject: any, type: string) {
    if (type === 'potAdd') this.mergePotAddTransaction(transactionObject);
    if (type === 'potWithdraw') this.mergePotWithdrawTransaction(transactionObject);
  }

  // ########################################
  // # merge and overwrite currentTransaction
  // ########################################

  // private mergeSingleTransaction(transactionObject: any) {
  //   console.log(transactionObject);
    
  // }

  // private mergeRecurringTransaction(transactionObject: any) {
  //   console.log(transactionObject);
    
  // }

  private mergePotAddTransaction(transactionObject: any) {
    console.log(transactionObject);
    
  }

  private mergePotWithdrawTransaction(transactionObject: any) {
    console.log(transactionObject);
    
  }


  
}
