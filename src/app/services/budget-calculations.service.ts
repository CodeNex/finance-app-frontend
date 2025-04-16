import { Injectable } from '@angular/core';

/**
 * * * BudgetCalculationsService
 * This service is responsible for calculating the budget data in the application.
 * It uses the DataStoreService to manage the budget data
 * It returns the budget data in a format that can be used by the components
 * It uses the TransactionsObject and BudgetsObject interfaces to define the data structure
 */
@Injectable({
  providedIn: 'root',
})
export class BudgetCalculationsService {
  /**
   * @description - This function calculates the budget data for the given budget and timeframe
   * @param budget - The budget to be calculated
   * @param timeRange - The timeframe to be calculated (month, quarter, half, year)
   * @param transactions - The transactions to be calculated
   * @returns - The budget data in a format that can be used by the components
   */
  public calculateBudget(
    budget: BudgetsObject,
    timeRange: string,
    transactions: TransactionsObject[]
  ): BudgetCalculations {
    let budgetName: string = budget.name;
    let maximum: number = budget.maximum;
    let calculatedSpent: number;
    let remaining: number;
    let isTooMuchSpent: boolean;

    calculatedSpent = this.calculateCurrentSpent(
      transactions,
      this.getDateRange(timeRange),
      budget
    );
    remaining = this.calculateRemaining(budget, calculatedSpent);
    isTooMuchSpent = this.checkIfTooMuchSpent(remaining);

    return {
      budgetName,
      maximum,
      calculatedSpent,
      remaining,
      isTooMuchSpent,
    };
  }

  /**
   * * * getDateRange
   * * @param type - The timeframe type (month, quarter, half, year)
   * * @returns - The start and end date of the given timeframe
   */
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

  /**
   * @description - This function calculates the total amount spent in the given timeframe
   * @param transactions - The transactions to be calculated
   * @param timeRange - The timeframe to be calculated
   * @param budget - The budget to be calculated
   * @returns - The total amount spent in the given timeframe
   */
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

  /**
   * @description - This function calculates the remaining amount of the budget
   * @param budget - The budget to be calculated
   * @param calculatedSpent - The total amount spent in the given timeframe
   * @returns - The remaining amount of the budget
   */
  private calculateRemaining(
    budget: BudgetsObject,
    calculatedSpent: number
  ): number {
    if (budget.maximum - calculatedSpent <= 0) {
      return 0;
    } else {
      return budget.maximum - calculatedSpent;
    }
  }

  /**
   * @description - This function checks if the budget has been exceeded
   * @param remaining - The remaining amount of the budget
   * @returns - True if the budget has been exceeded, false otherwise
   */
  private checkIfTooMuchSpent(remaining: number): boolean {
    return remaining <= 0;
  }
}
