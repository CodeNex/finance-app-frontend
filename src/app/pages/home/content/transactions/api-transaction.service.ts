import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '../../../../services/authentication.service';
import { APIService } from '../../../../services/api.service';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { BasedataService } from '../../../../services/basedata.service';

@Injectable({
  providedIn: 'root',
})
export class ApiTransactionService {
  private AuthenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  private APIService: APIService = inject(APIService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  private baseData: BasedataService = inject(BasedataService);
  private http: HttpClient = inject(HttpClient);

  private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;

  constructor() {}

  // blueprint for transaction object
  public currentTransaction: any = {
    transaction_id: 0,
    user_id: 0,
    amount: 0,
    budget_id: null,
    created_at: null,
    execute_on: null,
    deleted_at: null,
    recurring: null,
    recurring_id: null,
    theme: '',
    sender: '',
    receiver: '',
    name: '',
    category: 'general',
    type: 'debit',
  };

  // ########################################
  // # Get current Date
  // ########################################

  private currentDate: string = '';

  public getCurrentDate() {
    this.currentDate = new Date().toISOString();
  }

  // ########################################
  // # Start transaction from TransactionsComponent
  // ########################################

  public startTransactionFromTransactions(transactionObject: any, from: string) {
    this.currentTransaction = transactionObject;
    this.getCurrentDate();
    this.addNewTransaction(this.currentTransaction, from);
  }

  // ########################################
  // # Start transaction from PotsComponent
  // ########################################

  public startTransactionFromPots(type: string, date: string, amount: number, pot_id: number, theme: string) {
    this.mergeAndOverwriteTransactionWithPot(type, date, amount, pot_id, theme);
    this.getCurrentDate();
    this.addNewTransaction(this.currentTransaction, 'pots');
  }

  public mergeAndOverwriteTransactionWithPot(type: string, date: string, amount: number, pot_id: number, theme: string) {
    this.currentTransaction.amount = amount;
    this.currentTransaction.execute_on = date;
    this.currentTransaction.theme = theme;
    this.currentTransaction.sender = type === 'potAdd' ? 'balance.current' : `potID_${pot_id}`;
    this.currentTransaction.receiver = type === 'potAdd' ? `potID_${pot_id}` : 'balance.current';
    this.currentTransaction.name = type === 'potAdd' ? 'Add Money to Pots' : 'Withdraw Money from Pots';
    this.currentTransaction.type = type === 'potAdd' ? 'debit' : 'credit';
  }

  // ########################################
  // # POST the transaction object to the server
  // ########################################

  // response: {message: "Transaction created"} ???
  addNewTransaction(transactionObject: any, from: string) {
    const path = 'transactions';
    const body = transactionObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
    });

    this.http.post(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Transaction created') {
        }
      },
      error: (error) => {
        this.updateDataStoreArrays(transactionObject);
        this.updateBalanceSignal(transactionObject, from);
        console.error(error);
        return;
      },
    });
  }

  // ########################################
  // # Update data-store-service.service
  // ########################################

  private updateDataStoreArrays(transactionObject: any) {
    if (
      transactionObject.execute_on <= this.currentDate ||
      transactionObject.execute_on === null
    ) {
      this.dataStore.addToStoredData('transactions', transactionObject);
    }
    if (transactionObject.recurring) {
      this.dataStore.addToStoredData(
        'transactions/recurring',
        transactionObject
      );
    }
  }

  // ########################################
  // # Update Balance Signal Object
  // ########################################

  private updateBalanceSignal(transactionObject: any, from: string) {
    let balanceBlueprint = this.dataStore.balance();
    transactionObject.type === 'debit'
      ? (balanceBlueprint.current -= transactionObject.amount)
      : (balanceBlueprint.current += transactionObject.amount);

    if (from === 'transactions') {
      if (transactionObject.type === 'debit') {
        balanceBlueprint.expenses += transactionObject.amount;
      }
      if (transactionObject.type === 'credit') {
        balanceBlueprint.income += transactionObject.amount;
      }
    }
    this.dataStore.setStoredData('balance', balanceBlueprint);
  }
}
