import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { LoginService } from './login.service';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private baseUrl = '/public/dummyData/';
  private http: HttpClient = inject(HttpClient);
  private logIn: LoginService = inject(LoginService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  constructor() {}

  // GET data from the server
  // endpoints: balance, budgets, pots, transactions
  getData(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.logIn.token}`,
      'Accept': 'application/json',
    });

    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers }).pipe(
      tap((Response) => {
        this.dataStore.setStoredData(endpoint, Response);
        console.log('Data fetched', Response);
        return true;
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
      Authorization: `Bearer ${this.logIn.token}`,
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
          return response;
        }),
        catchError((error) => {
          console.error('Fail to update data', error);
          return throwError(() => new Error('Fail to update data'));
        })
      );
  }
}
