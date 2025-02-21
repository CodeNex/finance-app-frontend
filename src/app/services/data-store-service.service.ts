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

  setStoredData(endpoint: string, data: any) {
    if (endpoint === 'balance') this.balance.set(data);
    if (endpoint === 'budgets') this.budgets = data;
    if (endpoint === 'pots') this.pots = data;
    if (endpoint === 'transactions') this.transactions = data;
    if (endpoint === 'transactions/recurring')
      this.transactionsRecurring = data;
  }

  updateStoredData(endpoint: string, data: any) {
    if (endpoint === 'balance') this.balance.set(data);
    if (endpoint === 'budgets') this.budgets = data;
    if (endpoint === 'pots') this.pots = data;
    if (endpoint === 'transactions') this.transactions = data;
    if (endpoint === 'transactions/recurring')
      this.transactionsRecurring = data;
  }
 
}
