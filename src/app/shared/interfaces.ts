interface BalanceObject {
  id: number;
  current: number;
  income: number;
  expenses: number;
  deleted_at: string | null,
  created_at: string | null 
}

interface BudgetsObject {
  id: number;
  name: string;
  amount: number;
  maximum: number;
  theme: string;
  created_at: string | null;
  deleted_at: string | null;
  last_spendings: TransactionsObject[] | null;
}

interface PotsObject {
  id: number;
  name: string;
  target: number;
  total: number;
  theme: string;
  created_at: string | null;
  deleted_at: string | null;
}

interface TransactionsObject {
  id: number;
  user: number | null;
  amount: number | null;
  budget_id: number	| null;
  created_at: string | null;
  deleted_at: string | null;
  recurring: string | null;
  theme: string,
  name: string;
  category: string;
  budget: {
    category: string;
  } | null;
}

interface testRecurringTransactionsObject {
  id: number;
  user: number | null;
  amount: number | null;
  budget_id: number	| null;
  execute_on: string | null;
  created_at: string | null;
  deleted_at: string | null;
  recurring: string | null;
  theme: string,
  name: string;
  category: string;
}
