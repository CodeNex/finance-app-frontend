import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { MainModalService } from '@services/main-modal.service';

/**
 * * * ApiBudgetsService
 * * This service is responsible for managing the budgets in the application.
 * * It uses the HttpClient to make API calls to the server.
 * * It uses the BasedataService to get the base URL for the API calls.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiBudgetsService {
  // #region Service Setup
  private baseData = inject(BasedataService);
  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);
  private dataStore = inject(DataStoreServiceService);
  private mainModalService = inject(MainModalService);

  private baseUrl: string = this.baseData.baseUrl;
  // #endregion

  /**
   * @description - This function creates a new budget in the database
   * @returns - The response from the server
   * @param budgetObject - The budget object to be created
   */
  // response: {message: "Budget created"}
  addNewBudget(budgetObject: BudgetsObject) {
    const path = 'budgets';
    const body = budgetObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.authToken}`,
      Accept: 'application/json',
    });

    this.http.post(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Pot created') {
        }
      },
      error: (error) => {
        this.dataStore.addToStoredData('budgets', budgetObject);
        console.log('Budget created');
        console.error(error);
        return;
      },
    });
  }

  /**
   * * @description - This function updates a budget in the database
   * * @param endpoint - The endpoint to be updated
   * * @param type - The type of update (editBudget, deleteBudget)
   * * @param index - The index of the budget to be updated
   * * @param budgetObject - The budget object to be updated
   * * @returns - The response from the server
   */
  // response: {message: "Budget updated"}
  updateBudget(
    endpoint: string,
    type: string,
    index: number,
    budgetObject: BudgetsObject
  ) {
    const path = `budgets/${budgetObject.id}`;
    const body = budgetObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.authToken}`,
      Accept: 'application/json',
      typeOfUpdate: `${type}`, // typeOfUpdate: 'editBudget'
    });

    this.http.put(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Budget updated successfully') {
          this.dataStore.editStoredData(endpoint, index, budgetObject);
          this.mainModalService.hideMainModal();
        }
      },
      error: (error) => {
        this.dataStore.editStoredData(endpoint, index, budgetObject);
        this.mainModalService.hideMainModal();
        console.error(error);
        return;
      },
    });
  }

  /**
   * @description - This function deletes a budget in the database
   * @returns - The response from the server
   * @param budgetObject - The budget object to be deleted
   * @param index - The index of the budget to be deleted
   */
  // response: {message: "Budget deleted"}
  deleteBudget(budgetObject: BudgetsObject, index: number) {
    const path = `budgets/${budgetObject.id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.authToken}`,
      Accept: 'application/json',
    });

    this.http.delete(`${this.baseUrl}/${path}`, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Budget deleted') {
          console.log('Budget deleted');
        }
      },
      error: (error) => {
        console.error(error);
        console.log('BUDGET INDEX: ', index);
        this.dataStore.choseDataAndSoftDelete('budgets', index);
        this.mainModalService.hideMainModal();
        return;
      },
    });
  }
}
