import { Injectable, Signal, inject } from '@angular/core';

import { DataStoreServiceService } from './data-store-service.service';

interface CalculatedBudget {
  calculatedSpent: number;
  remaining: number;
  isTooMuchSpent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetCalculationsService {

  private dataStore = inject(DataStoreServiceService);

  public transactionsSignal: Signal<TransactionsObject[]> = this.dataStore.transactions;

  public calculatedBudget: CalculatedBudget = {
    calculatedSpent: 0,
    remaining: 0,
    isTooMuchSpent: false
  }
  
  public calculateBudget(budget: BudgetsObject, timeRange: string): CalculatedBudget {

    return this.calculatedBudget;
  }

}

// dateRange: month, quarter, half, year

//Parameter (input) 

