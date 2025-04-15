import { Injectable, Signal, inject } from '@angular/core';

import { DataStoreServiceService } from './data-store-service.service';

interface BudgetCalculations {
  calculatedSpent: number;
  remaining: number;
  isTooMuchSpent: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BudgetCalculationsService {
  private dataStore = inject(DataStoreServiceService);

  public transactionsSignal: Signal<TransactionsObject[]> =
    this.dataStore.transactions;

  public budgetCalculations: BudgetCalculations = {
    calculatedSpent: 0,
    remaining: 0,
    isTooMuchSpent: false,
  };

  public calculateBudget(
    budget: BudgetsObject,
    timeRange: string
  ): BudgetCalculations {
    this.budgetCalculations.calculatedSpent = this.calculateCurrentSpent(
      this.transactionsSignal(),
      this.getDateRange(timeRange),
      budget
    );
    this.budgetCalculations.remaining = this.calculateRemaining(budget);

    return this.budgetCalculations;
  }

  private getDateRange(type: string): { start: number; end: number } {
    const now = new Date();
    let start, end;
    switch (type) {
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0).getTime();
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        start = new Date(now.getFullYear(), quarter * 3, 1).getTime();
        end = new Date(now.getFullYear(), quarter * 3 + 3, 0).getTime();
        break;
      case 'half':
        const half = now.getMonth() < 6 ? 0 : 1;
        start = new Date(now.getFullYear(), half * 6, 1).getTime();
        end = new Date(now.getFullYear(), half * 6 + 6, 0).getTime();
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1).getTime();
        end = new Date(now.getFullYear(), 12, 0).getTime();
        break;
      default:
        throw new Error('Invalid Timeframe type');
    }
    return { start, end };
  }

  private calculateCurrentSpent(
    transactions: TransactionsObject[],
    timeRange: { start: number; end: number },
    budget: BudgetsObject
  ): number {
    let spent = 0;
    transactions.forEach((transaction: TransactionsObject) => {
      if (!transaction.execute_on) return;
      let executeDate = new Date(transaction.execute_on).getTime();
      if (
        transaction.category ===
          budget.name
            .replace(/\s+/g, '')
            .replace(/^./, (c) => c.toLowerCase()) &&
        executeDate >= timeRange.start &&
        executeDate <= timeRange.end
      ) {
        if (transaction.amount) spent += transaction.amount;
      }
    });
    return spent;
  }

  private calculateRemaining(budget: BudgetsObject): number {
    if (budget.maximum - this.budgetCalculations.calculatedSpent <= 0) {
      this.budgetCalculations.isTooMuchSpent = true;
      return 0;
    } else {
      this.budgetCalculations.isTooMuchSpent = false;
      return budget.maximum - this.budgetCalculations.calculatedSpent;
    }
  }
}
