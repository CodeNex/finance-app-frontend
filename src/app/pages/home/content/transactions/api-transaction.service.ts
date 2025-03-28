import { Injectable, inject } from '@angular/core';

import { DataStoreServiceService } from '../../../../services/data-store-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiTransactionService {

  public dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  constructor() { }

  // was muss welche transaction machen?  
  
  // Add New Transaction (Single Transaction) -> Transaction object is received

  // Add New Transaction (Recurring Transaction) -> Transaction object is received

  // Pots Add Money -> have to create a transaction object

  // Pots Withdraw Money -> have to create a transaction object

  // after weh have a every transaction object, we have to do three things:

  // 1. POST the transaction object to the server ---> if Respones is ok, the next two steps will be exceuted
  // 2. add the transaction object to the dataStore (update transactions)


  public startTransaction() {}
}
