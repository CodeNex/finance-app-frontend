import { Injectable, signal } from '@angular/core';
import '../shared/interfaces.ts';

@Injectable({
  providedIn: 'root',
})
export class DataStoreServiceService {
  public balance = signal<BalanceObject>({
    id: 1,
    current: 2500.0,
    income: 3250.0,
    expenses: 2188.0,
  });

  public budgets = signal<BudgetsObject[]>([]);

  // public pots = signal<PotsObject[]>([]);

  public pots = signal<PotsObject[]>([
    {
      id: 0,
      name: 'Savings',
      target: 2000.0,
      total: 159.0,
      theme: '#277C78',
      createdAt: null,
      deletedAt: null,
    },
    {
      id: 1,
      name: 'Concert Ticket',
      target: 150.0,
      total: 110.0,
      theme: '#626070',
      createdAt: null,
      deletedAt: null,
    },
    {
      id: 2,
      name: 'Gift',
      target: 150.0,
      total: 110.0,
      theme: '#82C9D7',
      createdAt: null,
      deletedAt: null,
    },
    {
      id: 3,
      name: 'New Laptop',
      target: 1750.0,
      total: 10.0,
      theme: '#F2CDAC',
      createdAt: null,
      deletedAt: null,
    },
    {
      id: 4,
      name: 'Holiday',
      target: 1440.0,
      total: 531.0,
      theme: '#826CB0',
      createdAt: null,
      deletedAt: null,
    },
  ]);

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
    if (endpoint === 'budgets') this.budgets.update((prev) => [...prev, data]);
    if (endpoint === 'pots') this.pots.update((prev) => [...prev, data]);
    if (endpoint === 'transactions')
      this.transactions.update((prev) => [...prev, data]);
    if (endpoint === 'transactions/recurring')
      this.transactionsRecurring.update((prev) => [...prev, data]);
  }

  // chose what kind of data to soft delete and update the signal and UI
  choseDataAndSoftDelete(endpoint: string, index: number) {
    if (endpoint === 'budgets' && index >= 0)
      this.budgets.update((prev) => {
        return this.softDeleteData(prev, index);
      });
    if (endpoint === 'pots' && index >= 0)
      this.pots.update((prev) => {
        return this.softDeleteData(prev, index);
      });
    if (endpoint === 'transactions/recurring' && index >= 0)
      this.transactionsRecurring.update((prev) => {
        return this.softDeleteData(prev, index);
      });
  }

  // soft delete data
  softDeleteData(prev: any, index: number) {
    let array = [...prev];
    array[index].deletedAt = new Date().toISOString();
    return array;
  }

  // update the balance and update the signal and UI
  updateStoredBalance(key: string, amount: number) {
    this.balance.update((prev) => {
      let prevBalance = { ...prev };
      if (key === 'current') prevBalance.current += amount;
      if (key === 'income') prevBalance.income += amount;
      if (key === 'expenses') prevBalance.expenses += amount;
      return prevBalance;
    });
  }

  // update the existing data and update the signal and UI
  editStoredData(endpoint: string, index: number, data: any) {
    
    
    if (endpoint === 'budgets' && data && index >= 0)
      this.budgets.update((prev) => {
        let budgetsArray = [...prev];
        budgetsArray[index].category = data.category;
        budgetsArray[index].maximum = data.maximum;
        budgetsArray[index].theme = data.theme;
        return budgetsArray;
      });
    if (endpoint === 'pots' && data && index >= 0)
      this.pots.update((prev) => {
        console.log('hallo welt', prev);
        let potsArray = [...prev];
        potsArray[index].name = data.name;
        potsArray[index].target = data.target;
        potsArray[index].total = data.total;
        potsArray[index].theme = data.theme;
        return potsArray;
      });
  }
}
