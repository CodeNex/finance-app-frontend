import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { MainModalService } from '@services/main-modal.service';

@Injectable({
  providedIn: 'root'
})
export class ApiBudgetsService {
  private baseData: BasedataService = inject(BasedataService);
  private http: HttpClient = inject(HttpClient);
  private AuthenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  private mainModalService: MainModalService = inject(MainModalService);

  private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;

  constructor() { }

  // function to add new budgets
  // response: {message: "Budget created"}
  addNewBudget(budgetObject: any) {
    const path = 'budgets';
    const body = budgetObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
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

  // function to update existing specific budget
  // response: {message: "Budget updated"}
  updateBudget(endpoint: string, type: string, index: number, budgetObject: any) {
    const path = `budgets/${budgetObject.id}`;
    const body = budgetObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
      typeOfUpdate: `${type}`, // typeOfUpdate: 'editBudget'
    });

    this.http.put(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Budget updated') {
          // CREATE NEW TRANSACTION --->LOCAL in Datastore and at the same time remote at the server
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

  // function to delete specific budget
  // response: {message: "Budget deleted"}
  deleteBudget(budgetObject: any, index: number) {
    const path = `budgets/${budgetObject.id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
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
        console.log("BUDGET INDEX: ", index);
        
        this.dataStore.choseDataAndSoftDelete('budgets', index);
        this.mainModalService.hideMainModal();
        return;
      },
    });
  }

}
