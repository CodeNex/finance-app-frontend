import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '../../../../services/authentication.service';
import { APIService } from '../../../../services/api.service';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { BasedataService } from '../../../../services/basedata.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTransactionService {

  private AuthenticationService: AuthenticationService = inject(AuthenticationService);
  private APIService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  private baseData: BasedataService = inject(BasedataService);
  private http: HttpClient = inject(HttpClient);

  private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;

  private currentDate: string = '';

  public getCurrentDate() {
    this.currentDate = new Date().toISOString();
    console.log(this.currentDate);
    
  }

  constructor() { 
  
  }

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
  // # Start transaction 
  // ########################################

  public startTransaction(transactionObject: any) {
    this.currentTransaction = transactionObject;
    this.getCurrentDate();
    
  }

  // ########################################
  // # POST the transaction object to the server
  // ########################################

  // response: {message: "Transaction created"} ???
  addNewTransaction(transactionObject: any) {
    const path = 'transactions';
    const body = transactionObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
    });

    this.http.post(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Transaction created') {
        }
      },
      error: (error) => {
        if (transactionObject.execute_on < this.currentDate) {
          // transactions signal array im datastore updaten
          this.dataStore.addToStoredData('transactions', transactionObject);
        }
        if (transactionObject.recurring) {
          // recurring transactions signal array im datastore updaten
          this.dataStore.addToStoredData('transactions/recurring', transactionObject);
        }
        console.log('Transaction created');
        console.error(error);
        return;
      },
    });
  }



  
}
