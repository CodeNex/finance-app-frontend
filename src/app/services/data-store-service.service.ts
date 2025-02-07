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

  constructor() {}

  // save and call Balance
  setBalance(data: BalanceObject) {
    this.balance = data;
  }
  getBalance() {
    return this.balance;
  }

  // save and call Budgets
  setBudgets(data: BudgetsObject[]) {
    this.budgets = data;
  }
  getBudgets() {
    return this.budgets;
  }

  // save and call Pots
  setPots(data: PotsObject[]) {
    this.pots = data;
  }
  getPots() {
    return this.pots;
  }

  // save and call Transactions
  setTransactions(data: TransactionsObject[]) {
    this.transactions = data;
  }
  getTransactions() {
    return this.transactions;
  }
}
