import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthenticationService } from '@services/authentication.service';
import { BasedataService } from '@services/basedata.service';
import { DataStoreServiceService } from '@services/data-store-service.service';
import { MainModalService } from '@services/main-modal.service';

/**
 * * * ApiPotsService
 * This service is responsible for managing the pots in the application.
 * It uses the HttpClient to make API calls to the server.
 * It provides methods to add, update, and delete pots.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiPotsService {
  // #region Service Setup
  private baseData = inject(BasedataService);
  private http = inject(HttpClient);
  private authService = inject(AuthenticationService);
  private dataStore = inject(DataStoreServiceService);
  private mainModalService = inject(MainModalService);

  private baseUrl: string = this.baseData.baseUrl;
  // #endregion

  /**
   * @description - This function creates a new pot in the database
   * @returns - The response from the server
   * @param potObject - The pot object to be created
   */
  // response: {message: "Pot created"}
  addNewPot(potObject: PotsObject) {
    const path = 'pots';
    const body = potObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.authToken}`,
      Accept: 'application/json',
    });

    this.http.post(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Pot created successfully') {
          this.dataStore.addToStoredData('pots', potObject);
          console.log('Pot created');
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

  /**
   * @description - This function updates a pot in the database
   * @returns - The response from the server
   * @param endpoint - The endpoint to be updated
   * @param type - The type of update (editPot, addMoneyPot, withdrawMoneyPot)
   * @param index - The index of the pot to be updated
   * @param potObject - The pot object to be updated
   */
  // response: {message: "Pot updated"}
  updatePot(
    endpoint: string,
    type: string,
    index: number,
    potObject: PotsObject
  ) {
    
    
    const path = `pots/${potObject.id}`;
    const body = potObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.authToken}`,
      Accept: 'application/json',
      typeOfUpdate: `${type}`, // typeOfUpdate: 'editPot' or 'addMoneyPot' or 'withdrawMoneyPot'
    });

    this.http.put(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Pot updated successfully') {
          this.dataStore.editStoredData(endpoint, index, potObject);
          this.mainModalService.hideMainModal();
          console.log(response);
        }
      },
      error: (error) => {
        this.dataStore.editStoredData(endpoint, index, potObject);
        this.mainModalService.hideMainModal();
        // console.error(error);
        return;
      },
    });
  }

  /**
   * @description - This function deletes a pot in the database
   * @returns - The response from the server
   * @param potObject - The pot object to be deleted
   * @param index - The index of the pot to be deleted
   */
  // response: {message: "Pot deleted"}
  deletePot(potObject: any, index: number) {
    const path = `pots/${potObject.id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.authToken}`,
      Accept: 'application/json',
    });

    this.http.delete(`${this.baseUrl}/${path}`, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Pot deleted successfully') {
          this.dataStore.choseDataAndSoftDelete('pots', index);
          this.mainModalService.hideMainModal();
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
