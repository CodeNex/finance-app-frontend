import { Injectable, Signal, inject } from '@angular/core';

import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetCalculationsService {

  private dataStore = inject(DataStoreServiceService);

  public transactionsSignal: Signal<TransactionsObject[]> = this.dataStore.transactions;
  
}

// dateRange: month, quarter, half, year

//Parameter (input) 