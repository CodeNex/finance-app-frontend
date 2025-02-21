import { Injectable, signal } from '@angular/core';
import '../shared/interfaces.ts';

@Injectable({
  providedIn: 'root',
})
export class DataStoreServiceService {
  public balance = signal<BalanceObject>({
    "id": 1,
    "current": 0.00,
    "income": 3250.00,
    "expenses": 2188.00
  });

  public budgets = signal<BudgetsObject[]>([]);

  // public pots: PotsObject[] = [];
  public transactions: TransactionsObject[] = [];
  public transactionsRecurring: TransactionsObject[] = [];

  public pots: PotsObject[] = [
    {
      id: 0,
      name: 'Savings',
      target: 2000.0,
      total: 159.0,
      theme: '#277C78',
      deletedAt: null,
    },
    {
      id: 1,
      name: 'Concert Ticket',
      target: 150.0,
      total: 110.0,
      theme: '#626070',
      deletedAt: null,
    },
    {
      id: 2,
      name: 'Gift',
      target: 150.0,
      total: 110.0,
      theme: '#82C9D7',
      deletedAt: null,
    },
    {
      id: 3,
      name: 'New Laptop',
      target: 1000.0,
      total: 10.0,
      theme: '#F2CDAC',
      deletedAt: null,
    },
    {
      id: 4,
      name: 'Holiday',
      target: 1440.0,
      total: 531.0,
      theme: '#826CB0',
      deletedAt: null,
    },
  ];

  constructor() {}

  getStoredData(endpoint: string) {
    if (endpoint === 'balance') return this.balance;
    if (endpoint === 'budgets') return this.budgets;
    if (endpoint === 'pots') return this.pots;
    if (endpoint === 'transactions') return this.transactions;
    if (endpoint === 'transactions/recurring')
      return this.transactionsRecurring;
    return;
  }

  setStoredData(endpoint: string, data: any) {
    if (endpoint === 'balance') this.balance = data;
    if (endpoint === 'budgets') this.budgets = data;
    if (endpoint === 'pots') this.pots = data;
    if (endpoint === 'transactions') this.transactions = data;
    if (endpoint === 'transactions/recurring')
      this.transactionsRecurring = data;
  }
}
