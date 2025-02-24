import { Injectable, signal } from '@angular/core';
import '../shared/interfaces.ts';

@Injectable({
  providedIn: 'root',
})
export class DataStoreServiceService {
  public balance = signal<BalanceObject>({
    id: 1,
    current: 0.0,
    income: 3250.0,
    expenses: 2188.0,
  });

  public budgets = signal<BudgetsObject[]>([]);

  public pots = signal<PotsObject[]>([]);
  // public pots = signal<PotsObject[]>([
  //   {
  //     id: 0,
  //     name: 'Savings',
  //     target: 2000.0,
  //     total: 159.0,
  //     theme: '#277C78',
  //     deletedAt: null,
  //   },
  //   {
  //     id: 1,
  //     name: 'Concert Ticket',
  //     target: 150.0,
  //     total: 110.0,
  //     theme: '#626070',
  //     deletedAt: null,
  //   },
  //   {
  //     id: 2,
  //     name: 'Gift',
  //     target: 150.0,
  //     total: 110.0,
  //     theme: '#82C9D7',
  //     deletedAt: null,
  //   },
  //   {
  //     id: 3,
  //     name: 'New Laptop',
  //     target: 1000.0,
  //     total: 10.0,
  //     theme: '#F2CDAC',
  //     deletedAt: null,
  //   },
  //   {
  //     id: 4,
  //     name: 'Holiday',
  //     target: 1440.0,
  //     total: 531.0,
  //     theme: '#826CB0',
  //     deletedAt: null,
  //   },
  // ]);

  public transactions = signal<TransactionsObject[]>([]);

  public transactionsRecurring = signal<TransactionsObject[]>([]);

  constructor() {}

  // set the hole data package within signal and UI update
  setStoredData(endpoint: string, data: any) {
    if (endpoint === 'balance') this.balance.set(data);
    if (endpoint === 'budgets') this.budgets.set(data);
    if (endpoint === 'pots') this.pots.set(data);
    if (endpoint === 'transactions') this.transactions.set(data);
    if (endpoint === 'transactions/recurring')
      this.transactionsRecurring.set(data);
  }

  // get the hole data package without signal and UI update
  getStoredData(endpoint: string) {
    if (endpoint === 'balance') return this.balance;
    if (endpoint === 'budgets') return this.budgets;
    if (endpoint === 'pots') return this.pots;
    if (endpoint === 'transactions') return this.transactions;
    if (endpoint === 'transactions/recurring')
      return this.transactionsRecurring;
    return null;
  }

  // add new data to the existing dataArray and update the signal and UI
  addToStoredData(endpoint: string, data: any) {
    if (endpoint === 'budgets') this.budgets.update(prev => [...prev, data]);
    if (endpoint === 'pots') this.pots.update(prev => [...prev, data]);
    if (endpoint === 'transactions') this.transactions.update(prev => [...prev, data]);
    if (endpoint === 'transactions/recurring') this.transactionsRecurring.update(prev => [...prev, data]);
  }

  // update the existing data and update the signal and UI
  updateStoredData(endpoint: string, data: any, index: number | null) {
    if (endpoint === 'balance' && data) this.balance.set(data);
    if (endpoint === 'budgets' && data && index) this.budgets.update(prev => {
      let budgetsArray = [...prev];
      budgetsArray[index] = data;
      return budgetsArray;
    });
    if (endpoint === 'pots' && data && index) this.pots.update(prev => {
      let potsArray = [...prev];
      potsArray[index] = data;
      return potsArray;
    });
    // if (endpoint === 'transactions') this.transactions = data;
    if (endpoint === 'transactions/recurring')
      this.transactionsRecurring = data;
  }

  // soft delete the existing data and update the signal and UI
  softDeleteStoredData(endpoint: string, index: number) {
    if (endpoint === 'budgets' && index) this.budgets.update(prev => {
      let budgetsArray = [...prev];
      budgetsArray[index].deletedAt = new Date().toISOString();
      return budgetsArray;
    })
    if (endpoint === 'pots' && index) this.pots.update(prev => {
      let potsArray = [...prev];
      potsArray[index].deletedAt = new Date().toISOString();
      return potsArray;
    })
  }

}
