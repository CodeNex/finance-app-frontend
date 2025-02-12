import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private baseUrl = '/dummyData';
  private http: HttpClient = inject(HttpClient);
  private authentificationService: AuthentificationService = inject(AuthentificationService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);
  public warningMessage: string = '';

  constructor() {}

  // GET data from the server
  // endpoints: balance, budgets, pots, transactions
  getData(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authentificationService.authToken}`,
      'Accept': 'application/json',
    });

    return this.http.get(`${this.baseUrl}/${endpoint}.json`, { headers }).pipe(
      tap((Response) => {
        this.dataStore.setStoredData(endpoint, Response);
      }),
      catchError((error) => {
        console.error('Fail to fetch data', error);
        return throwError(() => new Error('Fail to fetch data'));
      })
    );
  }

  // PUT data to server
  // endpoints: balance, budgets, pots, transactions
  updateData(endpoint: string, id: number, body: any): Observable<any> {
    let path = '';
    id >= 0 ? (path = `/{${id}}`) : (path = '');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authentificationService.authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http
      .put(`${this.baseUrl}/${endpoint}${path}`, body, {
        headers,
      })
      .pipe(
        tap((response) => {
          console.log('Data updated', response);
          this.warningMessage = '';
          return response;
        }),
        catchError((error) => {
          console.error('Fail to update data', error);
          return throwError(() => new Error('Fail to update data'));
        })
      );
  }

  // Load Data First Time after login

  loadDataFirstTime() {}
}
