import { Injectable } from '@angular/core';
import '../shared/interfaces.ts';

@Injectable({
  providedIn: 'root',
})
export class DataStoreServiceService {
  public balance: BalanceObject = {
    current: 0,
    income: 0,
    expenses: 0,
  };
  public budgets: BudgetsObject[] = [];
  public pots: PotsObject[] = [];
  public transactions: TransactionsObject[] = [];
  public transactionsRecurring: TransactionsObject[] = [];

  constructor() {}

  getStoredData(endpoint: string) {
    if (endpoint === 'balance') return this.balance;
    if (endpoint === 'budgets') return this.budgets;
    if (endpoint === 'pots') return this.pots;
    if (endpoint === 'transactions') return this.transactions; 
    if (endpoint === 'transactions/recurring') return this.transactionsRecurring;
    return;
  }

  setStoredData(endpoint: string, data: any) {
    if (endpoint === 'balance') this.balance = data;
    if (endpoint === 'budgets') this.budgets = data;
    if (endpoint === 'pots') this.pots = data;
    if (endpoint === 'transactions') this.transactions = data;
    if (endpoint === 'transactions/recurring') this.transactionsRecurring = data;
  }
}
