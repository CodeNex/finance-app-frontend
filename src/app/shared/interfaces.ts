interface BalanceObject {
  id: number,
  current: number,
  income: number,
  expenses: number
}

interface BudgetsObject {
  id: number,
  category: string,
  maximum: number,
  theme: string,
  createdAt: string | null,
  deletedAt: string | null
}

interface PotsObject {
  id: number,
  name: string,
  target: number,
  total: number,
  theme: string,
  createdAt: string | null,
  deletedAt: string | null
}

interface TransactionsObject {
  id: number,
  user: number | null,
  createdAt: string | null,
  deletedAt: string | null,
  recurring: string | null,
  name: string,
  category: string,
  amount: number,
}