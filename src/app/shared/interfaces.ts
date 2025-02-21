interface BalanceObject {
  current: number,
  income: number,
  expenses: number
}

interface BudgetsObject {
  id: number,
  category: string,
  maximum: number,
  theme: string
}

interface PotsObject {
  id: number,
  name: string,
  target: number,
  total: number,
  theme: string,
  deletedAt: string | null
}

interface TransactionsObject {
  id: number,
  user: number | null,
  name: string,
  category: string,
  date: string,
  amount: number,
  recurring: boolean
}