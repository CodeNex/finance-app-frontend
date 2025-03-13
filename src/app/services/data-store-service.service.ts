import { Injectable, signal } from '@angular/core';
import '../shared/interfaces.ts';

@Injectable({
  providedIn: 'root',
})
export class DataStoreServiceService {
  public balance = signal<BalanceObject>({
    id: 1,
    current: 10060.98,
    income: 5669.00,
    expenses: 2798.00,
    deleted_at: null,
    created_at: '2025-02-24T16:14:01.000000Z',
  });

  // public budgets = signal<BudgetsObject[]>([]);

  public budgets = signal<BudgetsObject[]>([
    {
      id: 1,
      name: 'Transportation',
      amount: 56.26,
      maximum: 419,
      theme: '#93674F',
      deleted_at: null,
      created_at: '2025-02-24T16:14:01.000000Z',
      last_spendings: [{
        id: 1,
        user: 1,
        name: "Initial Deposit",
        amount: 100.00,
        recurring: null,
        theme: '#d46c5e',
        budget_id: null,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "transportation"
        }
      },
      {
        id: 2,
        user: 1,
        name: "Veum-Dare",
        amount: 20.26,
        recurring: null,
        theme: '#3f82b2',
        budget_id: 4,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "transportation"
        }
      }]
    },
    {
      id: 2,
      name: 'Groceries',
      amount: 397.54,
      maximum: 350,
      theme: '#82C9D7',
      deleted_at: null,
      created_at: '2025-02-24T16:14:01.000000Z',
      last_spendings: [{
        id: 1,
        user: 1,
        name: "Initial Deposit",
        amount: 100.00,
        recurring: null,
        theme: '#626070',
        budget_id: null,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "groceries"
        }
      },
      {
        id: 2,
        user: 1,
        name: "Veum-Dare",
        amount: 20.26,
        recurring: null,
        theme: '#277c78',
        budget_id: 4,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "groceries"
        }
      }],
    },
    {
      id: 3,
      name: 'Bills',
      amount: 69.29,
      maximum: 267.59,
      theme: '#934F6F',
      deleted_at: null,
      created_at: '2025-02-24T16:14:01.000000Z',
      last_spendings: null
    },
    {
      id: 4,
      name: 'Shopping',
      amount: 207.74,
      maximum: 602.07,
      theme: '#F2CDAC',
      deleted_at: null,
      created_at: '2025-02-24T16:14:01.000000Z',
      last_spendings: [{
        id: 1,
        user: 1,
        name: "Initial Deposit",
        amount: 100.00,
        recurring: null,
        theme: '#be6c49',
        budget_id: null,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "shopping"
        }
      },
      {
        id: 2,
        user: 1,
        name: "Veum-Dare",
        amount: 20.26,
        recurring: null,
        theme: '#934f6f',
        budget_id: 4,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "shopping"
        }
      }],
    },
    {
      id: 5,
      name: 'Dining Out',
      amount: 229.81,
      maximum: 258.82,
      theme: '#277C78',
      deleted_at: null,
      created_at: '2025-02-24T16:14:01.000000Z',
      last_spendings: [{
        id: 1,
        user: 1,
        name: "Initial Deposit",
        amount: 100.00,
        recurring: null,
        theme: '#c94736',
        budget_id: null,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "diningOut"
        }
      },
      {
        id: 2,
        user: 1,
        name: "Veum-Dare",
        amount: 20.26,
        recurring: null,
        theme: '#82c9d7',
        budget_id: 4,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "diningOut"
        }
      }],
    },
    {
      id: 6,
      name: 'Entertainment',
      amount: 316.83,
      maximum: 929.42,
      theme: '#826CB0',
      deleted_at: null,
      created_at: '2025-02-24T16:14:01.000000Z',
      last_spendings: [{
        id: 1,
        user: 1,
        name: "Initial Deposit",
        amount: 100.00,
        recurring: null,
        theme: '#f2cdac',
        budget_id: null,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "entertainment"
        }
      },
      {
        id: 2,
        user: 1,
        name: "Veum-Dare",
        amount: 20.26,
        recurring: null,
        theme: '#826cb0',
        budget_id: 4,
        deleted_at: null,
        created_at: "2025-02-24T16:14:01.000000Z",
        category: '',
        budget: {
          category: "entertainment"
        }
      }],
    },
  ]);

  // public pots = signal<PotsObject[]>([]);

  public pots = signal<PotsObject[]>([
    {
      id: 0,
      name: 'Savings',
      target: 2000.0,
      total: 159.0,
      theme: '#277C78',
      created_at: null,
      deleted_at: null,
    },
    {
      id: 1,
      name: 'Concert Ticket',
      target: 150.0,
      total: 110.0,
      theme: '#626070',
      created_at: null,
      deleted_at: null,
    },
    {
      id: 2,
      name: 'Gift',
      target: 150.0,
      total: 110.0,
      theme: '#82C9D7',
      created_at: null,
      deleted_at: null,
    },
    {
      id: 3,
      name: 'New Laptop',
      target: 1750.0,
      total: 10.0,
      theme: '#F2CDAC',
      created_at: null,
      deleted_at: null,
    },
    {
      id: 4,
      name: 'Holiday',
      target: 1440.0,
      total: 531.0,
      theme: '#826CB0',
      created_at: null,
      deleted_at: null,
    },
  ]);

  // public transactions = signal<TransactionsObject[]>([]);
  public transactions = signal<TransactionsObject[]>([
    {
      id: 0,
      user: 0,
      amount: 40.24,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: null,
      theme: "#277C78",
      name: "Test Transaction 1",
      category: "entertainment",
      budget: {
        category: ""
      }
    },
    {
      id: 1,
      user: 1,
      amount: 75.65,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: null,
      theme: "#C94736",
      name: "Test Transaction 2",
      category: "groceries",
      budget: {
        category: ""
      }
    },
    {
      id: 2,
      user: 2,
      amount: 12.79,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: null,
      theme: "#af81ba",
      name: "Test Transaction 3",
      category: "education",
      budget: {
        category: ""
      }
    },
    {
      id: 3,
      user: 3,
      amount: 60.20,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: null,
      theme: "#934F6F",
      name: "Test Transaction 4",
      category: "lifestyle",
      budget: {
        category: ""
      }
    },
    {
      id: 4,
      user: 4,
      amount: 4.79,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: null,
      theme: "#97a0ac",
      name: "Test Transaction 5",
      category: "general",
      budget: {
        category: ""
      }
    }
  ]);

  // public transactionsRecurring = signal<TransactionsObject[]>([]); 
  public transactionsRecurring = signal<TransactionsObject[]>([
    {
      id: 0,
      user: 0,
      amount: 40.24,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: "2025-03-24T16:14:01.000000Z",
      theme: "#277C78",
      name: "Test Transaction 1",
      category: "entertainment",
      budget: {
        category: ""
      }
    },
    {
      id: 1,
      user: 1,
      amount: 75.65,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: "2025-03-08T16:14:01.000000Z",
      theme: "#C94736",
      name: "Test Transaction 2",
      category: "groceries",
      budget: {
        category: ""
      }
    },
    {
      id: 2,
      user: 2,
      amount: 12.79,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: "2025-03-02T16:14:01.000000Z",
      theme: "#af81ba",
      name: "Test Transaction 3",
      category: "education",
      budget: {
        category: ""
      }
    },
    {
      id: 3,
      user: 3,
      amount: 60.20,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: "2025-03-29T16:14:01.000000Z",
      theme: "#934F6F",
      name: "Test Transaction 4",
      category: "lifestyle",
      budget: {
        category: ""
      }
    },
    {
      id: 4,
      user: 4,
      amount: 4.79,
      budget_id: null,
      created_at: "2025-02-24T16:14:01.000000Z",
      deleted_at: null,
      recurring: "2025-03-16T16:14:01.000000Z",
      theme: "#97a0ac",
      name: "Test Transaction 5",
      category: "general",
      budget: {
        category: ""
      }
    }
  ]);

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
    if (endpoint === 'budgets') this.budgets.update((prev) => [data, ...prev]);
    if (endpoint === 'pots') this.pots.update((prev) => [data, ...prev]);
    if (endpoint === 'transactions')
      this.transactions.update((prev) => [...prev, data]);
    if (endpoint === 'transactions/recurring')
      this.transactionsRecurring.update((prev) => [...prev, data]);
  }

  // chose what kind of data to soft delete and update the signal and UI
  choseDataAndSoftDelete(endpoint: string, index: number) {
    if (endpoint === 'budgets' && index >= 0)
      this.budgets.update((prev) => {
        return this.softdeleted_ata(prev, index);
      });
    if (endpoint === 'pots' && index >= 0)
      this.pots.update((prev) => {
        return this.softdeleted_ata(prev, index);
      });
    if (endpoint === 'transactions/recurring' && index >= 0)
      this.transactionsRecurring.update((prev) => {
        return this.softdeleted_ata(prev, index);
      });
  }

  // soft delete data
  softdeleted_ata(prev: any, index: number) {
    let array = [...prev];
    array[index].deleted_at = new Date().toISOString();
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
    if (endpoint === 'budgets' && data && index >= 0) {
      this.budgets.update((prev) => {
        return prev.map((item, i) => (i === index ? { ...data } : item));
      });
    }
  
    if (endpoint === 'pots' && data && index >= 0) {
      this.pots.update((prev) => {
        return prev.map((item, i) => (i === index ? { ...data } : item));
      });
    }
  }
}
