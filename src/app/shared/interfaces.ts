interface DateRange {
  start: number;
  end: number;
}

interface BudgetCalculations {
  budgetName: string;
  maximum: number;
  calculatedSpent: number;
  remaining: number;
  isTooMuchSpent: boolean;
}

interface SummaryItem {
  amount: number;
  created_at: null;
  deleted_at: null;
  id: number;
  last_spendings: [];
  maximum: number;
  name: string;
  theme: string;
}

interface BalanceObject {
  balance: number;
}
interface BudgetsObject {
  id: number;
  name: string;
  amount: number;
  maximum: number;
  time_frame: string;
  theme: string;
  created_at: string | null;
  deleted_at: string | null;
  last_spendings: TransactionsObject[] | null;
}

interface BudgetsObjectLike {
  id?: number;
  name?: string;
  amount?: number;
  maximum?: number;
  time_frame?: string;
  theme?: string;
  created_at?: string | null;
  deleted_at?: string | null;
  last_spendings?: TransactionsObject[] | null;
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
  transaction_id: number;
  user_id: number | null;
  amount: number;
  budget_id: number | null;
  created_at: string | null;
  deleted_at: string | null;
  execute_on: string | null;
  recurring: string | null;
  recurring_id: number | null;
  theme: string;
  name: string;
  sender: string | null;
  receiver: string | null;
  category: null | string;
  type: string;
}

interface testRecurringTransactionsObject {
  id: number;
  user: number | null;
  amount: number | null;
  budget_id: number | null;
  execute_on: string | null;
  created_at: string | null;
  deleted_at: string | null;
  recurring: string | null;
  recurring_id: string | null;
  theme: string;
  name: string;
  category: string;
}
