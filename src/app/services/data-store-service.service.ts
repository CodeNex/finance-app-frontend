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
}
