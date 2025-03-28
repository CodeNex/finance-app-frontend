import { Injectable, inject } from '@angular/core';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTransactionService {

  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  constructor() { }

  // what kind of transaction do we have? And what has every transaction to do? 
  
  // Add New Transaction (Single Transaction) -> Transaction object is received

  // Add New Transaction (Recurring Transaction) -> Transaction object is received

  // Pots Add Money -> have to create a transaction object

  // Pots Withdraw Money -> have to create a transaction object

  //

  // after weh have a every transaction object, we have to do three things:

  // 1. POST the transaction object to the server ---> if Respones is ok, the next two steps will be exceuted
  // 2. add the transaction object to the dataStore (update transactions)
  // 3. update the balance signal object in the dataStore


  public currentTransaction: any = {
    transaction_id: 0,
    user_id: 0,
    amount: 0,
    budget_id: null,
    created_at: '2025-09-12T00:00:00Z',
    execute_on: '2025-07-26T00:00:00Z',
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


  public startTransaction(transactionObject: any) {}
}
