import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '../../../../services/authentication.service';
import { BasedataService } from '../../../../services/basedata.service';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';
import { MainModalService } from '../../../../services/main-modal.service';

@Injectable({
  providedIn: 'root',
})
export class ApiPotsService {
  private baseData: BasedataService = inject(BasedataService);
  private http: HttpClient = inject(HttpClient);
  private AuthenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  private mainModalService: MainModalService = inject(MainModalService);

  private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;

  constructor() {}

  // function to add new pots
  // response: {message: "Pot created"}
  addNewPot(potObject: any) {
    const path = 'pots';
    const body = potObject;
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
        this.dataStore.addToStoredData('pots', potObject);
        console.log('Pot created');
        console.error(error);
        return;
      },
    });
  }

  // function to update existing specific pot
  // response: {message: "Pot updated"}
  updatePot(endpoint: string, type: string, index: number, potObject: any) {
    const path = `pots/${potObject.id}`;
    const body = potObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
      typeOfUpdate: `${type}`, // typeOfUpdate: 'editPot' or 'addMoneyPot' or 'withdrawMoneyPot'
    });

    this.http.put(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Pot updated') {
          // CREATE NEW TRANSACTION --->LOCAL in Datastore and at the same time remote at the server
        }
      },
      error: (error) => {
        this.dataStore.editStoredData(endpoint, index, potObject);
        this.mainModalService.hideMainModal();
        console.error(error);
        return;
      },
    });
  }

  // function to delete specific pot
  // response: {message: "Pot deleted"}
  deletePot(potObject: any, index: number) {
    const path = `pots/${potObject.id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
    });

    this.http.delete(`${this.baseUrl}/${path}`, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Pot deleted') {
          console.log('Pot deleted');
        }
      },
      error: (error) => {
        console.error(error);
        this.dataStore.choseDataAndSoftDelete('pots', index);
        this.mainModalService.hideMainModal();
        return;
      },
    });
  }
}
