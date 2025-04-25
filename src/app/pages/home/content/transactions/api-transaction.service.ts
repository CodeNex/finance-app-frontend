import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@services/authentication.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { BasedataService } from '@services/basedata.service';
import { MainModalService } from '@services/main-modal.service';

/**
 * * * ApiTransactionService
 * * This service is responsible for handling API transactions in the application.
 * * It provides methods to start a transaction, add a new transaction, update the data store arrays,
 * * update the balance signal, and soft-delete a recurring transaction.
 * * * It uses the HttpClient to make API requests and the DataStoreServiceService to manage the data store.
 * * It also uses the BasedataService to get the base URL for the API.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiTransactionService {
  // #region Service Setup (DI, Outputs, Template Refs, Subscription)
  private AuthenticationService = inject(AuthenticationService);
  private dataStore = inject(DataStoreServiceService);
  private baseData = inject(BasedataService);
  private http = inject(HttpClient);
  private mainModalService = inject(MainModalService);

  private baseUrl: string = this.baseData.baseUrl;

  public currentTransaction: TransactionsObject = {
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

  private currentDate: string = '';
  // #endregion

  // #region Helper Functions
  public getCurrentDate(): void {
    this.currentDate = new Date().toISOString();
  }
  // #endregion

  // #region Start Transaction from TransactionsComponent
  /**
   * @description - This function is responsible for starting a transaction from the transactions component.
   * @param transactionObject - The transaction object to be started. 
   * @param from - The source of the transaction (either 'transactions' or 'pots'). 
   */
  public startTransactionFromTransactions(
    transactionObject: TransactionsObject,
    from: string
  ) {
    this.currentTransaction = transactionObject;
    this.getCurrentDate();
    this.addNewTransaction(this.currentTransaction, from);
  }
  // #endregion

  // #region Start Transaction from PotsComponent
  /**
   * @description - This function is responsible for starting a transaction from the pots component.	
   * @param type - The type of transaction (either 'potAdd' or 'potWithdraw'). 
   * @param date - The date of the transaction. 
   * @param amount - The amount of the transaction. 
   * @param pot_id - The ID of the pot. 
   * @param theme - The theme of the transaction. 
   */
  public startTransactionFromPots(
    type: string,
    date: string,
    amount: number,
    pot_id: number,
    theme: string
  ): void {
    this.currentTransaction = {
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
    this.mergeAndOverwriteTransactionWithPot(type, date, amount, pot_id, theme);
    this.getCurrentDate();
    this.addNewTransaction(this.currentTransaction, 'pots');
  }

  /**
   * @description - This function is responsible for merging and overwriting the transaction with the pot data.
   * @param type - The type of transaction (either 'potAdd' or 'potWithdraw'). 
   * @param date - The date of the transaction. 
   * @param amount - The amount of the transaction. 
   * @param pot_id - The ID of the pot. 
   * @param theme - The theme of the transaction. 
   */
  private mergeAndOverwriteTransactionWithPot(
    type: string,
    date: string,
    amount: number,
    pot_id: number,
    theme: string
  ): void {
    this.currentTransaction.amount = amount;
    this.currentTransaction.execute_on = date;
    this.currentTransaction.theme = theme;
    this.currentTransaction.sender =
      type === 'potAdd' ? 'balance.current' : `potID_${pot_id}`;
    this.currentTransaction.receiver =
      type === 'potAdd' ? `potID_${pot_id}` : 'balance.current';
    this.currentTransaction.name =
      type === 'potAdd' ? 'Add Money to Pots' : 'Withdraw Money from Pots';
    this.currentTransaction.type = type === 'potAdd' ? 'debit' : 'credit';
  }
  // #endregion

  // #region Post Transaction to API
  // response: {message: "Transaction created"} ???
  /**
   * @description - This function is responsible for adding a new transaction to the API.
   * @param transactionObject - The transaction object to be added.
   * @param from - The source of the transaction (either 'transactions' or 'pots'). 
   */
  private addNewTransaction(transactionObject: TransactionsObject, from: string) {
    const path =
      transactionObject.recurring === null ? 'transactions' : 'recurrings';
    const body = transactionObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
    });

    this.http.post(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response) => {
        // if (response.message === 'Transaction created') {
        //   this.updateDataStoreArrays(transactionObject, from);
        //   this.updateBalanceSignal(transactionObject, from);
        // }
        // if (response.message === 'Recurring created') {
        //   this.updateDataStoreArrays(response, from);
        //   this.updateBalanceSignal(response, from);
        // }
      },
      error: (error) => {
        this.updateDataStoreArrays(transactionObject, from);
        this.updateBalanceSignal(transactionObject, from);
        console.error(error);
        return;
      },
    });
  }
  // #endregion

  // #region Update DataStore & Balance Signal
  /**
   * @description - This function is responsible for updating the data store arrays based on the transaction object.
   * @param transactionObject - The transaction object to be updated.
   * @param from - The source of the transaction (either 'transactions' or 'pots'). 
   */
  private updateDataStoreArrays(transactionObject: TransactionsObject, from: string): void {
    if (
      (transactionObject.execute_on && transactionObject.execute_on <= this.currentDate) ||
      transactionObject.execute_on === null
    ) {
      this.dataStore.addToStoredData('transactions', transactionObject);
    }
    if (transactionObject.recurring) {
      this.dataStore.addToStoredData('recurrings', transactionObject);
    }
    if (
      from === 'transactions' &&
      transactionObject.type === 'debit' &&
      ((transactionObject.execute_on && transactionObject.execute_on <= this.currentDate) ||
        transactionObject.execute_on === null)
    ) {
      this.updateBudgetsArray(transactionObject);
    }
  }

  /**
   * @description - This function is responsible for updating the budgets array in the data store.
   * @param transactionObject - The transaction object to be updated.
   */
  private updateBudgetsArray(transactionObject: TransactionsObject): void {
    let budgets = this.dataStore.budgets();
    let matchingBudgetIndex = budgets.findIndex((budget) => {
      return (
        budget.name
          .replace(/^./, (c) => c.toLowerCase())
          .replace(/\s+/g, '') === transactionObject.category
      );
    });
    if (matchingBudgetIndex === -1) return;
    if (matchingBudgetIndex !== -1) {
      budgets[matchingBudgetIndex].last_spendings === null
        ? (budgets[matchingBudgetIndex].last_spendings = [transactionObject])
        : budgets[matchingBudgetIndex].last_spendings?.unshift(
            transactionObject
          );
      budgets[matchingBudgetIndex].amount += transactionObject.amount;
      this.dataStore.setStoredData('budgets', budgets);
    }
  }

  /**
   * @description - This function is responsible for updating the balance signal in the data store.
   * @param transactionObject - The transaction object to be updated.
   * @param from - The source of the transaction (either 'transactions' or 'pots').
   */
  private updateBalanceSignal(transactionObject: TransactionsObject, from: string): void {
    let balanceBlueprint = this.dataStore.balance();
    transactionObject.type === 'debit'
      ? (balanceBlueprint.balance -= transactionObject.amount)
      : (balanceBlueprint.balance += transactionObject.amount);
    if (from === 'transactions') {
      if (transactionObject.type === 'debit') {
        // balanceBlueprint.expenses += transactionObject.amount;
      }
      if (transactionObject.type === 'credit') {
        // balanceBlueprint.income += transactionObject.amount;
      }
    }
    this.dataStore.setStoredData('balance', balanceBlueprint);
  }
  // #endregion

  // #region Soft-Delete Recurring Transaction
  /**
   * @description - This function is responsible for soft-deleting a recurring transaction.	
   * @param recurringObject - The recurring object to be deleted.
   * @param index - The index of the recurring object in the data store. 
   */
  public deleteRecurring(recurringObject: TransactionsObject, index: number): void {
    const path = `recurrings/${recurringObject.recurring_id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
    });

    this.http.delete(`${this.baseUrl}/${path}`, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Recurring deleted') {
          // this.dataStore.choseDataAndSoftDelete('recurrings', index);
          // this.mainModalService.hideMainModal();
        }
      },
      error: (error) => {
        console.error(error);
        this.dataStore.choseDataAndSoftDelete('recurrings', index);
        this.mainModalService.hideMainModal();
        return;
      },
    });
  }
  // #endregion
}
