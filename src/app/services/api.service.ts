import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { LoginService } from './login.service';
import { DataStoreServiceService } from './data-store-service.service';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  private baseUrl = "/public/dummyData/";
  private http: HttpClient = inject(HttpClient);
  private logIn: LoginService = inject(LoginService);
  private dataStore: DataStoreServiceService = inject(DataStoreServiceService);

  constructor() { }

  // get data from the server
  // endpoints: balance, budgets, pots, transactions
  getData(endpoint: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer dein-token-hier',
      'Custom-Header': 'value'
    });

    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers });
  }

}
