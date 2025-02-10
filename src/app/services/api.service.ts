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
    });

    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers });
  }

  // PUT data to server
  // endpoints: balance, budgets, pots, transactions
  updateData(endpoint: string, id: number, body: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.logIn.token}`,
      'Content-Type': 'application/json',
    });

    if (id >= 0) {
      return this.http
        .put(`${this.baseUrl}/${endpoint}/{${id}}`, body, {
          headers,
        })
        .pipe(
          catchError((error) => {
            console.error('Fail to update data', error);
            return throwError(() => new Error('Fail to update data'));
          })
        );
    } else {
      return this.http
        .put(`${this.baseUrl}/${endpoint}`, body, {
          headers,
        })
        .pipe(
          catchError((error) => {
            console.error('Fail to update data', error);
            return throwError(() => new Error('Fail to update data'));
          })
        );
    }
  }
}
