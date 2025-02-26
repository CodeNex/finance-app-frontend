import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { AuthenticationService } from '../../../../services/authentication.service';
import { BasedataService } from '../../../../services/basedata.service';
import { DataStoreServiceService } from '../../../../services/data-store-service.service';

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

  private baseUrl: string = this.baseData.financeApp.basics.apiData.baseUrl;

  public warningMessage: string = '';

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
        if (response.message === 'Pot created') {}
      },
      error: (error) => {
        console.error(error);
        return;
      },
    });
  }

  // function to update existing specific pot
  // response: {message: "Pot updated"}

  updatePot(potObject: any) {
    const path = `pots/${potObject.id}`;
    const body = potObject;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
    });

    this.http.put(`${this.baseUrl}/${path}`, body, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Pot updated') {}
      },
      error: (error) => {
        console.error(error);
        return;
      },
    });
  }

  // function to delete specific pot
  // response: {message: "Pot deleted"}

  deletePot(potObject: any) {
    const path = `pots/${potObject.id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthenticationService.authToken}`,
      Accept: 'application/json',
    });

    this.http.delete(`${this.baseUrl}/${path}`, { headers }).subscribe({
      next: (response: any) => {
        if (response.message === 'Pot deleted') {}
      },
      error: (error) => {
        console.error(error);
        return;
      },
    });
  }
}
